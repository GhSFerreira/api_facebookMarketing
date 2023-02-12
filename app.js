const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;


/* ---- Root url - Welcome ---- */
app.get('/', (req, res) => {

    console.log(req.body);
    res.json({msg: "ok"});
  
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

    try {
      fs.readFile(path.join(__dirname, "output", "adsinsights" + ".json"),'utf8', (err, data) => {
        if (err) throw err
        res.json(JSON.parse(data));
      });

    } catch (error) {
        res.sendStatus(500);
    }
  })

/* ---- Retrive all clients adSets ----- */
app.get('/adsets', async (req, res) => {
   
    try {
      fs.readFile(path.join(__dirname, "output", "adsets" + ".json"),'utf8', (err, data) => {
        if (err) throw err
        res.json(JSON.parse(data));
      });

    } catch (error) {
        res.sendStatus(500);
    }
  })

/* --- Retrive the adSet insights */
app.get('/adsetsinsights', async (req, res) => {

    try {
      fs.readFile(path.join(__dirname, "output", "adsetsinsights" + ".json"),'utf8', (err, data) => {
        if (err) throw err
        res.json(JSON.parse(data));
      });

    } catch (error) {
        res.sendStatus(500);
    }
  })

/* ---- Retrive all clients ads ----- */
app.get('/campaigns', async (req, res) => {

    try {
      fs.readFile(path.join(__dirname, "output", "campaigns" + ".json"),'utf8', (err, data) => {
        if (err) throw err
        res.json(JSON.parse(data));
      });

    } catch (error) {
        res.sendStatus(500);
    }

  })

/* --- Retrive the ads insights */
app.get('/campaigninsights', async (req, res) => {
    
    try {
      fs.readFile(path.join(__dirname, "output", "campaigninsights" + ".json"),'utf8', (err, data) => {
        if (err) throw err
        res.json(JSON.parse(data));
      });

    } catch (error) {
        res.sendStatus(500);
    }

  })

/* ---- Retrive all clients ads ----- */
app.get('/accounts', async (req, res) => {
    
    try {     
      fs.readFile(path.join(__dirname, "output", "accounts" + ".json"),'utf8', (err, data) => {
        if (err) throw err
        res.json(JSON.parse(data));
      });

    } catch (error) {
        res.sendStatus(500);
    }
  })


app.listen(port, () => {
  console.log(`Listening port: ${port}`)
})

