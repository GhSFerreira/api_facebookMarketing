const cron = require('node-cron');
const DBConnection = require('./config/databaseConnection');

const {getAdInsights, getAds, getAdSets, getAdSetInsights, getCampaings, getCampaignInsights, getAdAccounts, getAllCampaings, getAllCampaignInsights} = require('./index');

clients = ['432937722154651', '950862468692256', '771188793477733', '342694184711341',
        '508333163201145', '5896443210425077', '1216712922169881', '797940654238729',
        '265900379183080', '1503825143752978', '270650331445899', '400516895251196', 
        '1067360354209953', '149476945118446', '9197231796984174', '293215916533863', 
        '3257630361162338', '1667796376993751', '1191729871530204']

async function getAccountIds() {
    const ids = await DBConnection.getData("Accounts-Ids");
}

/* 
------- As funções abaixo foram separadas da seguinte forma para que não haja perca dos dados.
        Limite de chamadas da API do facebook ---------
*/

    /**
     * 
     * @param {String} data_preset Could be one of this: 'today', 'yesterday', 'last_3d', 'last_7d', 'last_14d', 'last_30d' or 'maximum'
     */
    async function downloadInsights(data_preset) {
        await getCampaignInsights(clients, data_preset)
        await getAdSetInsights(clients, data_preset)
        await getAdInsights(clients, data_preset)
    }

    async function downloadAccount() {
        await getAdAccounts(clients)
    }
    async function downloadCampaigns() {
        await getCampaings(clients)
    }
    async function downloadAllCampaigns() {
        await getAllCampaings(clients)
    }
    async function downloadAdset() {
         await getAdSets(clients)
    }
    async function downloadAds() {
         await getAds(clients)
    }
    async function downloadAllCampaingInsight(data_preset) {
        console.log('------- Iniciando o download All Campaign Insights ------');
        console.log('------- Excluindo dados existentes das collecionts Insight-AllCampaign ------');
        await DBConnection.clearCollection('Insight-AllCampaign');
        await getAllCampaignInsights(clients, data_preset);
   }

   /* Baixar o insight de todas as campanhas no date_preset = last_month */
   cron.schedule("0 0 4 1 * *", async () => {
        downloadAllCampaingInsight("last_month")
   })

   /* Baixar os insight das campanhas, conjuntos e anúncios ativos nos períodos de hoje, ontem, últimos 3, 7, 14 e 30 dias  */
    cron.schedule("0 0 8-20 * * *", async () => {
        console.log('\n**** Executando o agendamento - Insights *****');
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
        downloadInsights('last_90d');
    });

    /* Baixar todas as campanhas */
    cron.schedule("0 30 7-20/4 * * *", () => {
        console.log('\n**** Executando o agendamento - Campanhas *****');
        downloadAllCampaigns();
    });

    /* Baixar os conjuntos de anúncio ativos*/
    cron.schedule("0 10 7-20/2 * * *", () => {
        console.log('\n**** Executando o agendamento - Adset *****');
        downloadAdset();
    });

    /* Baixar os anúncio ativos*/
    cron.schedule("0 20 7-20/2 * * *", () => {
        console.log('\n**** Executando o agendamento - Ads *****');
        downloadAds();
    });

    /* Baixar informações das contas de anúncio*/
    cron.schedule("0 45 5,15 * * *", () => {
        console.log('\n**** Executando o agendamento - Account *****');
        downloadAccount();
    });

    module.exports = {
        downloadAllCampaingInsight, downloadAdset, downloadAds, downloadAccount, downloadCampaigns, downloadInsights, downloadAllCampaigns
    }