import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {

    // Initialize Nodemailer transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
  }

  async sendVerifyEmail(email: string, otp: number) {
    // Send welcome email using Nodemailer transporter
    await this.transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Verification email',
      html: `<h3> Welcome to our platform </h3> <p>This is your verification OTP : ${otp}</p>`,
    });
  }
}
