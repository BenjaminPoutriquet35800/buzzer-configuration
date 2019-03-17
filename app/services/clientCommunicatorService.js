/**
 * Sevice en charge de communiquer avec l'ESP8266
 */
function clientCommunicatorService() {
    var request = require('request');
    var network = require('network');

    const routeSSIDList = '/ssid';
    const routePingMe = '/ping-me';
    const routeSettings = '/settings';

    const scheme = 'http://';

    /**
     * Test la connexion à l'ESP pour 
     * Voir si c'est sur le bon device sur 
     * Lequel on tent de se connecter
     */
    this.testConnectionWithServer = function (callBackRetrieve) {
        console.log('Lancement du test');
        performRequestGet(routePingMe, callBackRetrieve);
        return this;
    }
    /**
     * Récupère la liste des SSID's
     * Que l'ESP peut voir
     */
    this.getSSIDList = function (callBackRetrieve) {
        console.log('Récupération des SSID');
        performRequestGet(routeSSIDList, callBackRetrieve);
        return this;
    }
    /**
     * Obtient la configuration qu'a le serveur actuellement
     */
    this.getConfiguration = function (callBackRetrieve) {
        console.log('Récupération de la configuration');
        performRequestGet(routeSettings, callBackRetrieve);
        return this;
    }
    /**
     * Envoie la nouvelle configuration sur l'ESP8266
     */
    this.sendConfiguration = function () {
        // Construit la route
        //const route = getBaseRoute() + routeSettings;
        return this;
    }

    /**
     * Se charge de jouer une requête avec le verb GET
     * @param {*} endpoint Le point de terminaison que l'on va contacter
     * @param {*} callBackDone La callBack permettant de récupérer la réponse
     */
    const performRequestGet = function (endpoint, callBackRetrieve) {
        console.log(`Obtention de l'ip de la gateway en cours`);
        network.get_active_interface(function (err, obj) {
            if (err) {
                console.log(`Récupération de l'ip de la gateway KO`);
                callBackRetrieve(err, null, null);
                return;
            }
            console.log(`Récupération de l'ip de la gateway OK`);
            // Construit la route
            const route = scheme + obj.gateway_ip + endpoint;
            console.log('Requete sur : ' + route)
            request.get(route, function (error, response, body) {
                callBackRetrieve(error, response, body);
            });
        })
    }
}