/**
 * Se service en charge de manager la Wifi
 */
function wifiService() {
    const wifi = require('node-wifi');
    // Initialisation obligatoire de l'interface
    wifi.init({
        iface: null
    });
    // Valeur permettant d'attendre x ms
    // Le temps que la connexion Wifi s'initialise correctement
    const defaultSleepInitConnection = 1000;
    const defaultSSID = 'Esp8266-Burger-Quiz';
    // Protocols de sécuritée wifi
    const securityProtocols = [
        "AES",
        "WEP",
        "WPA"
    ];
    /**
     * Fonction permettant de récupérer tous les SSID's
     * Correspondant à ceux de la norme mise en place pour
     * Les buzzer's : 'ESP8266-Burger-Quiz'
     */
    this.scanNetworksBGQ = function (callBackNetworks) {
        wifi.scan(function (err, networks) {
            let networksBGQ = [];
            // Tri des SSID's si il n'y a aucune erreur
            if (err || !(networks instanceof Array)) {
                callBackNetworks(err, networksBGQ);
                return;
            }
            // Retire les réseaux qui n'ont pas de SSID's
            // Puis on les tris par ordre de qualité du + fort
            // Au plus léger
            networks = networks.filter(element => {
                return element.ssid.trim() !== '';
            }).sort((a, b) => {
                return b.quality - a.quality;
            })
            // Filtrage sur les SSID's
            networks.forEach(element => {
                if (element.ssid.toLowerCase().includes(defaultSSID.toLowerCase())) {
                    networksBGQ.push(element);
                }
            });
            callBackNetworks(err, networksBGQ);
        });
    }
    /**
     * Se connecte au point de terminaison souhaité
     */
    this.connect = function (ssid, password, callBackConnected) {
        // Formate les crédentials comme attendu dans la méthode
        let credentials = {
            ssid: ssid,
            password: password
        };
        // Se connecte
        return wifi.connect(credentials, function (err) {
            setTimeout(function () {
                callBackConnected(err);
            }, defaultSleepInitConnection);
        })
    }
    /**
     * Obtient le point wifi sur lequel on connecté actuellement
     */
    this.getCurrentConnection = function (callBackCurrentConnection) {
        wifi.getCurrentConnections(function (err, currentConnections) {
            if (err || !(currentConnections instanceof Array) || currentConnections.length <= 0) {
                callBackCurrentConnection(err, null);
                return;
            }
            callBackCurrentConnection(err, currentConnections[0]);
        });
    }

    /**
     * Se charge de vérifier si le réseau est 
     * Protégé par un mot de passe
     */
    this.isProtectedNetwork = function (network) {
        // On vérifie si un protocol match avec 
        // Le protocol du réseau passé en paramètre
        let result = securityProtocols.find((protocol) => {
            return network.security.toLowerCase().includes(protocol.toLowerCase());
        });
        return result !== undefined;
    }
}