/**
 * Se service en charge de manager la Wifi
 */
function wifiService() {
    const defaultSSID = 'ESP8266-Burger-Quiz';
    const wifi = require('node-wifi');
    // Initialisation obligatoire de l'interface
    wifi.init({ iface: null });
    /**
     * Fonction permettant de récupérer tous les SSID's
     * Correspondant à ceux de la norme mise en place pour
     * Les buzzer's : 'ESP8266-Burger-Quiz'
     */
    this.scanNetworksBGQ = function (callBackNetworks) {
        wifi.scan(function (err, networks) {
             let networksBgq = [];
            // callBackNetworks(null,[
            //     {
            //         ssid: 'Test1',
            //         quality: 80
            //     },
            //     {
            //         ssid : 'Test2',
            //         quality: 50
            //     }
            // ]);
            // return;            

            // Tri des SSID's si il n'y a aucune erreur
            if (err ||  !(networks instanceof Array)) {
                callBackNetworks(err, networksBgq);
                return;
            }
            // Filtrage sur les SSID's
            networks.forEach(element => {
                if(element.ssid.includes(defaultSSID)){
                    networksBgq.push(element);
                }
            });            
            callBackNetworks(err, networks);
        });
    }
}