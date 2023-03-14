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

// find all jobs
describe("findAll", () => {
    let testTitle = 'ob'

    test('find all jobs no filters', async () => {
        let jobs = await Job.findAll();
        expect(jobs.length).toBe(testJobIds.length);
    })

    test('find all jobs with filter = title', async () => {
        let jobs = await Job.findAll(testTitle);
        expect(jobs).toEqual([
            {
                id: testJobIds[2],
                title: "Job3",
                salary: 300,
                equity: '0',
                companyHandle: "c2"
            },
            {
                id: testJobIds[1],
                title: "Job2",
                salary: 200,
                equity: '0.2',
                companyHandle: "c1"
            },
            {
                id: testJobIds[0],
                title: "Job1",
                salary: 100,
                equity: '0.1',
                companyHandle: "c1"
            }
        ])
    })

    test('find all jobs with filter = minSalary', async () => {
        let jobs = await Job.findAll({minSalary: 201});
        expect(jobs).toEqual([
            {
                id: testJobIds[2],
                title: "Job3",
                salary: 300,
                equity: '0',
                companyHandle: "c2"
            }
        ])
    })

    test('find all jobs with filter hasEquity = false', async () => {
        let jobs = await Job.findAll({hasEquity: false});
        expect(jobs).toEqual([
            {
                id: testJobIds[2],
                title: "Job3",
                salary: 300,
                equity: '0',
                companyHandle: "c2"
            },
            {
                id: testJobIds[1],
                title: "Job2",
                salary: 200,
                equity: '0.2',
                companyHandle: "c1"
            },
            {
                id: testJobIds[0],
                title: "Job1",
                salary: 100,
                equity: '0.1',
                companyHandle: "c1"
            }
        ])
    })

    test('find all jobs with filter hasEquity = true', async () => {
        let jobs = await Job.findAll({hasEquity: true});
        expect(jobs).toEqual([
            {
                id: testJobIds[1],
                title: "Job2",
                salary: 200,
                equity: '0.2',
                companyHandle: "c1"
            },
            {
                id: testJobIds[0],
                title: "Job1",
                salary: 100,
                equity: '0.1',
                companyHandle: "c1"
            }
        ])
    })

    test('find all with filter = minSalary and hasEquity = false', async () => {
        let jobs = await Job.findAll({ minSalary: 201, hasEquity: false});
        expect(jobs).toEqual([{
            id: testJobIds[2],
            title: "Job3",
            salary: 300,
            equity: '0',
            companyHandle: "c2"
        }])
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