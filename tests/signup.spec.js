import request from 'supertest'
import app from '../server.mjs';
import { expect } from 'chai';

describe.skip('Test /signup', () => {
  it('Test /signup', async () => {
    const response = await request(app)
      .post('/signup')
      .send({login: 'dimooooooooon@gmail.com', fullName: 'tyryry tyryry', password: '1234'})
      .set('Accept', 'application/json')
    console.log(response.body);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.any.keys('refreshToken', 'id')
  });
});