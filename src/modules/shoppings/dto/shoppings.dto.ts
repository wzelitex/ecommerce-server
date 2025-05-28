import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class CreateShoppingDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsArray()
  @IsNotEmpty()
  size: string;
}
