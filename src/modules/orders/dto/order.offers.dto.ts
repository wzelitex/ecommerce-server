import { IsNumber, IsNotEmpty } from 'class-validator';

export class OrderOffersDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
