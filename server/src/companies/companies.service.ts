import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company) private companyRepo: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const company = await this.companyRepo.create({
        company_name: createCompanyDto.company_name,
        company_description: createCompanyDto.company_description,
        logo: createCompanyDto.logo,
        industry: createCompanyDto.industry,
        compa_city: createCompanyDto.compa_city,
      });
      await this.companyRepo.save(company);
      return [company];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAll(): Promise<Company[]> {
    return await this.companyRepo.find();
  }

  async getOne(id: number): Promise<Company> {
    return await this.companyRepo.findOne({ where: { companyid: id } });
  }

  async getCompanyByUserId(userId: number): Promise<Company> {
    try {
      const company = await this.companyRepo
        .createQueryBuilder('company')
        .innerJoin('company.user', 'user')
        .where('user.user_id = :userId', { userId })
        .getOne();

      if (!company) {
        throw new NotFoundException(
          `Company not found for user with ID ${userId}`,
        );
      }

      return company;
    } catch (error) {
      console.error('Error retrieving company:', error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async searchCompanies(searchTerm: string): Promise<Company[]> {
    try {
      const companies = await this.companyRepo
        .createQueryBuilder('company')
        .where(
          'company.company_name LIKE :searchTerm OR company.industry LIKE :searchTerm',
          { searchTerm: `%${searchTerm}%` },
        )
        .getMany();

      return companies;
    } catch (error) {
      console.error('Error searching companies:', error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  async remove(id: number): Promise<string> {
    try {
      const company = await this.companyRepo.findOne({
        where: { companyid: id },
      });
      if (!company) {
        throw new NotFoundException(`Không tìm thấy công ty với ID ${id}`);
      }

      await this.companyRepo.remove(company);

      return `Xóa công ty có ID ${id} thành công`;
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Đã xảy ra lỗi khi xóa công ty',
      );
    }
  }
}
