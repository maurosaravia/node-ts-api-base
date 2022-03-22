import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { Topic } from '@entities/topic.entity';
import { TopicInterface } from '@interfaces';

@Service()
export class TopicsService {
  private readonly topicRepository = getRepository<Topic>(Topic);

  listTopics() {
    return this.topicRepository.find();
  }

  showTopic(id: number) {
    return this.topicRepository.findOne(id);
  }

  createTopic(topic: Topic) {
    return this.topicRepository.insert(topic);
  }

  editTopic(input: TopicInterface.IEditTopic) {
    const { id, topic } = input;
    return this.topicRepository.update(id, topic);
  }

  deleteTopic(id: number) {
    return this.topicRepository.delete(id);
  }
}
