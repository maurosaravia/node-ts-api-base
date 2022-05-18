import { Container, Service } from 'typedi';
import { TargetsService } from './targets.service';

@Service()
export class JobService {
  private static instance: JobService;

  public static getInstance(): JobService {
    if (!this.instance) {
      this.instance = new JobService();
    }

    return this.instance;
  }

  async deleteOldTargets(): Promise<void> {
    const targetsService = Container.get(TargetsService);
    targetsService.deleteOldTargets();
  }
}
