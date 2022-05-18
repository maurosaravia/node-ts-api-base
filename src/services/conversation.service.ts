import { Container, Service } from 'typedi';
import { getRepository } from 'typeorm';
import { Conversation } from '@entities/conversation.entity';
import { ConversationDTO } from '@dto/conversationDTO';
import { EntityMapper } from '@clients/mapper/entityMapper.service';
import { MessagesService } from './message.service';

@Service()
export class ConversationsService {
  private readonly conversationRepository = getRepository<Conversation>(Conversation);

  async listConversations(): Promise<ConversationDTO[]> {
    const result = await this.conversationRepository.find();
    return this.completeConversations(result);
  }

  async listConversationsByUser(userId: number): Promise<ConversationDTO[]> {
    const result = await this.conversationRepository.find({ where: [{ user1Id: userId },
      { user2Id: userId }] });
    return this.completeConversations(result);
  }

  async createConversation(conversation: Conversation): Promise<Conversation | null> {
    return !await this.existsConversation(conversation) ?
      this.conversationRepository.save(conversation) : null;
  }

  async existsConversation(conversation: Conversation): Promise<boolean> {
    return await this.conversationRepository.count({ where:
      [{ user1Id: conversation.user1Id, user2Id: conversation.user2Id },
        { user1Id: conversation.user2Id, user2Id: conversation.user1Id }] }) > 0;
  }

  async isUserInConversation(userId: number, conversationId: number): Promise<boolean> {
    const conversation = await this.conversationRepository.findOne({ where:
       { id: conversationId } });
    return conversation?.user1Id === userId || conversation?.user2Id === userId;
  }
  async completeConversations(conversations: Conversation[]): Promise<ConversationDTO[]> {
    const result: ConversationDTO[] = [];
    const messagesService = Container.get(MessagesService);
    for (const c of conversations) {
      const cDTO: ConversationDTO = EntityMapper.mapTo(ConversationDTO, c);
      const messages = await messagesService.getMessages(c.id, 1, 1);
      cDTO.lastMessage = messages?.length > 0 ? messages[0].content : '';
      cDTO.unreadCount = await messagesService.unreadCount(c.id);
      result.push(cDTO);
    }
    return result;
  }
}
