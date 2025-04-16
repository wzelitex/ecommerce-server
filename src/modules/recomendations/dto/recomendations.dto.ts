import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRecomendationsDto {
  @IsString()
  @IsNotEmpty()
  recomendation: string;
}
