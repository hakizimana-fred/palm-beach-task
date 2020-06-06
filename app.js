import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import createLocaleMiddleware from 'express-locale';
import startPolyglot from './polyglot';

import DiscountController from './server/discountController';
import ActivityController from './server/activityController';

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  createLocaleMiddleware({
    priority: ['accept-language', 'default'],
    default: 'en_US'
  })
);

app.use(startPolyglot);

const PORT = 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${PORT}...`);
});

app.use(DiscountController);
app.use(ActivityController);

module.exports = app;
