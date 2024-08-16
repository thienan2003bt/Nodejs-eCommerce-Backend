const app = require("./src/app");
require('dotenv').config();

const PORT = process.env.PORT || 8080;


const server = app.listen(PORT, () => {
    console.log("NodeJS ECommerce Backend is listening on port: " + PORT + ", url: http://localhost:" + PORT)
})

process.on('SIGINT', () => {
    server.close(() => console.log("! Exit Server Express !"))
    // TODO: Disconnect from MongoDB if needed
})
