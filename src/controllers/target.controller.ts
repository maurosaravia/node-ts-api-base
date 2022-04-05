import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Delete,
  Authorized,
  CurrentUser,
  BadRequestError
} from 'routing-controllers';
import { DeleteResult } from 'typeorm';
import { Service } from 'typedi';
import { Target } from '@entities/target.entity';
import { TargetsService } from '@services/targets.service';
import { ErrorsMessages } from '../constants/errorMessages';
import { TargetDTO } from '@dto/targetDTO';
import { EntityMapper } from '@clients/mapper/entityMapper.service';
import { Conversation } from '@entities/conversation.entity';
import { ConversationsService } from '@services/conversation.service';
import { Roles } from '@constants/Roles';

@JsonController('/targets')
@Service()
export class TargetController {
  constructor(private readonly targetsService: TargetsService
    , private readonly conversationsService: ConversationsService) {}

  @Authorized(Roles.User)
  @Get()
  async listMyTargets(@CurrentUser() user :number): Promise<Target[]> {
    return this.targetsService.listTargetsByUser(user);
  }

  @Authorized(Roles.Admin)
  @Get('/all')
  async listAllTargets(): Promise<Target[]> {
    return this.targetsService.listTargets();
  }

  // ToDo Borrar
  // @Get('/:id')
  // async show(@Param('id') id: number): Promise<Target | undefined> {
  //   return this.targetsService.showTarget(id);
  // }

  @Authorized(Roles.User)
  @Post()
  async post(@CurrentUser() user :number, @Body() targetDTO: TargetDTO): Promise<Target> {
    try {
      // ToDo Puede incluir las relaciones?
      const target: Target = EntityMapper.mapTo(Target, targetDTO);
      const targetCount = await this.targetsService.countTargetsByUser(user);
      if (targetCount == 10) {
        throw new BadRequestError('User can\'t have more than 10 targets');
      }

      target.topicId = targetDTO.topicId;
      target.userId = user;
      const dbTarget = await this.targetsService.createTarget(
        target
      );
      const matches = await this.targetsService.matchingTargets(target);
      matches.forEach(match => {
        const conversation = new Conversation();
        conversation.user1Id = user,
        conversation.user2Id = match,
        this.conversationsService.createConversation(conversation);
      });
      return dbTarget;
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Authorized(Roles.User)
  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.targetsService.deleteTarget(id);
  }
}
