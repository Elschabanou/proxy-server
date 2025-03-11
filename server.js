const express = require('express');
const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    console.log(`Fetching URL: ${url}`);
    const response = await fetch(url);
    console.log(`Response status: ${response.status}`);
    if (!response.ok) {
      const text = await response.text();
      console.error(`Error fetching URL: ${response.statusText}, Response body: ${text}`);
      throw new Error(`Error fetching URL: ${response.statusText}`);
    }
    const text = await response.text();
    const parser = new XMLParser();
    const data = parser.parse(text);
    res.json(data);
  } catch (error) {
    console.error('Error fetching URL:', error.message);
    res.status(500).send(`Error fetching URL: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});