import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { Topic } from './topic.entity';
import { Conversation } from './conversation.entity';
import { User } from './user.entity';
@Entity()
export class Message extends Base {
  @Column({ type: 'int', nullable: false })
  conversationId!: number;

  @ManyToOne( () => Topic )
  @JoinColumn({ name: 'topicId' })
  conversation!: Conversation;

  @Column({ nullable: false })
  content!: string;

  @Column({ nullable: true })
  readAt?: Date;

  @Column({ type: 'int', nullable: false })
  senderId!: number;

  @ManyToOne( () => User)
  @JoinColumn({ name: 'senderId' })
  sender!: User;

  @Column({ type: 'int', nullable: false })
  receiverId!: number;

  @ManyToOne( () => User )
  @JoinColumn({ name: 'receiverId' })
  receiver!: User;
}
