import {
    JsonController,
    Get,
    Authorized,
    CurrentUser,
  } from 'routing-controllers';
  import { Service } from 'typedi';
import { ConversationsService } from '@services/conversation.service';
import { Conversation } from '@entities/conversation.entity';
  
  @JsonController('/conversations')
  @Service()
  export class ConversationController {
    constructor(private readonly conversationsService: ConversationsService) {}
  
    @Authorized()
    @Get()
    async index(@CurrentUser() user :number): Promise<Conversation[]> {
      return this.conversationsService.listConversationsByUser(user);
    }
  }
  