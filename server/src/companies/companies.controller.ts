import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('api/v1/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.companiesService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.companiesService.getOne(id);
  }

  @Get('user/:userId')
  getCompanyByUserId(@Param('userId') userId: number) {
    return this.companiesService.getCompanyByUserId(userId);
  }

  @Get('search/:searchTerm')
  searchCompanies(@Param('searchTerm') searchTerm: string) {
    return this.companiesService.searchCompanies(searchTerm);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.companiesService.remove(id);
  }
}
