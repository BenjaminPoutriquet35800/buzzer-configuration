/**
 * Composants
 */
$buttonRegister = $('#button-register');

/**
 * Service en charge de communiquer avec l'ESP
 */
var clientCommunicatorService = new clientCommunicatorService();

/**
 * Se charge d'initialiser les composants select
 * Avec le style de materialize
 */
const initComponantSelector = function () {
    $('select').formSelect();
}

initComponantSelector();

$buttonRegister.click(function () {
    clientCommunicatorService.getSSIDListFromServer(function (err, response, body) {
        console.log(err);
        console.log(response);
        console.log(body);
    });
});