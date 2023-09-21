import { IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  descriptions: string;

  @IsString()
  location: string;

  @IsString()
  salary: string;

  @IsString()
  experience_level: string;

  @IsString()
  required_skills: string;
}
