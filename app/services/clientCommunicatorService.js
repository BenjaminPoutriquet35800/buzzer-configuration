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
        performRequestGet(routePingMe, callBackRetrieve);
    }
    /**
     * Récupère la liste des SSID's
     * Que l'ESP peut voir
     */
    this.getSSIDListFromServer = function (callBackRetrieve) {
        performRequestGet(routeSSIDList, callBackRetrieve);
    }
    /**
     * Obtient la configuration qu'a le serveur actuellement
     */
    this.getConfigurationFromServer = function (callBackRetrieve) {
        performRequestGet(routeSettings, callBackRetrieve);
    }
    /**
     * Envoie la nouvelle configuration sur l'ESP8266
     */
    this.sendConfigurationToServer = function () {
        // Construit la route
        //const route = getBaseRoute() + routeSettings;
    }

    /**
     * Se charge de jouer une requête avec le verb GET
     * @param {*} endpoint Le point de terminaison que l'on va contacter
     * @param {*} callBackDone La callBack permettant de récupérer la réponse
     */
    const performRequestGet = function (endpoint, callBackRetrieve) {
        network.get_active_interface(function (err, obj) {
            if (err) {
                callBackRetrieve(err, null, null);
                return;
            }
            // Construit la route
            const route = scheme + obj.gateway_ip + endpoint;
            request.get(route, function (error, response, body) {
                callBackRetrieve(error, response, body);
            });
        })
    }
}