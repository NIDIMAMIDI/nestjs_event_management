import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  capacity?: number;
}
