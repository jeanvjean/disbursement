require('../../config');

const { rabbitmqArchitecture, rabbitmq } = require('../../../utils/rabbitmq');
const { exportPendingResolve } = require('../../../utils/pendingResolve');

let retry = 0;

const run = async () => {
  const { channel } = await rabbitmq();
  const { queue, exchange, routingKey } = await rabbitmqArchitecture(
    'exports_pending_resolve_queue'
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
  try {
    // consume message from queue
    await channel.consume(
      q.queue,
      async msg => {
        const message = JSON.parse(msg.content.toString());
        try {
          switch (`${message.action}_${message.type}`) {
            case 'exports_pending_resolve_fire':
              {
                console.log(' [Received] %s', message.action);
                await exportPendingResolve(message.data);
                console.log(
                  ' [Processed] %s',
                  `ExportsPendingResolveWorker - ${message.action}`
                );
                channel.ack(msg); // acknowledged processing is complete
              }
              break;
            default:
              break;
          }
        } catch (error) {
          console.error({ ExportsPendingResolveWorker: error });
          retry = parseInt(retry + 1);
          if (retry >= 3) {        
            channel.ack(msg);
          } else {
            channel.nack(msg);
          }
        }
      },
      { noAck: false } // ensure that message acknowledged after processed - it must be false to work like so
    );
  } catch (err) {
    console.log({ err });
  }
};
// call function
run();
