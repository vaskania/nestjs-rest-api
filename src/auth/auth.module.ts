import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { CryptoModule } from 'src/utils/crypto.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [DbModule, CryptoModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
