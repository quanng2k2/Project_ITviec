import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ApplicationsModule } from './applications/applications.module';
import { CompaniesModule } from './companies/companies.module';
import { CvUsersModule } from './cv_users/cv_users.module';
import { JobsModule } from './jobs/jobs.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Company } from './companies/entities/company.entity';
import { Application } from './applications/entities/application.entity';
import { Job } from './jobs/entities/job.entity';
import { CvUser } from './cv_users/entities/cv_user.entity';
import { Review } from './reviews/entities/review.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'project_nestjs',
      entities: [User, Company, Application, Job, CvUser, Review],
      synchronize: true,
    }),
    UsersModule,
    ApplicationsModule,
    CompaniesModule,
    CvUsersModule,
    JobsModule,
    ReviewsModule,
    AuthModule,
  ],
})
export class AppModule {}
