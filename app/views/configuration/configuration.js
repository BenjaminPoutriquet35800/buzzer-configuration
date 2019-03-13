/**
 * Composants
 */
$ssidSelector = $('#ssid-selector');
$buttonRegister = $('#button-register');

/**
 * Service en charge de communiquer avec l'ESP
 */
var clientCommunicatorService = new clientCommunicatorService();

/**
 * Se charge d'initialiser les composants select
 * Avec le style de materialize
 */
const initComponantsSelector = function () {
    $('select').formSelect();

    // $ssidSelector.on('contentChanged', function() {
    //     $(this).material_select();
    //   });
}

const initSelectorWithSSID = function () {
    clientCommunicatorService.getSSIDListFromServer(function (err, response, body) {
        let option = createOptionElement('test','test');
        $ssidSelector.append(option);
        $ssidSelector.trigger('contentChanged');
        console.log(err);
        console.log(response);
        console.log(body);
    });
}

initComponantsSelector();

initSelectorWithSSID();