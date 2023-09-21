import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('api/v1/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post(':id')
  create(@Param('id') id: number, @Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(id, createJobDto);
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  async getJobsByCompanyId(@Param('id') companyId: number) {
    return await this.jobsService.getJobsByCompanyId(companyId);
  }

  @Get('by-company/:companyId')
  async getCompanyByCompanyId(@Param('companyId') companyId: number) {
    const allData = await this.jobsService.getCompanyByCompanyId(companyId);
    return {
      message: 'Thành công',
      allData,
    };
  }

  @Get('latest-by-company/:companyId')
  async getLatestJobByCompanyId(@Param('companyId') companyId: number) {
    const latestJob = await this.jobsService.getLatestJobByCompanyId(companyId);
    if (latestJob) {
      return {
        message: 'Thành công',
        latestJob,
      };
    } else {
      return {
        message: 'Không tìm thấy công việc nào cho công ty này',
      };
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.jobsService.remove(id);
  }
}
