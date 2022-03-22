import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
@Entity()
export class Conversation extends Base {
  @Column({ type: 'int', nullable: false })
  user1Id!: number;

  @ManyToOne( () => User )
  @JoinColumn({ name: 'user1Id' })
  user1!: User;

  @Column({ type: 'int', nullable: false })
  user2Id!: number;

  @ManyToOne( () => User )
  @JoinColumn({ name: 'user2Id' })
  user2!: User;
}
