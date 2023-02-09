const express = require('express');
const {getAdInsights, getAds, getAdSets, getAdSetInsights, getCampaings, getCampaignInsights, getAdAccounts} = require('./index');

const app = express();
const port = 3000;

clients = ['5379057635480936', '741302997038971', '1224883661342179']

/* ---- Root url - Welcome ---- */
app.get('/', (req, res) => {

    console.log(req.body);
    res.json({msg: "ok"});
  
})

/* ---- Retrive all clients ads ----- */
app.get('/ads', async (req, res) => {

    ads = await getAds(clients)
    res.json(ads);
  })

/* --- Retrive the ads insights */
app.get('/adsinsights', async (req, res) => {

    ads = await getAdInsights(clients)
    res.json(ads);
  })

/* ---- Retrive all clients adSets ----- */
app.get('/adsets', async (req, res) => {

    ads = await getAdSets(clients)
    res.json(ads);
  })

/* --- Retrive the adSet insights */
app.get('/adsetsinsights', async (req, res) => {

    ads = await getAdSetInsights(clients)
    res.json(ads);
  })

/* ---- Retrive all clients ads ----- */
app.get('/campaigns', async (req, res) => {

    ads = await getCampaings(clients)
    res.json(ads);
  })

/* --- Retrive the ads insights */
app.get('/campaigninsights', async (req, res) => {

    ads = await getCampaignInsights(clients)
    res.json(ads);
  })

/* ---- Retrive all clients ads ----- */
app.get('/accounts', async (req, res) => {

    ads = await getAdAccounts(clients)
    res.json(ads);
  })


  app.listen(port, () => {
    console.log(`Listening port: ${port}`)
  })
