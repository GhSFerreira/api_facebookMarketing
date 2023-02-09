const { default: axios } = require("axios");
const faceVariables = require('./config/faceVariables');

module.exports = {
    
    /* ----- Fornece os insights no nível de anúnicios------- */
    async getAdInsights(clients) {
    
        var adsInsights = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log('Baixando cliente => ' + clients[i]);
    
            urlClientAds = faceVariables.apiEndpoint + "act_"+ clients[i] +"/insights"
            var response = {};
            var nextPage = 0;
    
            do {
                
                if(nextPage != 0){
    
                    adsInsights = adsInsights.concat(response.data.data);
                    //console.log(response.data.data);
                    response = await axios.get(nextPage);
    
                    if(!!response.data.paging.next){
                        nextPage = response.data.paging.next;
    
                    }else{
                        nextPage = 0;
                    }
    
    
                }else if (nextPage == 0 && Object.keys(response).length != 0) {
                    adsInsights = adsInsights.concat(response.data.data);
                    break;
                }else{
    
                    response = await axios.get(urlClientAds,{
                        params: {
                            level: "ad",
                            date_preset: "maximum",
                            access_token: faceVariables.token,
                            breakdowns: "image_asset",
                            fields: '["account_id", "account_name", "account_currency", "ad_id", "campaign_id", "campaign_name", "adset_id", "adset_name", "conversions","impressions", "clicks", "cpc", "cpm", "cpp", "ctr", "frequency", "reach", "spend", "website_ctr"]'
                        }
                    
                    })
                    
                    if(!!response.data.paging.next){
                        nextPage = response.data.paging.next;
                    }
    
                }
            } while (true);
    
        }
    
        return adsInsights
     
    },
    
    /* ----- Fornce informações sobre os anúncios ------- */
    async getAds(clients) {
    
        var ads = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log('Baixando info anúncios => ' + clients[i]);
    
            urlClientAds = faceVariables.apiEndpoint + "act_"+ clients[i] +"/ads"
            var response = {};
            var nextPage = 0;
    
            do {
                
                if(nextPage != 0){

                    console.log("teste 1");
                    ads = ads.concat(response.data.data);
                    response = await axios.get(nextPage);
    
                    if(!!response.data.paging.next){
                        nextPage = response.data.paging.next;
    
                    }else{
                        nextPage = 0;
                    }
    
    
                }else if (nextPage == 0 && Object.keys(response).length != 0) {
                    console.log("teste 2");
                    ads = ads.concat(response.data.data);
                    break;
                }else{
    
                    console.log("teste");

                    response = await axios.get(urlClientAds,{
                        params: {
                            access_token: faceVariables.token,
                            fields: '["id", "name", "account_id", "adset_id", "campaign_id", "status", "effective_status"]'
                        }
                    
                    })

                    if(!!response.data.paging.next){
                        nextPage = response.data.paging.next;
                    }
    
                }

            } while (true);
    
        }
    
        return ads;
    },

    /* ----- Fornece os insights no nível de conjunto de anúnicios ------- */
    async getAdSetInsights(clients) {
    
        /* GET CLIENTS ID */

        var adsInsights = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log(`Download AdSet insights from client ${clients[i]}`);
    
            urlClientAds = faceVariables.apiEndpoint + "act_"+ clients[i] +"/insights"
            var response = {};
            var nextPage = 0;
    
            do {
                
                if(nextPage != 0){
    
                    adsInsights = adsInsights.concat(response.data.data);
                    //console.log(response.data.data);
                    response = await axios.get(nextPage);
    
                    if(!!response.data.paging.next){
                        nextPage = response.data.paging.next;
    
                    }else{
                        nextPage = 0;
                    }
    
    
                }else if (nextPage == 0 && Object.keys(response).length != 0) {
                    adsInsights = adsInsights.concat(response.data.data);
                    break;
                }else{
    
                    response = await axios.get(urlClientAds,{
                        params: {
                            level: "adset",
                            date_preset: "maximum",
                            access_token: faceVariables.token,
                            fields: '["account_id", "campaign_id", "adset_id", "adset_name", "conversions","impressions", "clicks", "cpc", "cpm", "cpp", "ctr", "frequency", "reach", "spend", "website_ctr"]'
                        }
                    
                    })
                    
                    if(!!response.data.paging.next){
                        nextPage = response.data.paging.next;
                    }
    
                }
            } while (true);
    
        }
    
        return adsInsights
     
    },
    
    /* ----- Fornce informações sobre o conjunto de anúncios ------- */
    async getAdSets(clients) {
    
        var ads = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log('Baixando info conjunto de anúncios => ' + clients[i]);
    
            urlClientAdSet = faceVariables.apiEndpoint + "act_"+ clients[i] +"/adsets"
            var response = {};
            var nextPage = 0;
    
            do {
                
                if(nextPage != 0){
    
                    ads = ads.concat(response.data.data);
                    response = await axios.get(nextPage);
    
                    if(!!response.data.paging.next){
                        nextPage = response.data.paging.next;
    
                    }else{
                        nextPage = 0;
                    }
    
    
                }else if (nextPage == 0 && Object.keys(response).length != 0) {
                    ads = ads.concat(response.data.data);
                    break;
                }else{
    
                    response = await axios.get(urlClientAdSet,{
                        params: {
                            access_token: faceVariables.token,
                            fields: '["id", "name", "account_id", "campaign_id", "billing_event", "budget_remaining","configured_status","effective_status", "created_time","destination_type", "optimization_goal"]'
                        }
                    
                    })
                    
                    if(!!response.data.paging.next){
                        nextPage = response.data.paging.next;
                    }
    
                }
            } while (true);
    
        }
    
        return ads;
    },

    /* ----- Fornece os insights no nível de campanha de anúnicios ------- */
    async getCampaignInsights(clients) {
    
        /* GET CLIENTS ID */

        var adsInsights = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log(`Download Campaign insights from client ${clients[i]}`);
    
            urlClientAds = faceVariables.apiEndpoint + "act_"+ clients[i] +"/insights"
            var response = {};
            var nextPage = 0;
    
            do {
                
                if(nextPage != 0){
    
                    adsInsights = adsInsights.concat(response.data.data);
                    //console.log(response.data.data);
                    response = await axios.get(nextPage);
    
                    if(!!response.data.paging.next){
                        nextPage = response.data.paging.next;
    
                    }else{
                        nextPage = 0;
                    }
    
    
                }else if (nextPage == 0 && Object.keys(response).length != 0) {
                    adsInsights = adsInsights.concat(response.data.data);
                    break;
                }else{
    
                    response = await axios.get(urlClientAds,{
                        params: {
                            level: "campaign",
                            date_preset: "maximum",
                            access_token: faceVariables.token,
                            fields: '["campaign_id","campaign_name","account_id", "conversions","impressions", "clicks", "cpc", "cpm", "cpp", "ctr", "frequency", "reach", "spend", "website_ctr","social_spend"]'
                        }
                    
                    })
                    
                    if(!!response.data.paging.next){
                        nextPage = response.data.paging.next;
                    }
    
                }
            } while (true);
    
        }
    
        return adsInsights
     
    },


    /* ----- Fornce informações sobre o conjunto de anúncios ------- */
    async getCampaings(clients) {
    
        var ads = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log('Baixando info conjunto de anúncios => ' + clients[i]);
    
            urlClientCampaigns = faceVariables.apiEndpoint + "act_"+ clients[i] +"/campaigns"
            var response = {};
            var nextPage = 0;
    
            do {
                
                if(nextPage != 0){
    
                    ads = ads.concat(response.data.data);
                    response = await axios.get(nextPage);
    
                    if(!!response.data.paging.next){
                        nextPage = response.data.paging.next;
    
                    }else{
                        nextPage = 0;
                    }
    
    
                }else if (nextPage == 0 && Object.keys(response).length != 0) {
                    ads = ads.concat(response.data.data);
                    break;
                }else{
    
                    response = await axios.get(urlClientCampaigns,{
                        params: {
                            access_token: faceVariables.token,
                            fields: '["id", "name", "account_id", "budget_remaining", "status","daily_budget","effective_status","start_time"]'
                        }
                    
                    })
                    
                    if(!!response.data.paging.next){
                        nextPage = response.data.paging.next;
                    }
    
                }
            } while (true);
    
        }
    
        return ads;
    },

    /* ----- Fornce informações sobre o conjunto de anúncios ------- */
    async getAdAccounts(clients) {
    
        var ads = [];
        for (let i = 0; i < clients.length; i++) {
            
            console.log('Baixando info conta de anúncio => ' + clients[i]);
    
            urlClientCampaigns = faceVariables.apiEndpoint + "act_"+ clients[i];
            var response = {};
            var nextPage = 0;
    
            do {
                
                if(nextPage != 0){
    
                    ads = ads.concat(response.data.data);
                    response = await axios.get(nextPage);
    
                    if(!!response.data.paging.next){
                        nextPage = response.data.paging.next;
    
                    }else{
                        nextPage = 0;
                    }
    
    
                }else if (nextPage == 0 && Object.keys(response).length != 0) {
                    ads = ads.concat(response.data.data);
                    break;
                }else{
    
                    response = await axios.get(urlClientCampaigns,{
                        params: {
                            access_token: faceVariables.token,
                            fields: '["id", "account_id", "account_status", "age", "business_name", "business_city", "business_state", "currency", "name", "balance"]'
                        }
                    
                    })
                    
                    if(!!response.data.paging.next){
                        nextPage = response.data.paging.next;
                    }
    
                }
            } while (true);
    
        }
    
        return ads;
    },


}

