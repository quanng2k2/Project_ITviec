import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { CompaniesService } from 'src/companies/companies.service';

type JobsAndCompaniesResponse = {
  jobs: Job[];
  companies: Company[];
};

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    private readonly companyService: CompaniesService,
  ) {}

  async create(id: number, createJobDto: CreateJobDto) {
    const company = await this.companyService.getOne(id);

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    const job = new Job();
    job.descriptions = createJobDto.descriptions;
    job.location = createJobDto.location;
    job.salary = createJobDto.salary;
    job.experience_level = createJobDto.experience_level;
    job.required_skills = createJobDto.required_skills;
    job.company = company;

    try {
      await this.jobRepository.save(job);
      return { message: 'Thêm công việc thành công' };
    } catch (error) {
      console.error('Error creating job:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async findAll(): Promise<Job[]> {
    return await this.jobRepository.find();
  }

  // lấy ra job của công ty theo companyId
  async getJobsByCompanyId(companyId: number): Promise<{ jobs: Job[] }> {
    try {
      const jobs = await this.jobRepository
        .createQueryBuilder('job')
        .innerJoinAndSelect('job.company', 'company')
        .where('company.companyid = :companyId', { companyId })
        .getMany();

      return {
        jobs,
      };
    } catch (error) {
      console.error('Error retrieving jobs:', error);
      throw new InternalServerErrorException('Lỗi máy chủ nội bộ');
    }
  }

  // lấy data company theo companyid
  async getCompanyByCompanyId(
    companyId: number,
  ): Promise<{ jobAndCompany: (Company | Job)[] }> {
    try {
      const jobsAndCompanies = await this.jobRepository
        .createQueryBuilder('job')
        .innerJoinAndSelect('job.company', 'company')
        .where('company.companyid = :companyId', { companyId })
        .getMany();

      const jobAndCompany = [
        ...jobsAndCompanies,
        ...jobsAndCompanies.map((jac) => jac.company),
      ];

      return {
        jobAndCompany,
      };
    } catch (error) {
      console.error('Error retrieving jobs:', error);
      throw new InternalServerErrorException('Lỗi máy chủ nội bộ');
    }
  }

  async getLatestJobByCompanyId(companyId: number): Promise<Job[]> {
    try {
      const latestJob = await this.jobRepository
        .createQueryBuilder('job')
        .innerJoinAndSelect('job.company', 'company')
        .where('company.companyid = :companyId', { companyId })
        .orderBy('job.job_id', 'DESC')
        .take(1)
        .getOne();

      return [latestJob]; // Return the latest job or null if not found
    } catch (error) {
      console.error('Error retrieving latest job:', error);
      throw new InternalServerErrorException('Lỗi máy chủ nội bộ');
    }
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  async remove(id: number) {
    try {
      const job = await this.jobRepository.findOne({ where: { job_id: id } });

      if (!job) {
        throw new NotFoundException(`Không tìm thấy công việc với ID ${id}`);
      }

      await this.jobRepository.remove(job);

      return `Xóa công việc có ID ${id} thành công`;
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Đã xảy ra lỗi khi xóa công ty',
      );
    }
  }
}
