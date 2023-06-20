import request from 'supertest';
import { expect } from 'chai';

import app from '../server.mjs';

describe('Test /login', () => {
  it('Test /login', async () => {
    const response = await request(app)
      .post('/login')
      .send({login: 'nikitadidenko2@gmail.com', password: '1234'})
      .set('Accept', 'application/json');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.any.keys('refreshToken', 'id');
  });
});