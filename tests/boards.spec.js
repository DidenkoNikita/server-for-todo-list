import request from 'supertest';
import { expect } from 'chai';

import app from '../server.mjs';

describe('Test /boards', () => {
  it('Test add board', async () => {
    const response = await request(app)
      .post('/boards')
      .send({title: 'board', user_id: 4})
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pa2l0YWRpZGVua28yQGdtYWlsLmNvbSIsImlhdCI6MTY4NjczNTgwMCwiZXhwIjoxNjg5MzI3ODAwfQ.VHM8KwmanDin4cW-xELpRt0UcuJCthDYj7Gj09xeWDc');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.any.keys('board');
  });

  it.skip('Test delete board', async () => {
    const response = await request(app)
      .delete('/boards')
      .send({user_id: 4, id: 302})
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pa2l0YWRpZGVua28yQGdtYWlsLmNvbSIsImlhdCI6MTY4NjczNTgwMCwiZXhwIjoxNjg5MzI3ODAwfQ.VHM8KwmanDin4cW-xELpRt0UcuJCthDYj7Gj09xeWDc');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.any.keys('refreshToken', 'id');
  });
});