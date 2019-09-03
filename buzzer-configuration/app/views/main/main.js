/**
 * Inclusions
 */
const electron = require('electron');
const {
    ipcRenderer
} = electron;

/**
 * Constantes
 */
const titleWifiPassword = 'Mot de passe wifi';
const titleCannotConnect = 'Impossible de se connecter :(';
const titleRetrieveBuzzers = 'Récupération des buzzers';
const titleErrorWifiConnection = 'Echec connexion Wifi :(';
const messageErrorNoBuzzerFounded = `Aucun buzzers n'a été trouvé`;

/**
 * Composants
 */
const $ssidCollection = $('#ssid-collection');
const $containerPgbSearchBuzzer = $('#container-progress-bar-search');
const $buttonScan = $('#button-scan');
const $modalConnection = $('#modal-connection');

/**
 * Timer par défaut qui se chargera
 * D'afficher un réseau trouvé toutes les X ms
 */
const defaultTimerDisplayNetwork = 300;

/**
 * Service en charge de la Wifi
 */
var wifiService = new wifiService();
/**
 * Service en charge d'afficher les messages
 */
var sweetAlertService = new sweetAlertService();

/**
 * Service en charge de communiquer avec l'ESP
 */
var clientCommunicatorService = new clientCommunicatorService();

/**
 * Se charge de vider la collection des SSID's de la vue
 */
const cleanupSSIDCollection = function () {
    $ssidCollection.empty();
}

/**
 * Se charge de scanner les SSID's BGQ
 * Disponible sur le réseau
 * @param {*} doneCallBack La callback à lancer
 * Lorsque le scan est terminé
 */
const scanNetworksBGQ = function (doneCallBack) {
    wifiService.scanNetworksBGQ(function (error, networks) {
        if (error) {
            sweetAlertService.showError(titleRetrieveBuzzers, error.message);
            if (typeof doneCallBack === 'function')
                doneCallBack();
            return;
        }
        if (!(networks instanceof Array) || networks.length == 0) {
            sweetAlertService.showError(titleRetrieveBuzzers, messageErrorNoBuzzerFounded);
            if (typeof doneCallBack === 'function')
                doneCallBack();
            return;
        }
        // Si il n'y a qu'un seul buzzer
        // De détecté on s'y connecte directement
        // if (networks.length == 1) {
        //     detectConnectionModeAndConnectToWifi(networks[0]);
        // }
        showNetworksBGQ(networks, doneCallBack);
    });
}

/**
 * Affiche la liste des buzzer's BGQ
 * Que l'on va configurer
 */
const showNetworksBGQ = function (networks, doneCallBack) {
    let time = defaultTimerDisplayNetwork;
    let displayNetworksPromises = networks.map((network) => {
        // Créer une promesse pour chaque element
        return new Promise((resolve) => {
            // Affiche les elements toutes les 500 ms
            setTimeout(function () {
                appendNetworkToSSIDCollection(network);
                resolve();
            }, time);
            time += defaultTimerDisplayNetwork;
        })
    });
    // Attends que toutes les promesses soit résolu
    // Pour masquer la progressbar
    Promise.all(displayNetworksPromises).then(() => {
        if (typeof doneCallBack === 'function')
            doneCallBack();
    });
}

/**
 * Se charge d'ajouter un réseau au container HTML des SSID's
 * @param {*} network Le réseau à ajouter à la vue
 */
const appendNetworkToSSIDCollection = function (network) {
    // Créer le lien hyper texte à afficher
    let hyperLink = createHyperLinkElement(network.ssid, '#', 'collection-item', function () {
        detectConnectionModeAndConnectToWifi(network);
    });
    // Créer un élément indiquant la qualité du réseau
    let spanElement = createSpanElement(null, 'new badge', [{
        property: 'data-badge-caption',
        value: 'Qualité :' + network.quality + '/100'
    }]);
    hyperLink.append(spanElement);
    // On l'ajoute à notre collection
    $ssidCollection.append(hyperLink);
}

/**
 * Se charge de déterminer si un mot de passe
 * Est requis ou pas pour se connecter à la wifi
 * Et si tout est ok on tente de se connecter
 * @param {*} network Le réseau auquel on souhaite accèder
 */
const detectConnectionModeAndConnectToWifi = function (network) {
    let isProtected = wifiService.isProtectedNetwork(network);
    // On vérifie si la connexion est 
    // Protègé par un mot de passe
    // Si c'est le cas on le demande à l'utilisateur
    if (isProtected)
        connectToNetworkWithPasswordWifi(network, redirectWhenConnectedToConfView);
    else
        baseConnectWifi(network, null, redirectWhenConnectedToConfView);
}

/**
 * Se connecter à au point de terminaison avec 
 * Un mot de passe qui sera demandé à l'utilisateur
 * @param {*} network L'entité réseau sur laquelle on 
 * Souhaite se connecter
 */
const connectToNetworkWithPasswordWifi = function (network, callbackConnected) {
    sweetAlertService.showWithRequireField(titleWifiPassword, function (password) {
        baseConnectWifi(network, password, callbackConnected);
    });
}

/**
 * Tente de se connecter à un point de terminaison Wifi
 * @param {*} network L'entité detenant le SSID de l'hôte sur lequel on souhaite se connecter
 * @param {*} password Le password de l'hôte
 * @param {*} callbackConnected Une callback permettant de récupérer l'évènement
 * De connexion établie
 */
const baseConnectWifi = function (network, password, callbackConnected) {
    wifiService.getCurrentConnection(function (err, currentConnection) {
        showComponent($modalConnection);
        // Si aucune erreur on vient tester
        // Si notre connexion actuelle est égal
        // Au réseau auquel on souhaiter se connecter
        // NOTA : Ici l'erreur peut survenir si on est connecté
        // A aucun point wifi par exemple
        if (!err && (currentConnection.ssid === network.ssid)) {
            callbackConnected(network);
            return;
        }
        // On se connecter au point de terminaison souhaité
        wifiService.connect(network.ssid, password, function (error) {
            if (!error) {
                callbackConnected(network);
                return;
            }
            sweetAlertService.showError(titleErrorWifiConnection, error.message);
        });
    });
}

/**
 * Redirige l'utilisateur sur la page
 * De configuration si la connexion est établie
 * @param {*} network Le réseau sur lequel on se connecte
 */
const redirectWhenConnectedToConfView = function (network) {
    clientCommunicatorService.testConnectionWithServer(function (err) {
        hiddenComponent($modalConnection);
        if (!err) {
            ipcRenderer.send('connected:success', network);
            return;
        }
        sweetAlertService.showError(titleCannotConnect, err.message);
    });
}

/**
 * Effectue le scan des réseaux disponible
 */
const performScan = function () {
    cleanupSSIDCollection();
    showComponent($containerPgbSearchBuzzer, true);
    hiddenComponent($buttonScan);
    scanNetworksBGQ(function () {
        hiddenComponent($containerPgbSearchBuzzer, true);
        showComponent($buttonScan);
    });
}

/**
 * Se charge d'initialiser les évènements
 */
const initEvents = function () {
    $buttonScan.click(function () {
        performScan();
    })
}

/**
 * Inits les évents
 */
initEvents();

/**
 * Lance le scan dès le démarrage
 */
performScan();