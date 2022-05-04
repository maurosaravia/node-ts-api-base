import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { SystemConfig } from '@entities/systemConfig.entity';

@Service()
export class SystemConfigService {
  private readonly systemConfigRepository = getRepository<SystemConfig>(SystemConfig);

  getSystemConfig() {
    return this.systemConfigRepository.findOne();
  }

  async getAbout() {
    const systemConfig = await this.getSystemConfig();
    return systemConfig ? systemConfig.about : '';
  }

  async setAbout(about: string) {
    let systemConfig = await this.getSystemConfig();
    if (!systemConfig) {
      systemConfig = new SystemConfig();
      systemConfig.about = about;
      return this.systemConfigRepository.insert(systemConfig);
    } else {
      systemConfig.about = about;
      return this.systemConfigRepository.update(systemConfig.id, systemConfig);
    }
  }
}
