'use strict';
const db = require('../db');
const {BadRequestError, NotFoundError} = require('../expressError');

// Related functions for jobs

class Job {
    /** Create a new job.
     *  data should be { title, salary, equity, companyHandle }
     */
    static async create(data) {
        const result = await db.query(
            `INSERT INTO jobs 
            (title, salary, equity, company_handle)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, salary, equity, company_handle AS "companyHandle"
            `,
            [
                data.title,
                data.salary,
                data.equity,
                data.companyHandle
            ]
        )
        const job = result.rows[0];
        return job;
    }

    // find a job by id
    static async get(id) {
        const result = await db.query(
            `SELECT title, salary, equity, company_handle AS "companyHandle"
            FROM jobs
            WHERE id = $1`,
            [id]
        )
        const job = result.rows[0];

        if (!job) throw new NotFoundError('Job not found');
        return job;
    }

    // find all jobs
    static async findAll({minSalary, hasEquity, title} = {}){
        let baseQuery = `
        SELECT id, title, salary, equity, company_handle AS "companyHandle"
        FROM jobs`

        let queryArr = [];
        let queryBuilder = [];

        
        if(minSalary !== undefined) {
            queryArr.push(minSalary);
            queryBuilder.push(` WHERE salary >= ${minSalary}`);
        }

        if (hasEquity) {
            queryArr.push(hasEquity);
            if (queryArr.length > 1){
                queryBuilder.push(` AND equity > 0`);
            } else {
                queryBuilder.push(` WHERE equity > 0`);
            }
        }
        if (title !== undefined) {
            queryArr.push(title);
            if (queryArr.length > 1){
                queryBuilder.push(` AND title ILIKE "%${title}%"`);
            } else {
                queryBuilder.push(` WHERE title LIKE "%${title}%"`);
            }
        }
        queryBuilder.push(` ORDER BY salary DESC`);
        baseQuery += queryBuilder.join('');
        const results = await db.query(baseQuery);
        return results.rows;
    }

    // update a job by id provided data { title, salary, equity }
    static async update(id, data) {
        const keys = Object.keys(data);
        if (keys.length === 0) throw new BadRequestError('No data provided');

        const result = await db.query(
            `UPDATE jobs
            SET title = $1, salary = $2, equity = $3
            WHERE id = $4
            RETURNING id, title, salary, equity, company_handle AS "companyHandle"
            `,
            [
                data.title,
                data.salary,
                data.equity,
                id
            ]
        )
        const job = result.rows[0];
        if (!job) throw new NotFoundError('Job not found');
        return job;
    }

    // delete a job by id
    static async delete(id) {
        const result = await db.query(
            `DELETE FROM jobs
            WHERE id = $1
            RETURNING id
            `,
            [id]
        )
        const job = result.rows[0];
        if (!job) throw new NotFoundError('Job not found');
        return {message: `deleted`};

    }

}

module.exports = Job;