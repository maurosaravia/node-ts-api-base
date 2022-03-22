import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Authorized,
  BadRequestError
} from 'routing-controllers';
import { InsertResult, UpdateResult, DeleteResult } from 'typeorm';
import { Service } from 'typedi';
import { Topic } from '@entities/topic.entity';
import { TopicsService } from '@services/topics.service';
import { ErrorsMessages } from '../constants/errorMessages';
import { TopicDTO } from '@dto/topicDTO';
import { EntityMapper } from '@clients/mapper/entityMapper.service';

@JsonController('/topics')
@Service()
export class TopicController {
  constructor(private readonly topicsService: TopicsService) {}

  @Authorized()
  @Get()
  async index(): Promise<Topic[]> {
    return this.topicsService.listTopics();
  }

  @Authorized()
  @Get('/:id')
  async show(@Param('id') id: number): Promise<Topic | undefined> {
    return this.topicsService.showTopic(id);
  }

  @Authorized()
  @Post()
  async post(@Body() topicDTO: TopicDTO): Promise<InsertResult> {
    try {
      return await this.topicsService.createTopic(
        EntityMapper.mapTo(Topic, topicDTO)
      );
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Authorized()
  @Put('/:id')
  async put(
    @Param('id') id: number,
    @Body() topicDTO: TopicDTO
  ): Promise<UpdateResult> {
    const topic: Topic = EntityMapper.mapTo(Topic, topicDTO);
    return this.topicsService.editTopic({ id, topic });
  }

  @Authorized()
  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.topicsService.deleteTopic(id);
  }
}
