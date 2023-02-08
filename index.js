const { default: axios } = require("axios");
const faceVariables = require('./config/faceVariables');
const fs = require('fs');
const path = require('path');

const express = require('express');


/* ----- COLETAR AS INFORMAÇÕES POR NÍVEL DE AD ------- */


async function getAdInsights(clients) {

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
 
}

/* ----- COLETAR AS INFORMAÇÕES POR NÍVEL DE AD ------- */
async function getAds(clients) {

    var ads = [];
    for (let i = 0; i < clients.length; i++) {
        
        console.log('Baixando anúncios => ' + clients[i]);

        urlClientAds = faceVariables.apiEndpoint + "act_"+ clients[i] +"/ads"
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
}

module.exports = {
    getAdInsights, getAds
}