const express = require('express');
const env = require('dotenv').config();
const app = express();
app.use(express.json())
const port = process.env.PORT_APP || 3000;
const DBConnection = require('./config/databaseConnection');
const cronJob = require('./downloadFiles');

const {downloadAdset, downloadAds, downloadInsights, downloadCampaigns, downloadAllCampaigns, downloadAccount, downloadAllCampaingInsight} = require('./index')
const {setAccountIDs, deleteAccountIDs, getAccountIds, download3LastMonthCampaingInsights} = require('./index');

/* ---- Root url - Welcome ---- */
app.get('/', (req, res) => {
    res.send("Bem vindo a API_Paradoxo Digital - Facebook data collector"); 
})

/* ---- Retrive all clients ads ----- */
app.get('/ads', async (req, res) => {

  try {     
    const accounts = await DBConnection.getData('Ads');
    return res.send(accounts);
    
  } catch (error) {
      console.error(error);
      res.sendStatus(500);
  }
    
  })

/* --- Retrive the ads insights */
app.get('/adsinsights', async (req, res) => {
  try {     
    const accounts = await DBConnection.getData('Insight-Ads');
    return res.send(accounts);
    
  } catch (error) {
      console.error(error);
      res.sendStatus(500);
  }
  })

/* ---- Retrive all clients adSets ----- */
app.get('/adsets', async (req, res) => {
   
  try {     
    const accounts = await DBConnection.getData('AdSet');
    return res.send(accounts);
    
  } catch (error) {
      console.error(error);
      res.sendStatus(500);
  }
  })

/* --- Retrive the adSet insights */
app.get('/adsetsinsights', async (req, res) => {
  try {     
    const accounts = await DBConnection.getData('Insight-AdSet');
    return res.send(accounts);
    
  } catch (error) {
      console.error(error);
      res.sendStatus(500);
  }
  })

/* ---- Retrive all clients ads ----- */
app.get('/campaigns', async (req, res) => {

  try {     
    const accounts = await DBConnection.getData('Campaign');
    return res.send(accounts);
    
  } catch (error) {
      console.error(error);
      res.sendStatus(500);
  }

  })

/* --- Retrive the ads insights */
app.get('/campaigninsights', async (req, res) => {
    try {     
      const accounts = await DBConnection.getData('Insight-Campaign');
      return res.send(accounts);
      
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
  });

/* ---- Retrive all clients ads ----- */
app.get('/accounts', async (req, res) => {
    try {     
      const accounts = await DBConnection.getData('AdAccount');
      return res.send(accounts);
      
    } catch (error) {
        console.error(error);
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

app.get('/download-insights', async (req, res) => {
  try {
    console.log('------- Iniciando o download insights ------');
    console.log('------- Excluindo dados existentes das collecionts Insights ------');
    await DBConnection.clearCollection('Insight-Ads');
    await DBConnection.clearCollection('Insight-AdSet');
    await DBConnection.clearCollection('Insight-Campaign');
    
    downloadInsights('today');
    downloadInsights('yesterday');
    downloadInsights('last_3d');
    downloadInsights('last_7d');
    downloadInsights('last_14d');
    downloadInsights('last_30d');
    downloadInsights('this_month');
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

app.get('/download-account', (req, res) => {
  try {
    console.log('------- Iniciando o download Account ------');
    downloadAccount()
    return res.send('Account download in progress..')
  } catch (error) {
      return res.status(500).send(error);
  }
})

app.get('/download-campaign', async (req, res) => {
  try {
    console.log('------- Iniciando o download Campaign ------');
    downloadCampaigns()
    return res.send('Campaign download in progress..')
  } catch (error) {
      return res.status(500).send(error);
  }
})

app.get('/download-campaignAll', async (req, res) => {
  try {
    console.log('------- Iniciando o download Campaign ------');
    downloadAllCampaigns()
    return res.send('Campaign download in progress..')
  } catch (error) {
      return res.status(500).send(error);
  }
})

app.get('/downloadAllCampaignInsight', async (req, res) => {
  try {
    downloadAllCampaingInsight(req.query.datePreset)
    return res.send(req.query.datePreset);
  } catch (error) {
      console.error(error)
      return res.status(500).send(error);
  }
})

/* ---- Retrive all campaign ----- */
app.get('/allcampaigns', async (req, res) => {

  try {     
    const campaigns = await DBConnection.getData('Campaign_all');
    return res.send(campaigns);
    
  } catch (error) {
      console.error(error);
      res.sendStatus(500);
  }
  })

/* ---- Retrive all campaign ----- */
app.get('/allcampaignsinsights', async (req, res) => {

  try {     
    const campaigns = await DBConnection.getData('Insight-AllCampaign');
    return res.send(campaigns);
    
  } catch (error) {
      console.error(error);
      res.sendStatus(500);
  }
  })

/* ---- Retorna o insight de campanha dos últimos 3 ----- */
app.get('/download3lastmonthinsight', async (req, res) => {
  try {
    download3LastMonthCampaingInsights()
    return res.send("Baixando os 3 últimos meses de insight das campanhas.");
  } catch (error) {
      console.error(error)
      return res.status(500).send(error);
  }
})

/* ---- Retrive all campaign ----- */
app.get('/last2monthinsights', async (req, res) => {

  try {     
    const campaigns = await DBConnection.getData('Insight-3LastMonthCampaing');
    return res.send(campaigns);
    
  } catch (error) {
      console.error(error);
      res.sendStatus(500);
  }
  })


/* ---- Insert Account IDs ---- */
app.post('/insetaccountids', async (req, res) => {
    const retorno = await setAccountIDs(req.body);
    return res.send(retorno);
})

/* ----- Get Account IDs ------ */
app.get('/getaccountids', async (req, res) => {
  const retorno = await getAccountIds();
  return res.send(retorno);
})

app.delete('/deleteuseraccount', async (req, res) => {
  const retorno = await deleteAccountIDs(req.body)
  return res.send(retorno);
})

try {
  DBConnection.createConnection();
  app.listen(port, () => {
    console.log(`Listening port: ${port}`)
  })
} catch (error) {
  
}

