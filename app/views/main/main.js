const Swal = require('sweetalert2')

/**
 * Se charge d'initialiser les compteurs de caractères
 * Du formulaire de configuration
 */
const initCharacterCounterInputs = function () {
    $('input#input_text, textarea#textarea2').characterCounter();
}

initCharacterCounterInputs();

var test = new wifiService();

test.scanNetworksBGQ(function (error, networks) {
    if (error) {
        Swal.fire('Récupération des buzzers', error.message, 'error');
        return;
    }
    
});


