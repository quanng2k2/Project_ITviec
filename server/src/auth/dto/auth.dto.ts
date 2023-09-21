import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class loginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  passwords: string;
}

export class signupDto {
  @IsNotEmpty()
  @IsEmail()
  user_email: string;

  @IsNotEmpty()
  @IsString()
  user_passwords: string;

  @IsNotEmpty()
  @IsString()
  user_name: string;
}
