const cron = require('node-cron');
const DBConnection = require('./config/databaseConnection');

const {getAdInsights, getAds, getAdSets, getAdSetInsights, getCampaings, getCampaignInsights, getAdAccounts} = require('./index');

/* clients = ['5379057635480936', '1224883661342179', '695922761665977',
        '777481793418802', '681552533401703', '3257630361162338', '4175309355897018',
        '185103568247084', '271414754852131', '295572612624483', '875572066232392', 
        '4151784184913199', '4087472977951779', '149476945118446',
        '642693930878840', '1067360354209953', '1200292197157048',
        '400516895251196', '1743636892663201', '270650331445899',
        '137517231763500', '836010440997598', '1028788557696707',
        '856300081658960', '1216712922169881', '481853580110608', '1695700470581076',
        '342694184711341', '174477231018854', '965051157423153', '1213358582729786',
        '950862468692256', '3018739935085616', '1288644968294464', '432937722154651',
        '2300449873536260'] */

clients = ['747460330286551', '3257630361162338', '271414754852131', '295572612624483',
        '900350094610715', '510032821313994', '4151784184913199', '4087472977951779',
        '735778754742051', '149476945118446', '1067360354209953', '400516895251196', 
        '270650331445899', '1216712922169881', '508333163201145', '342694184711341', 
        '950862468692256', '3018739935085616', '2300449873536260', '2993758917588561', 
        '297801212309477']

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

    async function downloadAdset() {
         await getAdSets(clients)
    }
    async function downloadAds() {
         await getAds(clients)
    }

    cron.schedule("0 51 17 * * *", async () => {
        console.log('\n**** Executando o agendamento - Insights *****');
        console.log('\n**** Executando o agendamento - Campaign *****');
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

    cron.schedule("0 39 17 * * *", () => {
        downloadCampaigns();
    });

    cron.schedule("0 46 17 * * *", () => {
        console.log('\n**** Executando o agendamento - Adset *****');
        downloadAdset();
    });

    cron.schedule("0 0 17 * * *", () => {
        console.log('\n**** Executando o agendamento - Ads *****');
        downloadAds();
    });

    cron.schedule("0 0 17 * * *", () => {
        console.log('\n**** Executando o agendamento - Account *****');
        downloadAccount();
    });

    module.exports = {
        downloadAdset, downloadAds, downloadAccount, downloadCampaigns, downloadInsights
    }