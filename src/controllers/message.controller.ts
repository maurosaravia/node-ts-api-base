import {
  JsonController,
  Post,
  Authorized,
  CurrentUser,
  Body,
  Get,
  Param,
  Put,
  BodyParam,
  BadRequestError
} from 'routing-controllers';
import { Service } from 'typedi';
import { MessagesService } from '@services/message.service';
import { MessageDTO } from '@dto/messageDTO';
import { EntityMapper } from '@clients/mapper/entityMapper.service';
import { Message } from '@entities/message.entity';
import { ConversationsService } from '@services/conversation.service';
import { Roles } from '@constants/Roles';

@JsonController('/messages')
@Service()
export class MessageController {
  constructor(private readonly messagesService: MessagesService,
    private readonly conversationsService: ConversationsService) {}

  @Authorized()
  @Get('/:conversationId/:page/:pageLength')
  async getMessages(@CurrentUser() userId :number,
    @Param('conversationId') conversationId: number,
    @Param('page') page: number,
    @Param('pageLength') pageLength: number
  ) {
    if (await this.conversationsService.isUserInConversation(userId, conversationId)) {
      return this.messagesService.getMessages(conversationId, page, pageLength);
    } else {
      throw new BadRequestError('User is not in the conversation');
    }
  }

  @Authorized(Roles.User)
  @Post()
  async sendMessage(@CurrentUser() userId :number,
    @Body({ validate: true }) messageDTO: MessageDTO) {
    if (!await this.conversationsService.isUserInConversation(userId,
      messageDTO.conversationId)) {
      throw new BadRequestError('User is not in the conversation');
    }
    const message: Message = EntityMapper.mapTo(Message, messageDTO);
    message.senderId = userId;
    message.conversationId = messageDTO.conversationId;
    message.receiverId = messageDTO.receiverId;
    return this.messagesService.sendMessage(message);
  }

  @Authorized(Roles.User)
  @Put('/readMessages')
  async readMessages(@CurrentUser() userId :number,
    @BodyParam('conversationId') conversationId: number,
    @BodyParam('readDate') readDate: Date) {
    if (await this.conversationsService.isUserInConversation(userId, conversationId)) {
      this.messagesService.readMessages(conversationId, userId, readDate);
      return null;
    } else {
      throw new BadRequestError('User is not in the conversation');
    }
  }
}
