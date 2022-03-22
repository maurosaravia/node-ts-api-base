import { Service } from 'typedi';
import { getRepository, Not } from 'typeorm';
import { Target } from '@entities/target.entity';
import { getDistance } from 'geolib';

@Service()
export class TargetsService {
  private readonly targetRepository = getRepository<Target>(Target);

  listTargets() {
    return this.targetRepository.find();
  }

  listTargetsByUser(userId: number) {
    return this.targetRepository.find({ where: { userId: userId } });
  }

  countTargetsByUser(userId: number) {
    return this.targetRepository.count({ where: { userId: userId } });
  }

  showTarget(id: number) {
    return this.targetRepository.findOne(id);
  }

  createTarget(target: Target) {
    return this.targetRepository.save(target);
  }

  deleteTarget(id: number) {
    return this.targetRepository.delete(id);
  }

  async matchingTargets(target: Target) {
    // ToDo Optimizar para no traer toda la base a memoria y comparar
    const result : number[] = [];
    const targets = await this.targetRepository.find({ where: { topicId: target.topicId,
      userId: Not(target.userId) } });
    const targetCoord = { latitude: target.location[0], longitude: target.location[1] };
    targets.forEach(t => {
      const dist = getDistance(targetCoord, { latitude: t.location[0],
        longitude: t.location[1] });
      if (target.radius + t.radius >= dist && !result.includes(t.userId)) {
        result.push(t.userId);
      }
    });
    return result;
  }
}
