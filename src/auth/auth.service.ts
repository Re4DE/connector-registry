import { Injectable } from '@nestjs/common';

import { ConfigurationService } from '../config/configuration.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly conf: ConfigurationService) {}

  public validateApiKey(apiKey: string) {
    return this.conf.apiKey === apiKey;
  }
}
