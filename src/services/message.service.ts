import { Service, Container } from 'typedi';
import { getRepository } from 'typeorm';
import { Message } from '@entities/message.entity';
import { ConversationsService } from './conversation.service';
import { Conversation } from '@entities/conversation.entity';

@Service()
export class MessagesService {
  private readonly messageRepository = getRepository<Message>(Message);

  async sendMessage(message: Message): Promise<Message | null> {
    const conversationService = Container.get(ConversationsService);
    const conversation = new Conversation();
    conversation.user1Id = message.senderId;
    conversation.user2Id = message.receiverId;
    return await conversationService.existsConversation(conversation) ?
      this.messageRepository.save(message) : null;
  }

  async getMessages(conversationId: number, page: number,
    pageLength: number): Promise<Message[]> {
    return this.messageRepository.find({ where: { conversationId: conversationId },
      skip: (page - 1) * pageLength, take: pageLength, order: { createdAt: 'DESC' } });
  }

  async readMessages(conversationId: number, userId: number,
    readDate: Date): Promise<void> {
    this.messageRepository.createQueryBuilder().update(Message).set({ readAt: readDate })
      .where('conversationId = :conversationId', { conversationId: conversationId })
      .andWhere('receiverId != :userId', { userId: userId })
      .andWhere('readAt is null')
      .andWhere('createdAt < :readDate', { readDate: readDate })
      .execute();
  }
  async unreadCount(conversationId: number): Promise<number> {
    return this.messageRepository.count({ where: { conversationId: conversationId,
      readAt: null } });
  }
}
