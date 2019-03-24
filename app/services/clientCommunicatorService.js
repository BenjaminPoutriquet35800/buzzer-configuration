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
    var gatewayIp = null;

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
    this.sendConfigurationFromForm = function (configuration, callBackRetrieve) {
        console.log('Envoie la configuration');
        // Construit une requête de type formulaire
        let buildFormRequest = {
            form: configuration
        };
        console.log(buildFormRequest);
        // Envoie la requête
        performRequestPost(buildFormRequest, routeSettings, callBackRetrieve);
        return this;
    }

    /**
     * Se charge de jouer une requête avec le verb GET
     * @param {*} endpoint Le point de terminaison que l'on va contacter
     * @param {*} callBackRetrieve La callBack permettant de récupérer la réponse
     */
    const performRequestGet = function (endpoint, callBackRetrieve) {
        basePerformRequest(request.get, null, endpoint, callBackRetrieve);
    }

    /**
     * Se charge de jouer une requête avec le verb POST
     * @param {*} endpoint Le point de terminaison que l'on va contacter
     * @param {*} callBackRetrieve La callBack permettant de récupérer la réponse
     */
    const performRequestPost = function (options, endpoint, callBackRetrieve) {
        basePerformRequest(request.post, options, endpoint, callBackRetrieve);
    }

    /**
     * Se charge de jouer une requête grâce à la
     * Callback passé en paramètre avec le verbs qui va bien
     * @param {*} callBackSendRequest La callback permettant de lancer la requête
     * @param {*} endpoint Le point de terminaison que l'on va contacter
     * @param {*} callBackRetrieve La callBack permettant de récupérer la réponse
     */
    const basePerformRequest = function (callBackSendRequest, options, endpoint, callBackRetrieve) {
        // Fonction permettant de jouer la requete par la suite
        let sendRequest = function () {
            const route = scheme + gatewayIp + endpoint;
            console.log('Requete sur : ' + route)
            callBackSendRequest(route, options, function (error, response, body) {
                callBackRetrieve(error, response, body);
            });
        }
        // Si l'ip de la gateway n'est pas défini
        // On vient la récupérer (Opération coûteuse en temps)
        if (!gatewayIp) {
            console.log(`Obtention de l'ip de la gateway en cours`);
            network.get_active_interface(function (err, obj) {
                if (err) {
                    console.log(`Récupération de l'ip de la gateway KO`);
                    callBackRetrieve(err, null, null);
                    return;
                }
                console.log(`Récupération de l'ip de la gateway OK`);
                gatewayIp = obj.gateway_ip;
                // Une fois récupérée on lance la requête
                sendRequest();
            })
        } else {
            sendRequest();
        }
    }
}