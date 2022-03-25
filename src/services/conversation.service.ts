import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { Conversation } from '@entities/conversation.entity';

@Service()
export class ConversationsService {
  private readonly conversationRepository = getRepository<Conversation>(Conversation);

  async listConversationsByUser(userId: number) {
    return this.conversationRepository.find({ where: [{ user1Id: userId },
      { user2Id: userId }] });
  }

  async createConversation(conversation: Conversation) {
    return !await this.existsConversation(conversation) ?
      this.conversationRepository.save(conversation) : null;
  }

  async existsConversation(conversation: Conversation) {
    return await this.conversationRepository.count({ where:
      [{ user1Id: conversation.user1Id, user2Id: conversation.user2Id },
        { user1Id: conversation.user2Id, user2Id: conversation.user1Id }] }) > 0;
  }
}
