/**
 * Se service en charge de manager la Wifi
 */
function wifiService() {
    const defaultSSID = 'ESP8266-Burger-Quiz';
    // Protocols de sécuritée wifi
    const securityProtocols = [
        "AES",
        "WPE",
        "WPA"
    ];
    const wifi = require('node-wifi');
    // Initialisation obligatoire de l'interface
    wifi.init({
        iface: null
    });
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
            // Filtrage sur les SSID's
            networks.forEach(element => {
                if (element.ssid.includes(defaultSSID)) {
                    networksBGQ.push(element);
                }
            });
            callBackNetworks(err, networks);
        });
    }

    /**
     * Se connecte au point de terminaison souhaité
     */
    this.connect = function (ssid, password, callBackConnected) {
        // Formate les crédentials comme attendu dans la méthode
        var credentials = {
            ssid: ssid,
            password: password
        };        
        // Se connecter
        return wifi.connect(credentials, function (err) {
            callBackConnected(err);
        })
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