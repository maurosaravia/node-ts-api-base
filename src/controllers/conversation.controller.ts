import {
  JsonController,
  Get,
  Authorized,
  CurrentUser
} from 'routing-controllers';
import { Service } from 'typedi';
import { ConversationsService } from '@services/conversation.service';
import { Conversation } from '@entities/conversation.entity';
import { Roles } from '@constants/Roles';

@JsonController('/conversations')
@Service()
export class ConversationController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Authorized(Roles.User)
  @Get()
  async getMyConversations(@CurrentUser() userId :number): Promise<Conversation[]> {
    return this.conversationsService.listConversationsByUser(userId);
  }

  @Authorized(Roles.Admin)
  @Get('/all')
  async getAllConversations(): Promise<Conversation[]> {
    return this.conversationsService.listConversations();
  }
}
