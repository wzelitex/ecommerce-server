import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class SignupClientDto extends LoginDto {
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @IsNotEmpty()
  phone: number;

  @IsNumber()
  @IsNotEmpty()
  lada: number;
}

export class SignupBusinessDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  phone: number;

  @IsNumber()
  @IsNotEmpty()
  lada: number;
}

export class SignupWorkerDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  phone: number;

  @IsNumber()
  @IsNotEmpty()
  lada: number;

  @IsString()
  @IsNotEmpty()
  businessId: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
