import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbModule } from '../db/db.module';
import { CryptoModule } from '../utils/crypto.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DbModule, CryptoModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
}
