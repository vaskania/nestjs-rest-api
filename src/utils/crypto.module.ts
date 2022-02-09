import { HashPassword } from './crypto';
import { Module } from '@nestjs/common';
@Module({
  providers: [HashPassword],
  exports: [HashPassword],
})
export class CryptoModule {}
