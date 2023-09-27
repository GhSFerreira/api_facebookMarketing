const cron = require('node-cron');
const DBConnection = require('./config/databaseConnection');
const {downloadAdset, downloadAds, downloadInsights, downloadCampaigns, downloadAllCampaigns, downloadAccount, downloadAllCampaingInsight} = require('./index');

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
    downloadInsights('this_month');
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