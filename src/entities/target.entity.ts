import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { Topic } from './topic.entity';
import { User } from './user.entity';
@Entity()
export class Target extends Base {
  @Column({ type: 'int', nullable: false })
  topicId!: number;

  @ManyToOne( () => Topic )
  @JoinColumn({ name: 'topicId' })
  topic!: Topic;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: false })
  radius!: number; // in meters

  @Column({ type: 'decimal', nullable: false, array: true })
  location!: [number, number];

  @Column({ type: 'int', nullable: false })
  userId!: number;

  @ManyToOne( () => User )
  @JoinColumn({ name: 'userId' })
  user!: User;
}
