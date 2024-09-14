// pages/api/initiate-call.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const call = await client.calls.create({
        from: "+13346103967",
        to: "+919337561649", // Replace with the number you want to call
        url: "http://demo.twilio.com/docs/voice.xml",
      });
      
      res.status(200).json({ success: true, callSid: call.sid });
    } catch (error) {
      console.error('Error initiating call:', error);
      res.status(500).json({ success: false, error: 'Failed to initiate call' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}