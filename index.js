const { default: axios } = require("axios");
const faceVariables = require('./config/faceVariables');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

/* --- Configurações do axios --- */
axios.defaults.timeout = 60000
axios.defaults.httpAgent = new http.Agent({ keepAlive: true })
axios.defaults.httpsAgent = new https.Agent({ keepAlive: true })

module.exports = {
    
    /* ----- Fornece os insights no nível de anúnicios------- */
    async getAdInsights(clients, data_preset) {
    
        var adsInsights = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log(`Baixando insight dos anúncios (${data_preset}) =>  ${clients[i]}`);
    
            urlClientAds = faceVariables.apiEndpoint + "act_"+ clients[i] +"/insights"
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
                                access_token: faceVariables.token,
                                breakdowns: "image_asset",
                                fields: '["account_id", "account_name", "account_currency", "ad_id", "campaign_id", "campaign_name", "adset_id", "adset_name", "conversions","impressions", "clicks", "cpc", "cpm", "cpp", "ctr", "frequency", "reach", "spend", "website_ctr"]'
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

        temp = JSON.stringify(adsInsights, null, '\t')
        
        try {
            fs.writeFile(path.join(__dirname, "output", data_preset ,"adsinsights" + ".json"), temp, (err, data) => {
                if (err) throw err
                return 1;
              });
        } catch (error) {
            console.error(error.message);
        }
     
        return 0;

    },
    
    /* ----- Fornce informações sobre os anúncios ------- */
    async getAds(clients) {
    
        var ads = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log('Baixando anúncios => ' + clients[i]);
    
            urlClientAds = faceVariables.apiEndpoint + "act_"+ clients[i] +"/ads"
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
                                access_token: faceVariables.token,
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
    
        temp = JSON.stringify(ads, null, '\t')
        
        try {
            fs.writeFile(path.join(__dirname, "output", "ads" + ".json"), temp, (err, data) => {
                if (err) throw err
                return 1;
              });
        } catch (error) {
            console.error(error.message);
        }
     
        return 0;
    },

    /* ----- Fornece os insights no nível de conjunto de anúnicios ------- */
    async getAdSetInsights(clients, data_preset) {
    
        /* GET CLIENTS ID */

        var adSetInsights = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log(`Baixando insights conjunto de anuncios (${data_preset}) => ${clients[i]}`);
    
            urlClientAds = faceVariables.apiEndpoint + "act_"+ clients[i] +"/insights"
            var response = {};
            var nextPage = 0;
    
            do {
                
                if(nextPage != 0){
    
                    adSetInsights = adSetInsights.concat(response.data.data);

                    try {
                        response = await axios.get(nextPage);
                    } catch (error) {
                        console.log(`Baixando insights conjunto de anuncios (${data_preset}) => ${clients[i]}`);
                        break;
                    }
    
                    if(!!response.data.paging.hasOwnProperty('next')){
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
                                access_token: faceVariables.token,
                                fields: '["account_id", "campaign_id", "adset_id", "adset_name", "conversions","impressions", "clicks", "cpc", "cpm", "cpp", "ctr", "frequency", "reach", "spend", "website_ctr"]'
                            }
                        
                        })
                        
                    } catch (error) {
                        console.log(`Baixando insights conjunto de anuncios (${data_preset}) => ${clients[i]}`);
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
        temp = JSON.stringify(adSetInsights, null, '\t')
        
        try {
            fs.writeFile(path.join(__dirname, "output", data_preset,"adsetsinsights" + ".json"), temp, (err, data) => {
                if (err) throw err
                return 1;
              });
        } catch (error) {
            console.error(error.message);
        }
     
        return 0;
     
    },
    
    /* ----- Fornce informações sobre o conjunto de anúncios ------- */
    async getAdSets(clients) {
    
        var adSet = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log('Baixando info conjunto de anúncios => ' + clients[i]);
    
            urlClientAdSet = faceVariables.apiEndpoint + "act_"+ clients[i] +"/adsets"
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
                                access_token: faceVariables.token,
                                fields: '["id", "name", "account_id", "campaign_id", "billing_event", "budget_remaining","configured_status","effective_status", "created_time","destination_type", "optimization_goal"]'
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
    
        temp = JSON.stringify(adSet, null, '\t')
        
        try {
            fs.writeFile(path.join(__dirname, "output", "adsets" + ".json"), temp, (err, data) => {
                if (err) throw err
                return 1;
              });
        } catch (error) {
            console.error(error.message);
        }

        return 0;
    },

    /* ----- Fornece os insights no nível de campanha de anúnicios ------- */
    async getCampaignInsights(clients, data_preset) {
    
        /* GET CLIENTS ID */

        var campaignInsights = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log(`Baixando inights das campanhas (${data_preset}) => ${clients[i]}`);
    
            urlClientAds = faceVariables.apiEndpoint + "act_"+ clients[i] +"/insights"
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
                                access_token: faceVariables.token,
                                fields: '["campaign_id","campaign_name","account_id", "conversions","impressions", "clicks", "cpc", "cpm", "cpp", "ctr", "frequency", "reach", "spend", "website_ctr","social_spend"]'
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
        temp = JSON.stringify(campaignInsights, null, '\t')
        
        try {
            fs.writeFile(path.join(__dirname, "output", data_preset, "campaigninsights" + ".json"), temp, (err, data) => {
                if (err) throw err
                return 1;
              });
        } catch (error) {
            console.error(error.message);
        }

        return 0;
     
    },


    /* ----- Fornce informações sobre o conjunto de anúncios ------- */
    async getCampaings(clients) {
    
        var campaigns = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log('Baixando campanhas => ' + clients[i]);
    
            urlClientCampaigns = faceVariables.apiEndpoint + "act_"+ clients[i] +"/campaigns"
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
                                access_token: faceVariables.token,
                                fields: '["id", "name", "account_id", "budget_remaining", "status","daily_budget","effective_status","start_time"]'
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

        temp = JSON.stringify(campaigns, null, '\t')

        try {
            fs.writeFile(path.join(__dirname, "output", "campaigns" + ".json"), temp, (err, data) => {
                if (err) throw err
                return 1;
              });
        } catch (error) {
            console.error(error.message);
        }

        return 0;
    },

    /* ----- Fornce informações sobre o conjunto de anúncios ------- */
    async getAdAccounts(clients) {
    
        var accounts = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log('Baixando contas de anúncio => ' + clients[i]);
    
            urlClientCampaigns = faceVariables.apiEndpoint + "act_"+ clients[i];
            var response = {};
                
            try {
                response = await axios.get(urlClientCampaigns,{
                    params: {
                        access_token: faceVariables.token,
                        fields: '["id", "account_id", "account_status", "age", "business_name", "business_city", "business_state", "currency", "name", "balance"]'
                    }
                
                })

                accounts = accounts.concat(response.data)

            } catch (error) {
                console.error(`${error.message} - Baixando contas de anúncio => ${clients[i]}`);
                break;
            }
            
        }

        temp = JSON.stringify(accounts, null, '\t')

        try {
            fs.writeFile(path.join(__dirname, "output", "accounts" + ".json"), temp, (err, data) => {
                if (err) throw err
                return 1;
              });
        } catch (error) {
            console.error(error.message);
        }

        return 0;
    },


}

