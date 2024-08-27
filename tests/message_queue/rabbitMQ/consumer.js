const amqp = require('amqplib');

const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const channel = await connection.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true,
        });

        channel.consume(queueName, (messages) => {
            console.log("Received message: " + messages.content.toString());
        }, {
            noAck: true,
        })
    } catch (error) {
        console.error("Error running consumer for RabbitMQ: " + error.message);
    }
}

runConsumer();