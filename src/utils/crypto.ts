import { Injectable } from '@nestjs/common';
import { randomBytes, pbkdf2Sync } from 'crypto';

const config = {
  salt: randomBytes(16).toString('hex'),
  iterations: 100000,
  hashBytes: 32,
  digest: 'sha512',
};
@Injectable()
export class HashPassword {
  async hashPassword(password: string): Promise<any> {
    const { salt, iterations, hashBytes, digest } = config;
    const hashPassword = pbkdf2Sync(
      password,
      salt,
      iterations,
      hashBytes,
      digest,
    );
    return {
      hash: hashPassword.toString('hex'),
      salt: salt,
    };
  }
}
