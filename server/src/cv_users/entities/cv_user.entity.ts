import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/companies/entities/company.entity';

@Entity({ name: 'cv_user' })
export class CvUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  cv_file_path: string;

  @ManyToOne(() => User, (user) => user.cvUsers)
  user: User;

  @ManyToOne(() => Company, (company) => company.cv_users)
  company: Company;
}
