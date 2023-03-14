const db = require('../db')
const {NotFoundError, BadRequestError} = require('../expressError')
const Job = require('./job')
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testJobIds
} = require('./_testCommon')

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// create a new job
describe("create", () => {
    let newJob = {
        title: "test job",
        salary: 10000,
        equity: 0.3,
        companyHandle: "c1"
    };
    test('create new job', async () => {
        let job = await Job.create(newJob);
        console.log(job);
        expect(job.title).toBe(newJob.title);
    })
})


// get
describe("get", () => {
    test('get job by id', async () => {
        let job = await Job.get(testJobIds[0]);
        expect(job.title).toBe("Job1");
    })

    test('job not found', async () => {
        try {
            let job = await Job.get(0);
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

// update
describe("update", () => {
    let updateData = {
        title: "updated job",
        salary: 100000,
        equity: 0.4
    }
    test('update job', async () => {
        let job = await Job.update(testJobIds[0], updateData);
        expect(job.title).toBe(updateData.title);
    })

    test('job not found', async () => {
        try {
            let job = await Job.update(0, updateData);
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
    test('bad request', async () => {
        try {
            let job = await Job.update(testJobIds[0], {});
            console.log(job);
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

// delete
describe("delete", () => {
    test('delete job', async () => {
        let job = await Job.delete(testJobIds[0]);
        expect(job).toEqual({
            message: `deleted`
        });
    })
    test('job not found', async () => {
        try {
            let job = await Job.delete(0);
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})