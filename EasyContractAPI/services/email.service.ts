import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';
import Mailjet, { Client } from 'node-mailjet';
import sgMail from '@sendgrid/mail';

export class EmailService {
    // mailjet: Client;

    constructor() {
        // this.mailjet = Mailjet.apiConnect(
        //     process.env.MJ_APIKEY_PUBLIC!,
        //     process.env.MJ_APIKEY_PRIVATE!,
        // );
    }

    async sendMail(email: string, subject: string, message: string, url: string): Promise<boolean> {
        if (!process.env.SENDGRID_API_KEY) {
            throw new Error('Email api failed to connect');
        }
       
        try{
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            const msg = {
                to: email, 
                from:'no-reply@vintagesoftware.co.za',
                subject: subject,
                text: message,
                html: `<a href="${url}" target="_blank"><button>Open Contract</button</a>`,
            };

            const mail = await sgMail.send(msg)
            return true;
        }catch(err){
            console.error(err);
            return false;
        }
    }
}