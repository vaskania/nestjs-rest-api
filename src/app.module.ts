import 'dotenv/config';
import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { CryptoModule } from './utils/crypto.module';
import { AuthModule } from './auth/auth.module';

const DB = process.env.DB_URI;

@Module({
  imports: [
    MongooseModule.forRoot(DB),
    UserModule,
    DbModule,
    CryptoModule,
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {
}

