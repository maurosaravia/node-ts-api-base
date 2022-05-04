import Container from 'typedi';
import { TargetsService } from './targets.service';

export class JobService {
  private static instance: JobService;

  public static getInstance(): JobService {
    if (!this.instance) {
      this.instance = new JobService();
    }

    return this.instance;
  }

  async deleteOldTargets() {
    const targetsService = Container.get(TargetsService);
    return targetsService.deleteOldTargets();
  }
}
