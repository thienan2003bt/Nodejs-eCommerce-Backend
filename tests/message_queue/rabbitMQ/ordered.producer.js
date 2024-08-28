'use strict';
const amqp = require('amqplib');

async function produceOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    const channel = await connection.createChannel();

    const queueName = 'ordered-queue-message'
    await channel.assertQueue(queueName, {
        durable: true,
    });

    const msgNum = 10;
    for (let i = 0; i < msgNum; i++) {
        const msg = `Ordered message: ${i}`;

        channel.sendToQueue(queueName, Buffer.from(msg), {
            persistent: true,
        });
        console.log('Send ordered message successfully: ' + i);
    }

    setTimeout(() => {
        connection.close();
    }, 500)
}

produceOrderedMessage().catch(err => console.error("Error consuming ordered message: " + err.message))
