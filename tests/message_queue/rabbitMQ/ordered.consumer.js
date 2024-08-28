'use strict';
const amqp = require('amqplib');

async function consumeOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    const channel = await connection.createChannel();

    const queueName = 'ordered-queue-message'
    await channel.assertQueue(queueName, {
        durable: true,
    });

    // Set prefetch = 1 to ensure that one ack at one time
    channel.prefetch(1);

    await channel.consume(queueName, async (msg) => {
        const message = msg.content.toString();

        // Mock delaying messages from network
        const timeout = Math.random() * 100;
        setTimeout(() => {
            console.log("Processed message: " + message + "; after " + Math.round(timeout) + 'ms.');
            channel.ack(msg);
        }, timeout);
    })


    setTimeout(() => {
        connection.close();
    }, 2500)
}

consumeOrderedMessage().catch(err => console.error("Error consuming ordered message: " + err.message))
