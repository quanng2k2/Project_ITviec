import { CvUser } from 'src/cv_users/entities/cv_user.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'companies' })
export class Company {
  @PrimaryGeneratedColumn()
  companyid: number;

  @Column()
  company_name: string;

  @Column({ type: 'text' })
  company_description: string;

  @Column({ type: 'text' })
  logo: string;

  @Column()
  industry: string;

  @Column()
  compa_city: string;

  @ManyToOne(() => User, (user) => user.companies)
  user: User[];

  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];

  @OneToMany(() => Review, (review) => review.company)
  reviews: Review[];

  @OneToMany(() => CvUser, (cv_user) => cv_user.company)
  cv_users: CvUser[];
}
