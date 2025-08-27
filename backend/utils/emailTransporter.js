import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nationofaura@gmail.com',
    pass: 'rihrtixdyxadphql',
  },
});

export default transporter;
