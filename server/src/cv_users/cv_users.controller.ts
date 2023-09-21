import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { CvUsersService } from './cv_users.service';
import { CreateCvUserDto } from './dto/create-cv_user.dto';
import { UpdateCvUserDto } from './dto/update-cv_user.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';

@Controller('api/v1/cv-users')
export class CvUsersController {
  constructor(private readonly cvUsersService: CvUsersService) {}

  @Get('files/:filename') // Đặt đúng endpoint để xử lý truy cập file
  async serveCVFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'uploads', filename);
    const encodedFileName = encodeURIComponent(filename);
    // Đặt header cho response để trình duyệt hiểu rằng đây là file PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodedFileName}"`,
    );
    // Đọc và trả về nội dung file
    res.sendFile(filePath);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor()) // Specify the fieldname
  create(
    @UploadedFiles() files: Express.Multer.File[], // Use the correct type
    @Body() createCvUserDto: CreateCvUserDto,
  ) {
    return this.cvUsersService.create(createCvUserDto, files);
  }

  @Get('info/company/:companyid')
  async getUserInfoByCompany(@Param('companyid') companyid: number) {
    const userInfos = await this.cvUsersService.getUserInfoByCompany(companyid);
    return userInfos;
  }

  @Get()
  findAll() {
    return this.cvUsersService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCvUserDto: UpdateCvUserDto) {
    return this.cvUsersService.update(+id, updateCvUserDto);
  }

  @Delete('info/company/:companyId/:id')
  removeByCompany(
    @Param('companyId') companyId: number,
    @Param('id') id: number,
  ) {
    return this.cvUsersService.removeByCompany(companyId, id);
  }
}
