const path = require('path')
const ejs = require('ejs')
const ClientHttp = require('../utils/Client')

class NotificationService {
    constructor ({ config, errors }) {
        this.baseUrl = config.get('notification.base_uri');
        this.headers = {
            'secret-key': config.get('notification.api_key')
        },
        this.errors = errors;
        this.config = config;
        this.client = new ClientHttp(this.baseUrl, this.headers)
    }

    async sendForgotPasswordMail({ user, url }) {
        try {
            const emailTemplate = await ejs.renderFile(path.join(__dirname, '../../views/emails/forgot-password-mail.ejs'), { user, url });

            const message = {
                to: user.email,
                bcc: ['akudevops2@gmail.com'],
                from: this.config.get('notification.email.from_mail'),
                subject: "Password Reset AKUPAY SOS",
                html: emailTemplate
            };
            const response = await this.client.post(
                'notifications/email',
                message
            );
            console.log({ response });

            return response;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async sendUserInviteMail({ user, url }) {
        try {
            const emailTemplate = await ejs.renderFile(path.join(__dirname, '../../views/emails/invite-user.ejs'), { user, url });

            const message = {
                to: user.email,
                bcc: ['akudevops2@gmail.com'],
                from: this.config.get('notification.email.from_mail'),
                subject: "Invitation to AKUPAY SOS",
                html: emailTemplate
            };

            const response = await this.client.post(
                'notifications/email',
                message
            );

            return response;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async sendUploadMail({ user, successBucketUrl, errorBucketUrl }) {
        try {
            const emailTemplate = await ejs.renderFile(path.join(__dirname, '../../views/emails/upload.ejs'), { user, successBucketUrl, errorBucketUrl });

            const message = {
                to: user.email,
                bcc: ['akudevops2@gmail.com'],
                from: this.config.get('notification.email.from_mail'),
                subject: "File Upload Report",
                html: emailTemplate
            };

            const response = await this.client.post(
                'notifications/email',
                message
            );

            return response;
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = NotificationService;