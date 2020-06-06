import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '43a171d17ccf97',
    pass: '79beb121e947e2'
  }
});

const sendMail = async title => {
  await transporter.sendMail({
    from: '"Paolo" <paul-20d58d@inbox.mailtrap.io>',
    to: 'info@mallorcard.es',
    subject: 'Task created',
    text: `${title} has been created`
  });
};

export default sendMail;
