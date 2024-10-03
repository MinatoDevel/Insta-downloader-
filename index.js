const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/api/videos/:username', async (req, res) => {
  const username = req.params.username;
  const url = `https://www.instagram.com/${username}/`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const videoUrls = [];

    $('video').each((index, element) => {
      const videoUrl = $(element).attr('src');
      videoUrls.push(videoUrl);
    });

    res.json(videoUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching video URLs' });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
