import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
  token: 'apify_api_hK2Pc8SGUgiFc23VS3HOPyLNYbDbFZ3XYF6r',
});

// Prepare Actor input
const input = {
  "startUrls": [
    {
      "url": "https://www.instagram.com/{username}/"
    }
  ],
  "proxy": {
    "useApifyProxy": true
  },
  "maxRequestRetries": 10
};

// Run the Actor and wait for it to finish
const run = await client.actor("pocesar/download-instagram-video").call(input);

// Fetch and print Actor results from the run's dataset (if there are any)
console.log('Results from dataset');
console.log(`Check your data here: https://console.apify.com/storage/datasets/${run.defaultDatasetId}`);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
items.forEach((item) => {
  console.dir(item);
});
