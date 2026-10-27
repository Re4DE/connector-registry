import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { NodeRequest } from '@nestjs/platform-node';
import { Observable } from 'rxjs';

import { ConfigurationService } from '../config/configuration.service.js';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigurationService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const headerName = this.config.apiKeyHeaderName;
    const requiredApiKey = this.config.apiKey;

    const request = context.switchToHttp().getRequest<NodeRequest>();
    const headers = request.headers;
    const requestApiKey = headers[headerName];
    if (!requestApiKey || requestApiKey.at.length === 0) {
      return false;
    }
    if (requestApiKey !== requiredApiKey) {
      return false;
    }
    return true;
  }
}
