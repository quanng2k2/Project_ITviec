import { UsersService } from './../users/users.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application) private applicaRepo: Repository<Application>,
    private entityManager: EntityManager,
    private usersService: UsersService,
  ) {}

  async create(createApplicationDto: CreateApplicationDto) {
    const application = this.entityManager.create(
      Application,
      createApplicationDto,
    );
    let userId = createApplicationDto.userId;
    let user = await this.usersService.findOne(userId);
    application.user = user;
    return this.entityManager.save(application);
  }

  async findAll() {
    try {
      const allApplications = await this.applicaRepo.find();
      return allApplications;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.usersService.findOne(id);
      const applications = await this.applicaRepo.find({
        where: { user: { user_id: id } },
      });

      const lastApplication = applications[applications.length - 1];
      return [user, lastApplication];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async generatePdfData(applicationId: string): Promise<Buffer> {
    try {
      const [user, lastApplication] = await this.findOne(applicationId);

      const PDFDocument = require('pdfkit');
      const fontPath = `${__dirname}/../../public/fonts/Montserrat/Montserrat-Regular.ttf`;
      const doc = new PDFDocument();
      doc.font(fontPath);
      doc.font(
        `${__dirname}/../../public/fonts/Montserrat/Montserrat-Regular.ttf`,
      );
      doc.fontSize(13);
      doc.fillColor('black');

      if (user instanceof User) {
        doc
          .fillColor('red')
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Bold.ttf`,
          )
          .text('Họ và Tên: ', { continued: true })
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Regular.ttf`,
          )
          .fillColor('black')
          .text(user.user_name);

        doc
          .fillColor('red')
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Bold.ttf`,
          )
          .text('Vị trí ứng tuyển : ', { continued: true })
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Regular.ttf`,
          )
          .fillColor('black')
          .text(user.position);
        doc.moveDown(1);

        // Vẽ đường kẻ ngang
        doc
          .moveTo(doc.x, doc.y + 5)
          .lineTo(
            doc.x + doc.widthOfString(`Vị trí ứng tuyển : ${user.position}`),
            doc.y + 5,
          )
          .stroke();
        doc.moveDown(2);

        doc
          .fillColor('red')
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Bold.ttf`,
          )
          .text(`Thông tin liên hệ`);

        doc.moveDown(1);
        doc
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Regular.ttf`,
          )
          .fillColor('black')
          .text(`Sinh nhật : ${user.dateOfbirth}`);
        doc.moveDown(1);
        doc.text(`Chỗ ở hiện tại : ${user.address}`);
        doc.moveDown(1);
        doc.text(`Số điện thoại : ${user.phoneNumber}`);
        doc.moveDown(1);
        doc.text(`Email : ${user.user_email}`);
        doc.moveDown(1);
      }

      if (lastApplication instanceof Application) {
        doc
          .fillColor('red')
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Bold.ttf`,
          )
          .text('Tóm lược : ', { continued: true })
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Regular.ttf`,
          )
          .fillColor('black')
          .text('')
          .moveDown(2)
          .text(lastApplication.applications_gtbt);

        doc.moveDown(1);

        doc
          .fillColor('red')
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Bold.ttf`,
          )
          .text('Kinh nghiệm làm việc : ', { continued: true })
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Regular.ttf`,
          )
          .fillColor('black')
          .text('')
          .moveDown(1)
          .text(lastApplication.applications_work_experience);

        doc.moveDown(1);

        doc
          .fillColor('red')
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Bold.ttf`,
          )
          .text('Chuyên nghành : ', { continued: true })
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Regular.ttf`,
          )
          .fillColor('black')
          .text('')
          .moveDown(1)
          .text(lastApplication.applications_education);

        doc.moveDown(1);

        doc
          .fillColor('red')
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Bold.ttf`,
          )
          .text('Kỹ năng : ', { continued: true })
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Regular.ttf`,
          )
          .fillColor('black')
          .text('')
          .moveDown(1)
          .text(lastApplication.applications_skill);

        doc.moveDown(1);

        doc
          .fillColor('red')
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Bold.ttf`,
          )
          .text('Chứng chỉ : ', { continued: true })
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Regular.ttf`,
          )
          .fillColor('black')
          .text('')
          .moveDown(1)
          .text(lastApplication.applications_skill);

        doc.moveDown(1);

        doc
          .fillColor('red')
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Bold.ttf`,
          )
          .text('Các dự án cá nhân : ', { continued: true })
          .font(
            `${__dirname}/../../public/fonts/Montserrat/Montserrat-Regular.ttf`,
          )
          .fillColor('black')
          .text('')
          .moveDown(1)
          .text(lastApplication.applications_personal_project);

        doc.moveDown(1);
      }

      doc.end();

      return new Promise<Buffer>((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        doc.on('data', (chunk: Uint8Array) => {
          chunks.push(chunk);
        });
        doc.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        doc.on('error', (error: any) => {
          reject(error);
        });
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  update(id: number, updateApplicationDto: UpdateApplicationDto) {
    return `This action updates a #${id} application`;
  }

  remove(id: number) {
    return `This action removes a #${id} application`;
  }
}
