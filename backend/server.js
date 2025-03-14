const express = require('express');
const axios = require('axios');
const http = require('http');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/getmcq', async (req, res) => {
  try {
    const payload = {
      role: "SE",
      chapter: "Intern"
    };

    // Ensure you use the same token that works in Postman
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiRU1QTE9ZRUUiLCJpYXQiOjE3NDE3NDg0NTEsImV4cCI6MTc0MTc1MjA1MX0.e-ySyY0Z3wf90ZWHJMILPe5djW_0tG_F1NqUIGPinzM";

    const response = await axios.post(
      'http://127.0.0.1:8080/api/v1/mcq',
      payload,
      {
        timeout: 10000, // 10 seconds timeout
        responseType: 'json',
        headers: {
          'Accept-Encoding': 'identity', // Request uncompressed response
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Connection': 'close'
        },
        httpAgent: new http.Agent({ keepAlive: false })
      }
    );

    // Send the API response back to the browser
    res.json(response.data);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('Error occurred while fetching data.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
