import { IsString, IsNotEmpty, IsNumber, IsArray, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  category: string;

  @IsString()
  @IsNotEmpty()
  payerId: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsArray()
  splitUserIds: string[];
}
