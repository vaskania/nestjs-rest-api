import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbModule } from 'src/db/db.module';
import { CryptoModule } from 'src/utils/crypto.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DbModule, CryptoModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
