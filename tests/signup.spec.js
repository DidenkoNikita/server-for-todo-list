import request from 'supertest';
import { expect } from 'chai';

import app from '../server.mjs';

describe.skip('Test /signup', () => {
  it('Test /signup', async () => {
    const response = await request(app)
      .post('/signup')
      .send({login: 'dimooooooooon@gmail.com', fullName: 'tyryry tyryry', password: '1234'})
      .set('Accept', 'application/json');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.any.keys('refreshToken', 'id');
  });
});