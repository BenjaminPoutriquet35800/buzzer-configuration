/**
 * Inclusions
 */
const Swal = require('sweetalert2');

const titleRetrieveBuzzers = 'Récupération des buzzers';

/**
 * Composants
 */
const $ssidCollection = $('#ssid-collection');
const $containerPgbSearchBuzzer = $('#container-progress-bar-search');

/**
 * Service en charge de la Wifi
 */
var wifiService = new wifiService();

/**
 * Se charge de cacher la fenêtre de progress bar
 */
const hiddenProgressBarContainer = function () {
    $containerPgbSearchBuzzer.hide("slow");
}

/**
 * Se charge de scanner les SSID's BGQ
 * Disponible sur le réseau
 */
const scanNetworksBGQ = function () {
    wifiService.scanNetworksBGQ(function (error, networks) {
        if (error) {
            Swal.fire(titleRetrieveBuzzers, error.message, 'error');
            return;
        }
        if (!(networks instanceof Array)) {
            Swal.fire(titleRetrieveBuzzers, `Aucun buzzers n'a été trouvé`, 'error');
            return;
        }
        showNetworksBGQ(networks);
    });
}

/**
 * Affiche la liste des buzzer's BGQ
 * Que l'on va configurer
 */
const showNetworksBGQ = function (networks) {
    let time = 500;
    let displayNetworks = networks.map((element) => {
        // Créer une promesse pour chaque element
        return new Promise((resolve) => {
            // Affiche les elements toutes les 500 ms
            setTimeout(function () {
                var hyperLink = createHrefElement(element.ssid, '#', 'collection-item');
                $ssidCollection.append(hyperLink);
                resolve();
            }, time);
            time += 1000;
        })
    });
    // Attends que toutes les promesses soit résolu
    // Pour masquer la progressbar
    Promise.all(displayNetworks).then(() => {
        hiddenProgressBarContainer();
    });
}

// Scan dès le lancement de l'application
scanNetworksBGQ();
