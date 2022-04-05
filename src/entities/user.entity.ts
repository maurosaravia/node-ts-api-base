import { Column, Entity, Index } from 'typeorm';
import { Base } from './base.entity';
@Entity()
export class User extends Base {
  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column()
  @Index({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  image?: string; // Image as Base64
}
