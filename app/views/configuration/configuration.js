/**
 * Constantes
 */
const titleRetrieveSSID = 'Récupération SSID';
const messageErrorNoSSID = 'Impossible de récupérer les SSID :(';

/**
 * Composants
 */
$ssidSelector = $('#ssid-selector');
$teamSelector = $('#team-selector');
$buttonRegister = $('#button-register');
$teamContainer = $('#team-container');
$teamChoosenContainer = $('#team-choosen-container');
$imgTeamChoosen = $('#img-team-chossen');

/**
 * Service en charge de communiquer avec l'ESP
 */
var clientCommunicatorService = new clientCommunicatorService();
/**
 * Service en charge d'afficher les messages
 */
var sweetAlertService = new sweetAlertService();

/**
 * Initialise le composant Selector
 * Avec la liste des SSID's récupérées 
 * Depuis l'ESP8266
 */
const initSelectorWithSSID = function () {
    clientCommunicatorService.getSSIDListFromServer(function (err, response, body) {
        try {
            if (err)
                throw new Error(err);
            // Récupère la liste des SSID's grâce à la réponse
            let ssidList = retrieveSSIDListFromResponse(response);
            // Hydrate le composant avec la liste
            ssidList.map((ssid) => {
                let option = createOptionElement(ssid, ssid);
                $ssidSelector.append(option);
            });
            // On vient manuellement déclencher le rafraichissement
            $ssidSelector.trigger('contentChanged');
        } catch (error) {
            sweetAlertService.showError(titleRetrieveSSID, error.message);
        }
    });
}

/**
 * Récupère une liste de SSID's depuis la réponse
 * Passé en paramètre
 * @param {*} response La réponse permettant
 * De récupérer la liste des SSID's
 */
const retrieveSSIDListFromResponse = function (response) {
    if (!response) {
        throw new Error(messageErrorNoSSID);
    }
    // Parse le json pour récupérer la liste des SSID's
    let ssidList = JSON.parse(response).ssids;
    if (!(ssidList instanceof Array)) {
        throw new Error(messageErrorNoSSID);
    }
    return ssidList;
}

/**
 * Se charge d'initialiser les composants select
 * Avec le style de materialize
 */
const initComponantsSelector = function () {
    $('select').formSelect();
    // S'abonne au changement de contenu
    // Dès que le contenu est modifier 
    // On recharge le composant
    $('select').on('contentChanged', function () {
        $(this).formSelect();
    });
}

/**
 * Initialisation des évènements
 */
const initEvents = function () {
    $teamSelector.change(function () {
        // Récupère le chemin de l'image grâce à l'élément sélectionné
        let locationPicture = $('option:selected', this).attr('data-icon');
        let contentClass = $teamContainer.attr('class');
        // On modifie l'affichage du container
        // En le réduisant pour laisser la place
        // A l'image de l'équipe sélectionné
        if (contentClass.includes('col s12')) {
            $teamContainer.removeClass('col s12');
            $teamContainer.addClass('col s11');
        }
        $imgTeamChoosen.attr('src', locationPicture);
        showComponent($teamChoosenContainer);
    });
}

initComponantsSelector();

initSelectorWithSSID();

initEvents();