import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RoomsModule } from './rooms/rooms.module';
import { ExpensesModule } from './expenses/expenses.module';
import { SummaryModule } from './summary/summary.module';

@Module({
  imports: [PrismaModule, RoomsModule, ExpensesModule, SummaryModule],
})
export class AppModule {}
