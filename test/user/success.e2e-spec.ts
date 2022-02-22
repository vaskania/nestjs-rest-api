import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import {
  TestUserRegisterDto,
  TestUserLoginDto,
  TestUpdateData,
  TestUsername,
  pageNumber,
  limit,
} from '../dto/success-test.dto';
import { disconnect } from 'mongoose';

describe('Success test for API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/user/register (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/user/register')
      .send(TestUserRegisterDto)
      .expect(201);
    expect(res.body).toBeDefined();
    expect(res.body).toStrictEqual({
      message: `${TestUserRegisterDto.username} created successfully`,
    });
  });

  it('/user/login (POST)', async () => {
    const body = await request(app.getHttpServer())
      .post('/user/login')
      .send(TestUserLoginDto)
      .expect(200);
    const accessToken = body.body;
    expect({ access_token: accessToken }).toBeDefined();
  });

  it('/user/:username (GET) ', async () => {
    const data = await request(app.getHttpServer())
      .get('/user/' + TestUserRegisterDto.username)
      .expect(200);
    expect(data.body).toBeDefined();
    expect(data.body.username).toBe(TestUserRegisterDto.username);
  });

  it('/user/list (GET) ', async () => {
    const data = await request(app.getHttpServer())
      .get(`/user/users/list?pageNumber=${pageNumber}&limit=${limit}`)
      .expect(200);
    expect(data.body).toBeDefined();
  });

  it('/user/update-profile/:username (PUT)', async () => {
    const data = await request(app.getHttpServer())
      .post('/user/login')
      .send(TestUserLoginDto)
      .expect(200);

    const updatedUser = await request(app.getHttpServer())
      .put('/user/update-profile/' + TestUsername)
      .set('Authorization', 'Bearer ' + data.body.access_token)
      .send(TestUpdateData)
      .expect(200);
    expect(updatedUser).toBeDefined();
    expect(updatedUser.text).toStrictEqual('updated successfully');
  });

  it('/user/:username (DELETE)', async () => {
    const data = await request(app.getHttpServer())
      .post('/user/login')
      .send(TestUserLoginDto)
      .expect(200);

    const deleteUser = await request(app.getHttpServer())
      .delete('/user/' + TestUsername)
      .set('Authorization', 'Bearer ' + data.body.access_token)
      .expect(200);
    expect(deleteUser).toBeDefined();
  });

  afterAll(() => {
    disconnect();
  });
});
