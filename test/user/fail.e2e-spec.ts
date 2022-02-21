import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { disconnect } from 'mongoose';
import { fakeAccessToken, TestUsernameFail, TestUserRegisterFailDto } from '../dto/fail-test.dto';
import { TestUpdateData, TestUserLoginDto, TestUsername } from '../dto/success-test.dto';

describe('Fail test for API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe())
    await app.init();
  });

  it('/user/register (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/user/register')
      .send(TestUserRegisterFailDto)
      .expect(400);
    expect(res.body).toBeDefined();
    expect(res.body).toStrictEqual({ statusCode: 400, message: 'User already exist' });
  });

  it('/user/:username (GET) ', async () => {
    const data = await request(app.getHttpServer())
      .get('/user/' + TestUsernameFail)
      .expect(404);
    expect(data.body).toBeDefined();
    expect(data.body.message).toBe('User not found');
  });

  it('/user/update-profile/:username (PUT)', async () => {
    const data = await request(app.getHttpServer())
      .post('/user/login')
      .send(TestUserLoginDto)
      .expect(200);

    const updatedUser = await request(app.getHttpServer())
      .put('/user/update-profile/' + TestUsernameFail)
      .set('Authorization', 'Bearer ' + fakeAccessToken)
      .send(TestUpdateData)
      .expect(401);
    expect(updatedUser).toBeDefined();
    expect(updatedUser.body.message).toStrictEqual('Unauthorized');
  });

  it('/user/:username (DELETE)', async () => {
    const data = await request(app.getHttpServer())
      .post('/user/login')
      .send(TestUserLoginDto)
      .expect(200);

    const deleteUser = await request(app.getHttpServer())
      .delete('/user/' + TestUsername)
      .set('Authorization', 'Bearer ' + fakeAccessToken)
      .expect(401);
    expect(deleteUser).toBeDefined();
    expect(deleteUser.body.message).toStrictEqual('Unauthorized');
  });

  afterAll(() => {
    disconnect();
  });
});
