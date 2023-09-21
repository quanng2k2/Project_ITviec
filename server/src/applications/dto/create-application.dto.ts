import { IsNumber, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  applications_gtbt: string;

  @IsString()
  applications_work_experience: string;

  @IsString()
  applications_education: string;

  @IsString()
  applications_skill: string;

  @IsString()
  applications_diploma: string;

  @IsString()
  applications_personal_project: string;

  @IsString()
  userId: string;
}
