import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'applications' })
export class Application {
  @PrimaryGeneratedColumn()
  application_id: number;

  @Column({ type: 'text' })
  applications_gtbt: string;

  @Column({ type: 'text' })
  applications_work_experience: string;

  @Column({ type: 'text' })
  applications_education: string;

  @Column({ type: 'text' })
  applications_skill: string;

  @Column({ type: 'text' })
  applications_diploma: string;

  @Column({ type: 'text' })
  applications_personal_project: string;

  @ManyToOne(() => User, (user) => user.applications)
  user: User;
}
