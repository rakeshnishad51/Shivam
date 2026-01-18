const { spawn } = require("child_process");
const axios = require("axios");
const logger = require("./utils/log");

/* ================= CREATE WEBSITE FOR DASHBOARD/UP-TIME ================= */

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.set('trust proxy', true);

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});

// Serve the index.html file
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// Start the server and add error handling
app.listen(port, '0.0.0.0', () => {
    logger(`Server is running on port ${port}...`, "[ Starting ]");
}).on('error', (err) => {
    if (err.code === 'EACCES') {
        logger(`Permission denied. Cannot bind to port ${port}.`, "[ Error ]");
    } else {
        logger(`Server error: ${err.message}`, "[ Error ]");
    }
});

/* ================= CREATE START BOT AND MAKE IT LOOP ================= */

// Initialize global restart counter
global.countRestart = global.countRestart || 0;

function startBot(message) {
    if (message) logger(message, "[ Starting ]");

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "ARIF-BABU.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit !== 0 && global.countRestart < 5) {
            global.countRestart += 1;
            logger(`Bot exited with code ${codeExit}. Restarting... (${global.countRestart}/5)`, "[ Restarting ]");
            startBot();
        } else {
            logger(`Bot stopped after ${global.countRestart} restarts.`, "[ Stopped ]");
        }
    });

    child.on("error", (error) => {
        logger(`An error occurred: ${JSON.stringify(error)}`, "[ Error ]");
    });
};

/* ================= CHECK UPDATE FROM GITHUB ================= */


// Start the bot
startBot();
