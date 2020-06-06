import * as Polyglot from 'node-polyglot';
import { messages } from './i18n';

// eslint-disable-next-line import/prefer-default-export
export const startPolyglot = (req, res, next) => {
  // Get the locale from express-locale
  const locale = req.locale.language;

  // Start Polyglot and add it to the req
  req.polyglot = new Polyglot();

  // Decide which phrases for polyglot will be used
  if (locale === 'es') {
    req.polyglot.extend(messages.es);
  } else if (locale === 'de') {
    req.polyglot.extend(messages.de);
  } else {
    req.polyglot.extend(messages.en);
  }

  next();
};
