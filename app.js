const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const {downloadAdset, downloadAds, downloadInsights, downloadAccountCampaigns} = require('./downloadFiles')

/* ---- Root url - Welcome ---- */
app.get('/', (req, res) => {
    res.send("Bem vindo a API_Paradoxo Digital - Facebook data collector");
  
})

/* ---- Retrive all clients ads ----- */
app.get('/ads', async (req, res) => {

    try {
      fs.readFile(path.join(__dirname, "output", "ads" + ".json"),'utf8', (err, data) => {
        if (err) throw err
        res.json(JSON.parse(data));
      });

    } catch (error) {
        res.sendStatus(500);
    }
  })

/* --- Retrive the ads insights */
app.get('/adsinsights', async (req, res) => {
  if(!req.query.hasOwnProperty('data_preset')){
    return res.status(400).send({'error': "data_preset not informed in query. Could be today, yesterday, last_7d,.."})
  } else{
    try {
      fs.readFile(path.join(__dirname, "output", req.query.data_preset, "adsinsights" + ".json"),'utf8', (err, data) => {
        if (err){
          res.status(404).send('Arquivo não encontrado!');
          console.error(err);
        }else{
          res.json(JSON.parse(data));
        }
      });
      
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
  })

/* ---- Retrive all clients adSets ----- */
app.get('/adsets', async (req, res) => {
   
    try {
      fs.readFile(path.join(__dirname, "output", "adsets" + ".json"),'utf8', (err, data) => {
        if (err){
          res.status(404).send('Arquivo não encontrado!');
          console.error(err);
        }else{
          res.json(JSON.parse(data));
        }
      });

    } catch (error) {
        res.sendStatus(500);
    }
  })

/* --- Retrive the adSet insights */
app.get('/adsetsinsights', async (req, res) => {
  if(!req.query.hasOwnProperty('data_preset')){
    return res.status(400).send({'error': "data_preset not informed in query. Could be today, yesterday, last_7d,.."})
  } else{
    try {
      fs.readFile(path.join(__dirname, "output", req.query.data_preset, "adsetsinsights" + ".json"),'utf8', (err, data) => {
        if (err){
          res.status(404).send('Arquivo não encontrado!');
          console.error(err);
        }else{
          res.json(JSON.parse(data));
        }
      });

    } catch (error) {
        res.sendStatus(500);
    }
  }
  })

/* ---- Retrive all clients ads ----- */
app.get('/campaigns', async (req, res) => {

    try {
      fs.readFile(path.join(__dirname, "output", "campaigns" + ".json"),'utf8', (err, data) => {
        if (err){
          res.status(404).send('Arquivo não encontrado!');
          console.error(err);
        }else{
          res.json(JSON.parse(data));
        }
      });

    } catch (error) {
        res.sendStatus(500);
    }

  })

/* --- Retrive the ads insights */
app.get('/campaigninsights', async (req, res) => {
  if(!req.query.hasOwnProperty('data_preset')){
    return res.status(400).send({'error': "data_preset not informed in query. Could be today, yesterday, last_7d,.."})
  } else{
    try {
      fs.readFile(path.join(__dirname, "output", req.query.data_preset, "campaigninsights" + ".json"),'utf8', (err, data) => {
        if (err){
          res.status(404).send('Arquivo não encontrado!');
          console.error(err);
        }else{
          res.json(JSON.parse(data));
        }
      });

    } catch (error) {
        res.sendStatus(500);
    }
  }
  });

/* ---- Retrive all clients ads ----- */
app.get('/accounts', async (req, res) => {
    
    try {     
      fs.readFile(path.join(__dirname, "output", "accounts" + ".json"),'utf8', (err, data) => {
        if (err){
          res.status(404).send('Arquivo não encontrado!');
          console.error(err);
        }else{
          res.json(JSON.parse(data));
        }
      });

    } catch (error) {
        res.sendStatus(500);
    }
  })

  /* ------ Routes to download the facebook data ------ */
  
app.get('/download-adset', (req, res) => {
  try {
    console.log('------- Iniciando o download adset ------');
    downloadAdset()
    return res.send('Adset download in progress..')
  } catch (error) {
      return res.status(500).send(error);
  }
}) 

app.get('/download-insights', (req, res) => {
  try {
    console.log('------- Iniciando o download insights ------');
    downloadInsights('today');
    downloadInsights('yesterday');
    downloadInsights('last_3d');
    downloadInsights('last_7d');
    downloadInsights('last_14d');
    downloadInsights('last_30d');
    downloadInsights('last_90d');
    return res.send('Insight download in progress..')
  } catch (error) {
      return res.status(500).send(error);
  }
}) 

app.get('/download-ads', (req, res) => {
  try {
    console.log('------- Iniciando o download ads ------');
    downloadAds()
    return res.send('Ads download in progress..')
  } catch (error) {
      return res.status(500).send(error);
  }
}) 

app.get('/download-accountcampaign', (req, res) => {
  try {
    console.log('------- Iniciando o download Account-Campaign ------');
    downloadAccountCampaigns()
    return res.send('Account-Campaign download in progress..')
  } catch (error) {
      return res.status(500).send(error);
  }
}) 

app.listen(port, () => {
  console.log(`Listening port: ${port}`)
})

