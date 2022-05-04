import {
  JsonController,
  Get,
  Authorized,
  CurrentUser
} from 'routing-controllers';
import { Service } from 'typedi';
import { ConversationsService } from '@services/conversation.service';
import { Roles } from '@constants/Roles';
import { ConversationDTO } from '@dto/conversationDTO';

@JsonController('/conversations')
@Service()
export class ConversationController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Authorized(Roles.User)
  @Get()
  async getMyConversations(@CurrentUser() userId :number): Promise<ConversationDTO[]> {
    return this.conversationsService.listConversationsByUser(userId);
  }

  @Authorized(Roles.Admin)
  @Get('/all')
  async getAllConversations(): Promise<ConversationDTO[]> {
    return this.conversationsService.listConversations();
  }
}
