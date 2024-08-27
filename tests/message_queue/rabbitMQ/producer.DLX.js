'use strict';
const amqp = require('amqplib');

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const channel = await connection.createChannel();

        const notiExchange = 'notificationExchange';
        const notiQueue = 'notificationQueueProcess';
        const notiExchangeDLX = 'notificationExchangeDLX';
        const notiRoutingKeyDLX = 'notificationRoutingKeyDLX';

        await channel.assertExchange(notiExchange, 'direct', { durable: true });
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false,
            durable: true,
            deadLetterExchange: notiExchangeDLX,
            deadLetterRoutingKey: notiRoutingKeyDLX
        });

        await channel.bindQueue(queueResult.queue, notiExchange);

        const msg = 'A new product has been created!';
        channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: 10000, //10s
        });
        console.log("Message has sent to queue: " + msg);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error("Error running producer for RabbitMQ DLX: " + error.message);
    }
}

runProducer();