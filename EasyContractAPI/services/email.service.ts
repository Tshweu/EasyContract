import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';
import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();

export class EmailService {

    constructor() {
    }

    async sendMail(recipient: string, subject: string, message: string): Promise<void> {
        if (!process.env.GM_APP_PW) {
            throw new Error('Email api failed to connect');
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'biztalk2024@gmail.com', 
                pass: process.env.GM_APP_PW
            }
        });
    
        // Define the email options
        const mailOptions = {
            from: 'sender mail', 
            to: recipient, 
            subject: subject, 
            html: message,
        };
    
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error occurred:", error);
                throw new Error('Email api failed to connect');
            }
        });
    }
}
