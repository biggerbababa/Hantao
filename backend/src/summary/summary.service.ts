import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(roomId: string) {
    const expenses = await this.prisma.expense.findMany({
      where: { roomId },
      include: {
        payer: true,
        splits: { include: { user: true } },
      },
    });

    const users = await this.prisma.user.findMany({ where: { roomId } });

    // balance[userId] = net amount (positive = owed money, negative = owes money)
    const balance: Record<string, number> = {};
    users.forEach((u) => (balance[u.id] = 0));

    for (const expense of expenses) {
      const splitCount = expense.splits.length;
      if (splitCount === 0) continue;
      const perPerson = expense.amount / splitCount;

      // Payer gains credit
      balance[expense.payerId] = (balance[expense.payerId] || 0) + expense.amount;

      // Each person in split owes their share
      for (const split of expense.splits) {
        balance[split.userId] = (balance[split.userId] || 0) - perPerson;
      }
    }

    // Settle debts using greedy algorithm
    const settlements: { from: string; fromName: string; to: string; toName: string; amount: number }[] = [];
    const userMap = Object.fromEntries(users.map((u) => [u.id, u.nickname]));

    const debtors = users
      .filter((u) => balance[u.id] < -0.01)
      .map((u) => ({ id: u.id, amount: -balance[u.id] }));
    const creditors = users
      .filter((u) => balance[u.id] > 0.01)
      .map((u) => ({ id: u.id, amount: balance[u.id] }));

    let i = 0;
    let j = 0;
    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i].amount, creditors[j].amount);
      settlements.push({
        from: debtors[i].id,
        fromName: userMap[debtors[i].id],
        to: creditors[j].id,
        toName: userMap[creditors[j].id],
        amount: Math.round(pay * 100) / 100,
      });
      debtors[i].amount -= pay;
      creditors[j].amount -= pay;
      if (debtors[i].amount < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }

    const totalsByUser = users.map((u) => ({
      userId: u.id,
      nickname: u.nickname,
      totalPaid: expenses
        .filter((e) => e.payerId === u.id)
        .reduce((sum, e) => sum + e.amount, 0),
      netBalance: Math.round(balance[u.id] * 100) / 100,
    }));

    return { totalsByUser, settlements };
  }
}
