/* eslint-disable import/no-duplicates */
import express from 'express';
import json from 'express';
import Joi from 'joi';

import pool from './dbService';

import startPolyglot from '../polyglot';

const DiscountController = express.Router();

DiscountController.use(json());
DiscountController.use(startPolyglot);

const updateActivity = async discount => {
  const conn = await pool.getConnection();
  const sql = `UPDATE activity set price = price*((100 + ?) / 100)`;
  await conn.query(sql, [discount]);

  const rows = await conn.query(`SELECT * FROM activity LIMIT 1000;`);
  return rows;
};

const discountValidator = activity => {
  const schema = {
    discount: Joi.number().required()
  };
  return Joi.validate(activity, schema);
};

DiscountController.patch('/activities/price', async (req, res) => {
  const { error } = discountValidator(req.body);

  if (error) {
    return res.status(400).json({
      status: 400,
      error: error.details[0].message
    });
  }

  const { discount } = req.body;

  const rows = await updateActivity(discount);

  return res.status(200).json({
    status: 200,
    message: `Activity price has been incremented by ${discount}%`,
    rows
  });
});

export default DiscountController;
