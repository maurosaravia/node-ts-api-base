import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { Conversation } from '@entities/conversation.entity';
// import { ConversationInterface } from '@interfaces';

@Service()
export class ConversationsService {
  private readonly conversationRepository = getRepository<Conversation>(Conversation);

  listConversationsByUser(userId: number) {
    return this.conversationRepository.find({ where: [{ user1Id: userId }, { user2Id: userId }] });
  }

  async createConversation(conversation: Conversation) {
    const exists = (await this.conversationRepository.count({ where:
      [{ user1Id: conversation.user1Id, user2Id: conversation.user2Id },
        { user1Id: conversation.user2Id, user2Id: conversation.user1Id }] })) > 0;
    return !exists? this.conversationRepository.save(conversation) : null;
  }
}
