import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductShoeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform((value) => Number(value))
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform((value) => Number(value))
  quantity: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  material: string;

  @IsString()
  size: string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
