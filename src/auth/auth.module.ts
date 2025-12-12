import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { ApiKeyStrategy } from './apiKey.strategy';

@Module({
  imports: [PassportModule],
  providers: [AuthService, ApiKeyStrategy],
})
export class AuthModule {}
