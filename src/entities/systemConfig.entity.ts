import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class SystemConfig extends Base {
  @Column({ nullable: false })
  about!: string;
}
