"use strict";

const request = require('supertest')
const app = require('../app')

const {
    commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u4Token,
} = require('./_testCommon')

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**
 * POST jobs
 * require admin auth
 */
describe('POST /jobs', () => {
    const newJob = {
        title: 'test-job',
        salary: 100,
        equity: 0.1,
        company_handle: 'test',
    }

    test('should create a job for admin', async () => {
        const resp = await request(app)
            .post('/jobs')
            .send(newJob)
            .set('authorization', `Bearer ${u4Token}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body.title).toEqual('test-job');
    })
})