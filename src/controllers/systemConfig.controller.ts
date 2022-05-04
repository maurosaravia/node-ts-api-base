import {
  JsonController,
  Body,
  Get,
  Put,
  Authorized,
  BadRequestError
} from 'routing-controllers';
import { InsertResult, UpdateResult } from 'typeorm';
import { Service } from 'typedi';
import { ErrorsMessages } from '../constants/errorMessages';
import { Roles } from '@constants/Roles';
import { SystemConfigService } from '@services/systemConfig.service';

@JsonController('/systemConfig')
@Service()
export class SystemConfigController {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  @Authorized()
  @Get('/about')
  async getAbout(): Promise<string> {
    return this.systemConfigService.getAbout();
  }

  @Authorized(Roles.Admin)
  @Put('/about')
  async setAbout(@Body() { about }): Promise<InsertResult | UpdateResult> {
    try {
      return await this.systemConfigService.setAbout(about);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
