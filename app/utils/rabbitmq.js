const config = require('../../config');

const amqp = require('amqplib');

let connectionString;
switch (config.get('server.app.environment')) {
        case 'production':
            connectionString = config.get('rabbitmq.url');
            // connectionString = `amqp://${config.get('rabbitmq.username')}:${config.get('rabbitmq.password')}@${config.get('rabbitmq.domain')}:${config.get('rabbitmq.port')}`;
            break;
        case 'development':
            connectionString = config.get('rabbitmq.url');
            // connectionString = `amqp://${config.get('rabbitmq.username')}:${config.get('rabbitmq.password')}@${config.get('rabbitmq.domain')}:${config.get('rabbitmq.port')}`;
            break;
        default:
            connectionString = config.get('rabbitmq.url');
            // connectionString = `amqp://${config.get('rabbitmq.username')}:${config.get('rabbitmq.password')}@${config.get('rabbitmq.domain')}:${config.get('rabbitmq.port')}`;
            break;
}

const connection = async() => {
    try {
        const amqpconnection = await amqp.connect(connectionString);
        const channel = await amqpconnection.createConfirmChannel();

        return {
            connection: amqpconnection,
            channel
        };
    } catch (error) {
        throw new Error(error);
    }
};

const rabbitmqArchitecture = worker => new Promise((resolve, reject) => {
    try {
        const exchange = 'aku.abp_monitor.exchange';
        switch (worker) {
                case 'farmers_analysis_queue':
                    resolve({
                        queue: 'farmers_analysis.queue',
                        exchange,
                        routingKey: 'farmers_analysis.send'
                    });
                    break;
                case 'farmers_verification_queue':
                    resolve({
                        queue: 'farmers_verification.queue',
                        exchange,
                        routingKey: 'farmers_verification.send'
                    });
                    break;
                case 'farmers_analysis_mail_queue': 
                    resolve({
                        queue: 'farmers_analysis_mail.queue',
                        exchange,
                        routingKey: 'farmers_analysis_mail.send'
                    });
                    break;
                case 'providers_analysis_queue':
                    resolve({
                        queue: 'providers_analysis.queue',
                        exchange,
                        routingKey: 'providers_analysis.send'
                    });
                    break;
                case 'exports_audit_logs_queue':
                    resolve({
                        queue: 'exports_audit_logs_queue',
                        exchange,
                        routingKey: 'exports_audit_logs'
                    });
                    break;
                case 'send_exported_audit_logs_queue':
                    resolve({
                        queue: 'send_exported_audit_logs_queue',
                        exchange,
                        routingKey: 'send_exported_audit_logs'
                    });
                    break;
                case 'exports_flagged_approve_queue':
                    resolve({
                        queue: 'exports_flagged_approve_queue',
                        exchange,
                        routingKey: 'exports_flagged_approve'
                    });
                    break;
                case 'send_exported_flagged_approve_queue':
                    resolve({
                        queue: 'send_exported_flagged_approve_queue',
                        exchange,
                        routingKey: 'send_exported_flagged_approve'
                    });
                    break;
                case 'exports_pending_resolve_queue':
                    resolve({
                        queue: 'exports_pending_resolve_queue',
                        exchange,
                        routingKey: 'exports_pending_resolve'
                    });
                    break;
                case 'send_exported_pending_resolve_queue':
                    resolve({
                        queue: 'send_exported_pending_resolve_queue',
                        exchange,
                        routingKey: 'send_exported_pending_resolve'
                    });
                    break;
                default:
                    throw new Error('Invalid queue: Something bad happened!');
        }
    } catch (error) {
        reject(error);
    }
});

module.exports = { rabbitmq: connection, rabbitmqArchitecture };
