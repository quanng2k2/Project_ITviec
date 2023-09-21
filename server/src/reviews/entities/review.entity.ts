import { v4 as uuidv4 } from 'uuid';
import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/companies/entities/company.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryColumn()
  review_id: string = uuidv4();

  @Column({ type: 'text' })
  review_content: string;

  @Column({ type: 'float' })
  rating: number;

  @Column({ type: 'date' })
  review_date: Date;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User[];

  @ManyToOne(() => Company, (company) => company.reviews)
  company: Company[];
}
