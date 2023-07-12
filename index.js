// Imports:

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { SerialPort } = require("serialport");

// Constants:

const apiUrl = 'http://localhost:8081';
const serialPort = new SerialPort({
    path: 'COM3',
    baudRate: 9600
});

// Functions:

function sleep(ms) {
    return new Promise(
        (resolve) => {
            setTimeout(resolve, ms);
        }
    );
}

async function get(path) {
    var requestOptions = {
        method: 'GET'
    }
    var response = await fetch(apiUrl + path, requestOptions)
    if (response.ok) {
        return await response.text();
    } else {
        console.log('error')
        throw new Error('get error fetching the API');
    }
};

function serialWrite(action) {
    const serialMessage = action + '.';
    console.log('serialWrite', serialMessage);
    serialPort.write(serialMessage, function (err) {
        if (err) {
            return console.log("Error on write: ", err.message);
        }
        console.log("Message sent successfully", serialMessage);
    });
}

async function app() {
    let last_response = '';
    while (true) {
        try {
            await sleep(200);
            var response = await get('/command');
            if (response !== last_response) {
                last_response = response;
                serialWrite(response)
            }
        } catch (error) {
            console.log(error);
        }
    }
}

// Main code:

app();