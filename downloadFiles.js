
const {getAdInsights, getAds, getAdSets, getAdSetInsights, getCampaings, getCampaignInsights, getAdAccounts} = require('./index');

//clients = ['149476945118446']

clients = ['5379057635480936', '741302997038971', '1224883661342179', '695922761665977',
        '777481793418802', '681552533401703', '3257630361162338', '4175309355897018',
        '185103568247084', '271414754852131', '295572612624483', '875572066232392', 
        '4151784184913199', '4087472977951779', '149476945118446',
        '642693930878840', '3372647489682653', '1067360354209953', '1200292197157048',
        '400516895251196', '1743636892663201', '270650331445899',
        '137517231763500', '836010440997598', '223514632323817', '1028788557696707',
        '856300081658960', '1216712922169881', '481853580110608', '1695700470581076',
        '342694184711341', '174477231018854', '965051157423153', '1213358582729786',
        '950862468692256', '3018739935085616', '1288644968294464', '432937722154651',
        '2300449873536260', '2989375761361362']


/* 
------- As funções abaixo foram separadas da seguinte forma para que não haja perca dos dados.
        Limite de chamadas da API do facebook ---------
*/

    /**
     * 
     * @param {Array} clients It's the Facebook ad's account of the clients
     * @param {String} data_preset Could be one of this: 'today', 'yesterday', 'last_3d', 'last_7d', 'last_14d', 'last_30d' or 'maximum'
     */
    async function downloadFacebookData(clients, data_preset) {
        await getCampaignInsights(clients, data_preset)
        await getAdSetInsights(clients, data_preset)
        await getAdInsights(clients, data_preset)
    }

    async function downloadFacebookDataWithDataPreset(clients) {
        //await getAdAccounts(clients)
        //await getCampaings(clients)
        //await getAdSets(clients)
        await getAds(clients)
    }

    /* 
    * ---- Make the calls to download facebook data -----
    */

    downloadFacebookDataWithDataPreset(clients)
/*     downloadFacebookData(clients, 'today');
    downloadFacebookData(clients, 'yesterday');
    downloadFacebookData(clients, 'last_3d');
    downloadFacebookData(clients, 'last_7d');
    downloadFacebookData(clients, 'last_14d');
    downloadFacebookData(clients, 'last_30d');
    downloadFacebookData(clients, 'last_90d'); */