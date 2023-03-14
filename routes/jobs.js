'use strict';

const express = require('express');
const router = express.Router();

const jsonschema = require('jsonschema');
const { BadRequestError } = require('../expressError')
const Job = require('../models/job');
const jobNewSchema = require('../schemas/jobNew.json')
const jobUpdateSchema = require('../schemas/jobUpdate.json')
const { admin } = require('../middleware/auth')


/**
 * Post new job
 * Requires admin permissions
 * expects params {title, salary, equity, companyHandle}
 * 
 */
router.post('/', admin, async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if(!validator.valid) {
            const errors = validator.errors.map(e => e.message);
            throw new BadRequestError(errors);
        }
        const newJob = await Job.create(req.body);
    return res.status(201).json({ newJob });
    } catch (err) {
        return next(err);
    }
})

/**
 * Get all jobs
 * Optional search filters {title, minSalary, hasEquity}
 */

router.get('/', async (req, res, next) => {
    const q = req.query;
    if (q.minSalary !== undefined) q.minSalary = +q.minSalary;
    
    try {
        const jobs = await Job.findAll(q)
    return res.json({jobs}) 
    } catch (err) {
        return next(err);
    }
})

/**
 * Get job by id
 */

router.get('/:id', async (req, res, next) => {
    try {
        const job = await Job.get(req.params.id)
    return res.json({job}) 
    } catch (err) {
        return next(err);
    }
})

/**
 * Update job by id
 * Requires admin permissions
 */
router.patch('/:id', admin, async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, jobUpdateSchema);
        if(!validator.valid) {
            throw new BadRequestError();
        }
        const job = await Job.update(req.params.id, req.body);
        return res.json({ job });
    } catch (err) {
        return next(err);
    }
});

/**
 * Delete job by id
 * Requires admin permissions
 */
router.delete('/:id', admin, async (req, res, next) => {
    try {
        const job = await Job.delete(req.params.id);
        return res.json({message: 'deleted'});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;