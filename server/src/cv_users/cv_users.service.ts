import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCvUserDto } from './dto/create-cv_user.dto';
import { UpdateCvUserDto } from './dto/update-cv_user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CvUser } from './entities/cv_user.entity';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/companies/entities/company.entity';
import { join } from 'path';
import { extname } from 'path';
import { createReadStream, createWriteStream } from 'fs';

@Injectable()
export class CvUsersService {
  constructor(
    @InjectRepository(CvUser)
    private readonly cvUserRepository: Repository<CvUser>,
    @InjectRepository(User) // Inject the User repository
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company) // Inject the User repository
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(
    createCvUserDto: CreateCvUserDto,
    cv_file_path: Express.Multer.File[],
  ) {
    const { user_id, companyid } = createCvUserDto;

    const user = await this.userRepository.findOne({
      where: { user_id: user_id },
    });

    const company = await this.companyRepository.findOne({
      where: { companyid: companyid },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    if (!company) {
      throw new NotFoundException(`Company with ID ${companyid} not found`);
    }

    const cvUser = new CvUser();
    cvUser.user = user;
    cvUser.company = company;

    // Save the entity to the database
    const savedCvUser = await this.cvUserRepository.save(cvUser);

    // Create the online file path
    const onlineFilePath = `http://localhost:5500/api/v1/cv-users/files/${cv_file_path[0].filename}`;

    // Update the entity with the online file path
    savedCvUser.cv_file_path = onlineFilePath;

    // Save the uploaded file to a specific location
    const filePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      cv_file_path[0].filename,
    );

    // Update the entity with the actual file path
    savedCvUser.cv_file_path = onlineFilePath;

    // Save the entity to the database again to update the file path
    await this.cvUserRepository.save(savedCvUser);

    return 'CvUser created successfully';
  }

  async getUserInfoByCompany(companyid: number): Promise<any> {
    return await this.cvUserRepository
      .createQueryBuilder('cvUser')
      .leftJoinAndSelect('cvUser.user', 'user')
      .select([
        'cvUser.id',
        'cvUser.cv_file_path',
        'user.user_email',
        'user.address',
        'user.phoneNumber',
      ])
      .where('cvUser.company.companyid = :companyid', { companyid })
      .getMany();
  }

  async findAll(): Promise<CvUser[]> {
    return await this.cvUserRepository.find();
  }

  update(id: number, updateCvUserDto: UpdateCvUserDto) {
    return `This action updates a #${id} cvUser`;
  }

  async removeByCompany(companyId: number, id: number): Promise<string> {
    const cvUser = await this.cvUserRepository.findOne({
      where: { id, company: { companyid: companyId } },
    });

    if (!cvUser) {
      throw new NotFoundException(
        `CV with ID ${id} not found in company with ID ${companyId}`,
      );
    }

    await this.cvUserRepository.remove(cvUser);

    return `CV with ID ${id} has been deleted from company with ID ${companyId}`;
  }
}
