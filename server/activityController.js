/* eslint-disable import/no-duplicates */
import express from 'express';
import json from 'express';
import Joi from 'joi';

import sendMail from './mailController';
import pool from './dbService';
import uploadImage from './activityMiddleware';

import startPolyglot from '../polyglot';

const ActivityController = express.Router();

ActivityController.use(json());
ActivityController.use(startPolyglot);

const createActivity = async (title, subTitle, description, price) => {
  const conn = await pool.getConnection();
  const sql = `INSERT INTO activity 
  (title, subTitle, description, price, picture) 
  VALUES (?, ?, ?, ?,?)`;
  await conn.query(sql, [
    title.trim(),
    (subTitle && subTitle.trim()) || '',
    (description && description.trim()) || '',
    price
  ]);

  const rows = await conn.query(`SELECT * FROM activity LIMIT 1000;`);
  return rows;
};

const activityValidator = activity => {
  const schema = {
    title: Joi.string()
      .min(3)
      .max(100)
      .required(),
    subTitle: Joi.string()
      .min(3)
      .max(100),
    description: Joi.string()
      .min(3)
      .max(100),
    price: Joi.number().required(),
    picture: Joi.string()
  };
  return Joi.validate(activity, schema);
};

ActivityController.post('/activities/add', uploadImage, async (req, res) => {
  const { error } = activityValidator(req.body);

  if (error) {
    return res.status(400).json({
      status: 400,
      error: error.details[0].message
    });
  }

  const { title, subTitle, description, price, picture } = req.body;

  const rows = await createActivity(
    title,
    subTitle,
    description,
    price,
    picture
  );

  sendMail(rows[rows.length - 1].title);

  return res.status(200).json({
    status: 200,
    message: 'Activity created, mail notification initiated.',
    activity: rows[rows.length - 1]
  });
});

export default ActivityController;
