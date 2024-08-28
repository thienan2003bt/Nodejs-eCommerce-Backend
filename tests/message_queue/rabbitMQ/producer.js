const amqp = require('amqplib');

const messages = "Hello RabbitMQ for Thien An!";

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const channel = await connection.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true,
        });

        channel.sendToQueue(queueName, Buffer.from(messages))
        console.log("Message sent to queue: " + messages);
    } catch (error) {
        console.error("Error running producer for RabbitMQ: " + error.message);
    }
}

runProducer();