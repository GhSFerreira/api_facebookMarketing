const { default: axios } = require("axios");
const env = require('dotenv').config();
const https = require('https');
const http = require('http');
const DBConnection = require('./config/databaseConnection');

/* --- Configurações do axios --- */
axios.defaults.timeout = 60 * 2 * 1000 // 2 minutes in ms
axios.defaults.httpAgent = new http.Agent({ keepAlive: true })
axios.defaults.httpsAgent = new https.Agent({ keepAlive: true })

module.exports = {
    
    /* ----- Fornece os insights no nível de anúnicios------- */
    async getAdInsights(clients, data_preset) {

        var adsInsights = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log(`Baixando insight dos anúncios (${data_preset}) =>  ${clients[i]}`);
    
            urlClientAds = process.env.FACEBOOK_API_ENDPOINT + "act_"+ clients[i] +"/insights"
            var response = {};
            var nextPage = 0;
    
            do {
                
                if(nextPage != 0){
    
                    adsInsights = adsInsights.concat(response.data.data);
                    try {
                        response = await axios.get(nextPage);
                    } catch (error) {
                        console.error(`${error.message} - Baixando insight dos anúncios (${data_preset}) =>  ${clients[i]}`);
                        break;
                    }
    
                    if(response.data.paging.hasOwnProperty('next')){
                        nextPage = response.data.paging.next;
    
                    }else{
                        nextPage = 0;
                    }
    
    
                }else if (nextPage == 0 && Object.keys(response).length != 0) {
                    adsInsights = adsInsights.concat(response.data.data);
                    break;
                }else{
                    
                    try {
                        response = await axios.get(urlClientAds,{
                            params: {
                                level: "ad",
                                date_preset: data_preset,
                                access_token: process.env.FACEBOOK_TOKEN,
                                filtering: '[{field:"ad.impressions",operator:"GREATER_THAN",value:0}]',
                                fields: '["account_id", "ad_id","impressions", "clicks", "cpc", "cost_per_unique_inline_link_click", "cpm", "cpp", "ctr", "frequency", "reach", "spend", "actions"]'
                            }
                        
                        });
                        
                    } catch (error) {
                        console.error(`${error.message} - Baixando insight dos anúncios (${data_preset}) =>  ${clients[i]}`);
                        break;
                    }
                    
                    if(response.data.hasOwnProperty('paging')){
                        if (response.data.paging.hasOwnProperty('next'))
                            nextPage = response.data.paging.next;
                    }
    
                }
            } while (true);
    
        }
        
        adsInsights.forEach(ads => ads.date_preset = data_preset);

        try {
            const data_inserted_db = await DBConnection.insertData('Insight-Ads', adsInsights);
            console.log(`**** AdsInsights info added to Insight-Ads! ${data_inserted_db.insertedCount} inserted ****`);
         } catch (error) {
             console.error(error.message);
         }
     
    },
    
    /* ----- Fornce informações sobre os anúncios ------- */
    async getAds(clients) {
    
        await DBConnection.clearCollection('Ads');

        var ads = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log('Baixando anúncios => ' + clients[i]);
    
            urlClientAds = process.env.FACEBOOK_API_ENDPOINT + "act_"+ clients[i] +"/ads"
            var response = {};
            var nextPage = 0;
    
            do {
                
                if(nextPage != 0){

                    ads = ads.concat(response.data.data);
                    try {
                        response = await axios.get(nextPage);
                    } catch (error) {
                        console.error(error.message + `Baixando anúncios =>  ${clients[i]}`);
                        break;
                    }
    
                    if(response.data.paging.hasOwnProperty('next')){
                        nextPage = response.data.paging.next;
    
                    }else{
                        nextPage = 0;
                    }
    
    
                }else if (nextPage == 0 && Object.keys(response).length != 0) {
                    ads = ads.concat(response.data.data);
                    break;
                }else{
    
                    try {
                        response = await axios.get(urlClientAds,{
                            params: {
                                access_token: process.env.FACEBOOK_TOKEN,
                                effective_status: '["ACTIVE"]',
                                fields: '["id", "name", "account_id", "adset_id", "campaign_id", "status", "effective_status"]'
                            }                    
                        })
                    } catch (error) {
                        console.error(error.message + `Baixando anúncios =>  ${clients[i]}`);
                        break;
                    }

                    if(response.data.hasOwnProperty('paging')){
                        if (response.data.paging.hasOwnProperty('next'))
                            nextPage = response.data.paging.next;
                    }
                }

            } while (true);
    
        }
         
        try {
            const data_inserted_db = await DBConnection.insertData('Ads', ads);
            console.log(`**** Ads info added to Ads! ${data_inserted_db.insertedCount} inserted ****`);
         } catch (error) {
             console.error(error.message);
         }
    },

    /* ----- Fornece os insights no nível de conjunto de anúnicios ------- */
    async getAdSetInsights(clients, data_preset) {

        var adSetInsights = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log(`Baixando insights conjunto de anuncios (${data_preset}) => ${clients[i]}`);
    
            urlClientAds = process.env.FACEBOOK_API_ENDPOINT + "act_"+ clients[i] +"/insights"
            var response = {};
            var nextPage = 0;
    
            do {
                
                if(nextPage != 0){
    
                    adSetInsights = adSetInsights.concat(response.data.data);

                    try {
                        response = await axios.get(nextPage);
                    } catch (error) {
                        console.log(`${error} - Baixando insights conjunto de anuncios (${data_preset}) => ${clients[i]}`);
                        break;
                    }
    
                    if(response.data.paging.hasOwnProperty('next')){
                        nextPage = response.data.paging.next;
    
                    }else{
                        nextPage = 0;
                    }
    
    
                }else if (nextPage == 0 && Object.keys(response).length != 0) {
                    adSetInsights = adSetInsights.concat(response.data.data);
                    break;
                }else{
                    try {
                        response = await axios.get(urlClientAds,{
                            params: {
                                level: "adset",
                                date_preset: data_preset,
                                access_token: process.env.FACEBOOK_TOKEN,
                                filtering: '[{field:"adset.effective_status","operator":"IN","value":["ACTIVE"]}]',
                                fields: '["account_id", "campaign_id", "adset_id", "adset_name","impressions", "clicks", "cpc", "cost_per_unique_inline_link_click", "cpm", "cpp", "ctr", "frequency", "reach", "spend", "actions"]'
                            }
                        
                        })
                        
                    } catch (error) {
                        console.log(`${error} - Baixando insights conjunto de anuncios (${data_preset}) => ${clients[i]}`);
                        break;
                    }
                    
                    if(response.data.hasOwnProperty('paging')){
                        if (response.data.paging.hasOwnProperty('next'))
                            nextPage = response.data.paging.next;
                    }
    
                }
            } while (true);
    
        }
    
        adSetInsights.forEach(adset => adset.date_preset = data_preset);

        try {
            const data_inserted_db = await DBConnection.insertData('Insight-AdSet', adSetInsights);
            console.log(`**** Adsetsinsights info added to Insight-AdSet! ${data_inserted_db.insertedCount} inserted ****`);
         } catch (error) {
             console.error(error.message);
         }
     
    },
    
    /* ----- Fornce informações sobre o conjunto de anúncios ------- */
    async getAdSets(clients) {
        await DBConnection.clearCollection('AdSet');

        var adSet = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log('Baixando info conjunto de anúncios => ' + clients[i]);
    
            urlClientAdSet = process.env.FACEBOOK_API_ENDPOINT + "act_"+ clients[i] +"/adsets"
            var response = {};
            var nextPage = 0;
    
            do {
                
                if(nextPage != 0){
    
                    adSet = adSet.concat(response.data.data);
                    try {
                        response = await axios.get(nextPage);
                    } catch (error) {
                        console.error(`${error.message} - Baixando info conjunto de anúncios => ${clients[i]}`);
                        break;
                    }
    
                    if(response.data.paging.hasOwnProperty('next')){
                        nextPage = response.data.paging.next;
    
                    }else{
                        nextPage = 0;
                    }
    
    
                }else if (nextPage == 0 && Object.keys(response).length != 0) {
                    adSet = adSet.concat(response.data.data);
                    break;
                }else{
                    try {
                        response = await axios.get(urlClientAdSet,{
                            params: {
                                access_token: process.env.FACEBOOK_TOKEN,
                                effective_status: '["ACTIVE"]',
                                fields: '["id", "name", "account_id", "campaign_id", "billing_event", "budget_remaining","effective_status","destination_type", "optimization_goal"]'
                            }
                        
                        })
                        
                    } catch (error) {
                        console.error(`${error.message} - Baixando info conjunto de anúncios => ${clients[i]}`);
                        break;
                    }
                    
                    if(response.data.hasOwnProperty('paging')){
                        if (response.data.paging.hasOwnProperty('next'))
                            nextPage = response.data.paging.next;
                    }
    
                }
            } while (true);
    
        }
    
        try {
            const data_inserted_db = await DBConnection.insertData('AdSet', adSet);
            console.log(`**** AdSet info added to AdSet! ${data_inserted_db.insertedCount} inserted ****`);
         } catch (error) {
             console.error(error.message);
         }
    },

    /* ----- Fornece os insights no nível de campanha de anúnicios ------- */
    async getCampaignInsights(clients, data_preset) {

        var campaignInsights = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log(`Baixando inights das campanhas (${data_preset}) => ${clients[i]}`);
    
            urlClientAds = process.env.FACEBOOK_API_ENDPOINT + "act_"+ clients[i] +"/insights"
            var response = {};
            var nextPage = 0;
    
            do {
                
                if(nextPage != 0){
    
                    campaignInsights = campaignInsights.concat(response.data.data);
                    try {
                        response = await axios.get(nextPage);
                    } catch (error) {
                        console.error(`${error.message} - Baixando inights das campanhas (${data_preset}) => ${clients[i]}`);
                        break;
                    }
    
                    if(response.data.paging.hasOwnProperty('next')){
                        nextPage = response.data.paging.next;
    
                    }else{
                        nextPage = 0;
                    }
    
    
                }else if (nextPage == 0 && Object.keys(response).length != 0) {
                    campaignInsights = campaignInsights.concat(response.data.data);
                    break;
                }else{
    
                    try {
                        response = await axios.get(urlClientAds,{
                            params: {
                                level: "campaign",
                                date_preset: data_preset,
                                access_token: process.env.FACEBOOK_TOKEN,
                                filtering: '[{field:"campaign.effective_status","operator":"IN","value":["ACTIVE"]}]',
                                fields: '["campaign_id","account_id","impressions", "clicks", "cpc", "cost_per_unique_inline_link_click", "cpm", "cpp", "ctr", "frequency", "reach", "spend", "actions"]'
                            }
                        
                        })
                    } catch (error) {
                        console.error(`${error.message} - Baixando inights das campanhas (${data_preset}) => ${clients[i]}`);
                        break;
                    }

                    if(response.data.hasOwnProperty('paging')){
                        if (response.data.paging.hasOwnProperty('next'))
                            nextPage = response.data.paging.next;
                    }
    
                }
            } while (true);
    
        }
        campaignInsights.forEach( campaign =>  campaign.date_preset = data_preset);
        
        try {
            const data_inserted_db = await DBConnection.insertData('Insight-Campaign', campaignInsights);
            console.log(`**** CampaignInsights info added to Insight-Campaign! ${data_inserted_db.insertedCount} inserted ****`);
         } catch (error) {
             console.error(error.message);
         }
     
    },

    /* ----- Fornce informações sobre as campanhas ------- */
    async getCampaings(clients) {
        await DBConnection.clearCollection('Campaign');

        var campaigns = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log('Baixando campanhas => ' + clients[i]);
    
            urlClientCampaigns = process.env.FACEBOOK_API_ENDPOINT + "act_"+ clients[i] +"/campaigns"
            var response = {};
            var nextPage = 0;
    
            do {
                
                if(nextPage != 0){
    
                    campaigns = campaigns.concat(response.data.data);
                    try {
                        response = await axios.get(nextPage);
                    } catch (error) {
                        console.error(`${error.message} - Baixando campanhas => ${clients[i]}`);
                        break;
                    }
    
                    if(response.data.paging.hasOwnProperty('next')){
                        nextPage = response.data.paging.next;
    
                    }else{
                        nextPage = 0;
                    }
    
    
                }else if (nextPage == 0 && Object.keys(response).length != 0) {
                    campaigns = campaigns.concat(response.data.data);
                    break;
                }else{
    
                    try {
                        response = await axios.get(urlClientCampaigns,{
                            params: {
                                access_token: process.env.FACEBOOK_TOKEN,
                                effective_status: '["ACTIVE"]', 
                                fields: '["id", "name", "account_id", "budget_remaining", "status","daily_budget","effective_status","start_time","stop_time","objective"]'
                            }
                        
                        })
                    } catch (error) {
                        console.error(`${error.message} - Baixando campanhas => ${clients[i]}`);
                        break;
                    }
                    
                    if(response.data.hasOwnProperty('paging')){
                        if (response.data.paging.hasOwnProperty('next'))
                            nextPage = response.data.paging.next;
                    }
    
                }
            } while (true);
    
        }

        try {
            const data_inserted_db = await DBConnection.insertData('Campaign', campaigns);
            console.log(`**** Campaings info added to Campaign! ${data_inserted_db.insertedCount} inserted ****`);
         } catch (error) {
             console.error(error.message);
         }

    },

    /* ----- Fornce informações sobre o conjunto de anúncios ------- */
    async getAdAccounts(clients) {
    
        await DBConnection.clearCollection('AdAccount');

        var accounts = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log('Baixando contas de anúncio => ' + clients[i]);
    
            urlClientCampaigns = process.env.FACEBOOK_API_ENDPOINT + "act_"+ clients[i];
            var response = {};
                
            try {
                response = await axios.get(urlClientCampaigns,{
                    params: {
                        access_token: process.env.FACEBOOK_TOKEN,
                        fields: '["id", "account_id", "account_status", "age", "business_name", "business_city", "business_state", "currency", "name", "balance"]'
                    }
                
                })

                accounts = accounts.concat(response.data)

            } catch (error) {
                console.error(`${error.message} - Baixando contas de anúncio => ${clients[i]}`);
            }
            
        }

        try {
           const data_inserted_db = await DBConnection.insertData('AdAccount', accounts);
           console.log(`**** Account info added to AdAccount! ${data_inserted_db.insertedCount} inserted ****`);
        } catch (error) {
            console.error(error.message);
        }
    },
}

