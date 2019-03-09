/**
 * Inclusions
 */
const Swal = require('sweetalert2');

const titleRetrieveBuzzers = 'Récupération des buzzers';
const titleErrorWifiConnection = 'Echec connexion Wifi :(';

/**
 * Composants
 */
const $ssidCollection = $('#ssid-collection');
const $containerPgbSearchBuzzer = $('#container-progress-bar-search');
const $buttonScan = $('#button-scan');

/**
 * Timer par défaut qui se chargera
 * D'afficher un réseau trouvé toutes les X ms
 */
const defaultTimerDisplayNetwork = 0;

/**
 * Les network's BGQ que l'on va stocker
 * Cette liste va nous permettre par la suite
 * De filtrer ceux qui ne sont plus présent
 * Lors d'un prochain scan
 */
var networksBGQ = [];

/**
 * Service en charge de la Wifi
 */
var wifiService = new wifiService();

/**
 * Se charge d'afficher un composant si ce n'est pas déjà le cas
 * @param {*} $component Le composant à afficher
 * @param {*} withEffect Indique si l'on veut jouer un effet
 */
const showComponent = function ($component, withEffect) {
    if (!$component.is(':hidden'))
        return;
    if (withEffect)
        $component.show("slow");
    else
        $component.show();
}

/**
 * Se charge de cacher un composant si ce n'est pas déjà le cas
 * @param {*} $component Le composant à cacher
 * @param {*} withEffect Indique si l'on veut jouer un effet
 */
const hiddenComponent = function ($component, withEffect) {
    if ($component.is(':hidden'))
        return;
    if (withEffect)
        $component.hide("slow");
    else
        $component.hide();
}

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
            Swal.fire(titleRetrieveBuzzers, error.message, 'error');
            if (typeof doneCallBack === 'function')
                doneCallBack();
            return;
        }
        if (!(networks instanceof Array)) {
            Swal.fire(titleRetrieveBuzzers, `Aucun buzzers n'a été trouvé`, 'error');
            if (typeof doneCallBack === 'function')
                doneCallBack();
            return;
        }
        // Si il y'a plus d'un réseau présent
        // On affiche la liste à l'utilisateur
        if (networks.length > 1) {
            showNetworksBGQ(networks, doneCallBack);
            return
        }
        // Sinon on se connecte directement
        detectConnectionModeAndConnectToWifi(networks[0]);
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
        connectToNetworkWithPasswordWifi(network, performWhenConnected);
    else
        baseConnectWifi(network.ssid, null, performWhenConnected);
}

/**
 * Se connecter à au point de terminaison avec 
 * Un mot de passe qui sera demandé à l'utilisateur
 * @param {*} network L'entité réseau sur laquelle on 
 * Souhaite se connecter
 */
const connectToNetworkWithPasswordWifi = function (network, callbackConnected) {
    Swal.fire({
        title: 'Mot de passe wifi',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        cancelButtonText: 'Annuler',
        confirmButtonText: 'Valider',
        showLoaderOnConfirm: true,
        preConfirm: (password) => {
            baseConnectWifi(network.ssid, password, callbackConnected);
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

/**
 * Tente de se connecter à un point de terminaison Wifi
 * @param {*} ssid Le SSID de l'hôte sur lequel on souhaite se connecter
 * @param {*} password Le password de l'hôte
 * @param {*} callbackConnected Une callback permettant de récupère l'évènement
 * De connexion établie
 */
const baseConnectWifi = function (ssid, password, callbackConnected) {
    wifiService.connect(ssid, password, function (err) {
        if (!err) {
            callbackConnected();
            return;
        }
        Swal.fire(titleErrorWifiConnection, err.message, 'error');
    });
}

/**
 * Action à executer 
 */
const performWhenConnected = function () {
    console.log('Vous êtes connecté');
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