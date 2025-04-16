import { IsString, IsNumber } from 'class-validator';

export class AddLocationUserDto {
  @IsString()
  zipCode: string;

  @IsString()
  cologne: string;

  @IsString()
  street: string;

  @IsString()
  number: string;

  @IsString()
  municipality: string;

  @IsString()
  state: string;

  @IsString()
  country: string;
}

export class UpdateUsersDto extends AddLocationUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  phone: number;

  @IsNumber()
  lada: number;

  @IsString()
  image: string;

  @IsString()
  description: string;

  @IsString()
  facebook: string;

  @IsString()
  instagram: string;

  @IsString()
  twitter: string;

  @IsString()
  tiktok: string;

  @IsNumber()
  delivery: number;
}

export class UpdateDataSecitonDto {
  @IsString()
  aboutUs: string;
}
