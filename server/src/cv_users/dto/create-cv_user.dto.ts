import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCvUserDto {
  // @IsString()
  // @IsNotEmpty()
  cv_file_path: string;

  // @IsString()
  // @IsNotEmpty()
  user_id: string;

  // @IsNumber()
  // @IsNotEmpty()
  companyid: number;
}
