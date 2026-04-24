import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './expenses.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() dto: CreateExpenseDto) {
    return this.expensesService.createExpense(dto);
  }

  @Get('room/:roomId')
  getByRoom(@Param('roomId') roomId: string) {
    return this.expensesService.getExpensesByRoom(roomId);
  }
}
