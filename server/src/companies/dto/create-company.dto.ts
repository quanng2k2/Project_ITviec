import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  company_name: string;

  @IsString()
  company_description: string;

  @IsString()
  logo: string;

  @IsString()
  industry: string;

  @IsString()
  compa_city: string;
}
