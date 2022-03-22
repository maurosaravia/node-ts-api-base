import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { Conversation } from '@entities/conversation.entity';
// import { ConversationInterface } from '@interfaces';

@Service()
export class ConversationsService {
  private readonly conversationRepository = getRepository<Conversation>(Conversation);

  listConversations() {
    return this.conversationRepository.find();
  }

  // showTopic(id: number) {
  //   return this.conversationRepository.findOne(id);
  // }

  async createConversation(conversation: Conversation) {
    const exists = (await this.conversationRepository.count({ where:
      [{ user1Id: conversation.user1Id, user2Id: conversation.user2Id },
        { user1Id: conversation.user2Id, user2Id: conversation.user1Id }] })) > 0;
    return !exists? this.conversationRepository.save(conversation) : null;
  }

//   deleteTopic(id: number) {
//     return this.conversationRepository.delete(id);
//   }
}
