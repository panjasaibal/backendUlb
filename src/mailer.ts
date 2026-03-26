import nodemailer from 'nodemailer'
import { config } from './config'
import { ServerError } from '@panjasaibal/backend_ulb_shared';

export async function sendInvitationMail(email:string,name:string, invitationLink:string) {
    try {
        const mailer = nodemailer.createTransport(
        {
            host:config.HOST_EMAIL,
            port:587,
            secure: true,
            auth:{
                user: config.SENDER_EMAIL,
                pass: config.SENDER_EMAIL_PASSWORD
            }

        }
    )

    const smtpConnectionChecker = await mailer.verify();
    if(!smtpConnectionChecker) throw new ServerError("mailer server unverified!!", "mailer sendInvitationMethod()");

    const info = await mailer.sendMail({
        to:email,
        from:`ULB admin :${config.SENDER_EMAIL}`,
        subject:'Onboarding on ULB Platform',
        text:`Welcome ${name} please use this link to onboard inot this platform: ${invitationLink}.`,
        html:`<b>Hi ${name}</b> <br> <p>Welcome ${name} please use this link to onboard inot this platform: ${invitationLink}.</p><br> <p>Thank you,</p>`

    })
    return info.messageId;

    } catch (error) {
        
    }
    


}