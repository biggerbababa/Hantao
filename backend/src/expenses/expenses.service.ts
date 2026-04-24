import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './expenses.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async createExpense(dto: CreateExpenseDto) {
    const expense = await this.prisma.expense.create({
      data: {
        description: dto.description,
        amount: dto.amount,
        category: dto.category,
        payerId: dto.payerId,
        roomId: dto.roomId,
        splits: {
          create: dto.splitUserIds.map((userId) => ({ userId })),
        },
      },
      include: { splits: { include: { user: true } }, payer: true },
    });
    return expense;
  }

  async getExpensesByRoom(roomId: string) {
    return this.prisma.expense.findMany({
      where: { roomId },
      include: {
        payer: true,
        splits: { include: { user: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
