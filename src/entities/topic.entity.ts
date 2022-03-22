import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';
@Entity()
export class Topic extends Base {
  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  image?: string; // Image as Base64
}
