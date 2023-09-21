import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('api/v1/applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(createApplicationDto);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const applications = this.applicationsService.findAll();
    return applications;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Get('download/:id')
  async downloadPdf(@Param('id') id: string, @Res() res: any) {
    try {
      // Lấy thông tin cần thiết để tạo tệp PDF, có thể là dữ liệu từ service hoặc database.
      const pdfData = await this.applicationsService.generatePdfData(id);

      // Tạo và trả về tệp PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=application_${id}.pdf`,
      );
      res.send(pdfData);
    } catch (error) {
      // Xử lý lỗi nếu cần thiết
      res.status(500).send('Internal Server Error');
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationsService.update(+id, updateApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(+id);
  }
}
