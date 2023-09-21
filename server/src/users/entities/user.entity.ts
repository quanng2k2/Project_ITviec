import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Application } from 'src/applications/entities/application.entity';
import { CvUser } from 'src/cv_users/entities/cv_user.entity';
import { Company } from 'src/companies/entities/company.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  user_id: string = uuidv4();

  @Column({ nullable: true })
  user_name: string;

  @Column({ unique: true })
  user_email: string;

  @Column()
  user_passwords: string;

  @Column({ type: 'tinyint' })
  roles: number;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true, type: 'date' })
  dateOfbirth: Date;

  @Column({ nullable: true, type: 'varchar', length: 15 })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'tinyint' })
  isLocked: number;

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  @OneToMany(() => CvUser, (cvuser) => cvuser.user)
  cvUsers: CvUser[];

  @OneToMany(() => Company, (company) => company.user)
  companies: Company[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
