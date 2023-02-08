const express = require('express');
const {getAdInsights, getAds} = require('./index');

const app = express();
const port = 3000;

clients = ['5379057635480936', '741302997038971', '1224883661342179']

app.get('/', (req, res) => {
    res.send("Hello World")
  })

app.get('/ads', async (req, res) => {

    ads = await getAds(clients)
    res.json(ads);
  })
  
  app.get('/adsinsights', async (req, res) => {

    ads = await getAdInsights(clients)
    res.json(ads);
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
