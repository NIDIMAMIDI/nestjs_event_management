import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$&])[A-Za-z\d@$&]{5,15}$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (@, $, &), and be between 5 to 15 characters long.',
  })
  password!: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword!: string;

  @IsOptional()
  @IsString()
  @IsIn(['user', 'organizer'], {
    message: 'Role must be either "user" or "organizer".',
  })
  role?: string;

  @IsOptional()
  @IsString()
  token?: string;
}
