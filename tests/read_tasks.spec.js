import request from 'supertest'
import app from '../server.mjs';
import { expect } from 'chai';

describe('Test /read_tasks', () => {
  it('Test read tasks', async () => {
    const response = await request(app)
      .post('/read_tasks')
      .send({user_id: 4})
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pa2l0YWRpZGVua28yQGdtYWlsLmNvbSIsImlhdCI6MTY4NjczNTgwMCwiZXhwIjoxNjg5MzI3ODAwfQ.VHM8KwmanDin4cW-xELpRt0UcuJCthDYj7Gj09xeWDc')
    console.log(response.body);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.any.keys('tasks', 'token');
  });
});