import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import Strategy from 'passport-headerapikey';

import { AuthService } from './auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private authService: AuthService) {
    super({ header: 'x-api-key', prefix: '' }, false);
  }

  public validate(apiKey: string, done: (error: Error, data) => {}): void {
    if (this.authService.validateApiKey(apiKey)) {
      done(null, true);
    }
    done(new UnauthorizedException(), false);
  }
}
