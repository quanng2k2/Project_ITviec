import { Module } from '@nestjs/common';
import { CvUsersService } from './cv_users.service';
import { CvUsersController } from './cv_users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvUser } from './entities/cv_user.entity';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/companies/entities/company.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([CvUser, User, Company]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const timestamp = new Date().getTime(); // Lấy thời gian hiện tại dưới dạng timestamp
          const originalName = file.originalname; // Tên gốc của file
          const ext = extname(originalName); // Lấy phần mở rộng (extension) của file
          const randomString = Math.random().toString(36).substring(2, 15); // Chuỗi ngẫu nhiên để đảm bảo tính duy nhất

          const newFileName = `${timestamp}-${randomString}-${originalName}`;
          cb(null, newFileName);
        },
      }),
    }),
  ],
  controllers: [CvUsersController],
  providers: [CvUsersService],
})
export class CvUsersModule {}
