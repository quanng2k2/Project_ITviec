import { PartialType } from '@nestjs/mapped-types';
import { CreateCvUserDto } from './create-cv_user.dto';

export class UpdateCvUserDto extends PartialType(CreateCvUserDto) {}
