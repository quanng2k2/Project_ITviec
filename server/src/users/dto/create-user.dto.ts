import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsDate,
  Length,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  user_name: string;

  @IsEmail()
  @IsNotEmpty()
  user_email: string;

  @IsNotEmpty()
  @IsString()
  user_passwords: string;

  @IsNotEmpty()
  @IsNumber()
  roles: number;

  @IsString()
  avatar: string;

  @IsString()
  position: string;

  @IsDate()
  dateOfbirth: Date;

  @Length(10, 15)
  @IsString()
  phoneNumber: string;

  @IsString()
  address: string;

  @IsNumber()
  isLocked: number;
}
