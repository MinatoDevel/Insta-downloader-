const express = require('express');
const { IgApiClient } = require('instagram-private-api');

const app = express();
const port = 3000;

app.use(express.json());

const ig = new IgApiClient();

// Replace with your Instagram credentials
const username = 'your_instagram_username';
const password = 'your_instagram_password';

async function login() {
  ig.state.generateDevice(username);
  await ig.account.login(username, password);
}

app.get('/', (req, res) => {
  res.send('Instagram Video Downloader API');
});

app.post('/download', async (req, res) => {
  try {
    const { targetUsername } = req.body;

    if (!targetUsername) {
      return res.status(400).json({ error: 'Target username is required' });
    }

    await login();

    const user = await ig.user.searchExact(targetUsername);
    const userFeed = ig.feed.user(user.pk);
    
    let items = [];
    do {
      items = items.concat(await userFeed.items());
    } while (userFeed.isMoreAvailable());

    const videoItems = items.filter(item => item.video_versions);

    if (videoItems.length === 0) {
      return res.status(404).json({ error: 'No videos found for this user' });
    }

    const randomIndex = Math.floor(Math.random() * videoItems.length);
    const randomVideo = videoItems[randomIndex];

    res.json({
      success: true,
      videoUrl: randomVideo.video_versions[0].url,
      caption: randomVideo.caption ? randomVideo.caption.text : '',
      postedAt: new Date(randomVideo.taken_at * 1000).toISOString()
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
