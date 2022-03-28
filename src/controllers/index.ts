import { AuthController } from './auth.controller';
import { UserController } from './users.controller';
import { TopicController } from './topic.controller';
import { TargetController } from './target.controller';
import { ConversationController } from './conversation.controller';

export const controllers = [AuthController, UserController, TopicController,
  TargetController, ConversationController];
