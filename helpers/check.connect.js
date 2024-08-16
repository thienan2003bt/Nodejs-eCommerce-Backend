'use strict'
const mongoose = require('mongoose');
const os = require('os');

const _MONITOR_SECONDS = 5000 // 5 seconds
const _CONNECTIONS_PER_CORE = 5

const countConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log("Number of connections: " + numConnections);
}


const checkOverloadedConnect = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        console.log("Active connections: " + numConnections);
        console.log("Memory usage: " + memoryUsage / 1024 / 1024 + " MB");
        const maxConnections = numCores * _CONNECTIONS_PER_CORE;
        if (numConnections > maxConnections) {
            console.log("Connection overload detected !");
            // TODO: send notification for overloaded connections
        }

    }, _MONITOR_SECONDS)
}

module.exports = {
    countConnect,
    checkOverloadedConnect
}