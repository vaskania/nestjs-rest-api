import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDTO } from '../src/user/dto/create-user.dto';
import { disconnect } from 'mongoose';
import { LoginUserDTO } from '../src/user/dto/user-login.dto';
import { UpdateUserDTO } from 'src/user/dto/update-user.dto';

const testRegisterDto: CreateUserDTO = {
  username: 'vaskania22',
  firstname: 'vasili',
  lastname: 'nikabadze',
  password: '123456',
};

const testLoginDto: LoginUserDTO = {
  username: 'vaskania22',
  password: '123456',
};

const updateData = {
  firstname: 'VASKANIA',
  lastname: 'NIKABADZE',
  password: '123456',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let username = 'vaskania1';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/user/register (POST) - Success', async () => {
    const body = await request(app.getHttpServer())
      .post('/user/register')
      .send(testRegisterDto)
      .expect(201);
    const createdUser = body.text;
    expect(createdUser).toBeDefined();
  });

  it('/user/login (POST) - Success', async () => {
    const body = await request(app.getHttpServer())
      .post('/user/login')
      .send(testLoginDto)
      .expect(200);
    const accessToken = body.text;
    expect({ access_token: accessToken }).toBeDefined();
  });

  it('/user/:username (GET) - Success', async () => {
    const body = await request(app.getHttpServer())
      .get('/user/' + testRegisterDto.username)
      .expect(200);
    const result = body.text;
    expect(result).toBeDefined();
  });

  it('/user/update-profile/:username (PUT)', async () => {
    const data = await request(app.getHttpServer())
      .post('/user/login')
      .send(testLoginDto)
      .expect(200);

    const updatedUser = await request(app.getHttpServer())
      .put('/user/update-profile/' + username)
      .set('Authorization', 'Bearer ' + data.body.access_token)
      .send(updateData)
      .expect(200);
    expect(updatedUser).toBeDefined();
  });

  it('/user/:username (DELETE)', async () => {
    const data = await request(app.getHttpServer())
      .post('/user/login')
      .send(testLoginDto)
      .expect(200);

    const deleteUser = await request(app.getHttpServer())
      .delete('/user/' + username)
      .set('Authorization', 'Bearer ' + data.body.access_token)
      .expect(200);
    expect(deleteUser).toBeDefined();
  });

  afterAll(() => {
    disconnect();
  });
});
