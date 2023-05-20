require('../../config');

const {
  rabbitmqArchitecture,
  rabbitmq,
} = require('../../../utils/rabbitmq');
const { sendExportedPendingResolve } = require('../../../utils/pendingResolve');

const run = async () => {
  const { channel } = await rabbitmq();
  const { queue, exchange, routingKey } = await rabbitmqArchitecture(
    'send_exported_pending_resolve_queue'
  );

  

  // create the exchange if it doesn't already exist
  await channel.assertExchange(exchange, 'topic', { durable: true });
  // create the queue if it doesn't already exist
  const q = await channel.assertQueue(queue, { durable: true });
  // bind queue to exchange
  await channel.bindQueue(q.queue, exchange, routingKey);
  console.log(' [*] Waiting for %s. To exit press CTRL+C', queue);
  // get one message off the queue at a time
  await channel.prefetch(1);
  // consume message from queue
  await channel.consume(
    q.queue,
    async msg => {
      try {
        const message = JSON.parse(msg.content.toString());

        console.log(`${message.action}_${message.type}`);
        switch (`${message.action}_${message.type}`) {
          case 'send_exported_pending_resolve_fire':
            {
              console.log(' [Received] %s', message.type);
              await sendExportedPendingResolve(message.data);
              console.log(
                ' [Processed] %s',
                `SendExportedPendingResolveWorker - ${message.type}`
              );
              channel.ack(msg); // acknowledged processing is complete
            }
            break;

          default:
            break;
        }
      } catch (error) {
        console.error({ RetrySendingExportedPendingResolveError: error });
        channel.nack(msg);
      }
    },
    { noAck: false } // ensure that message acknowledged after processed - it must be false to work like so
  );
};
// call function
run();
