/**
 * Constantes
 */
const titleRetrieveSSID = 'Récupération SSID';
const titleRetrieveConfiguration = 'Récupération configuration';
const titleSendConfiguration = 'Enregistrement configuration';
const messageErrorNoSSID = 'Impossible de récupérer les SSID :(';
const messageErrorNoConfiguration = 'Impossible de récupérer la configuration :(';
const messageModalInfoSSID = 'Récupération des SSID en cours . . .';
const messageModalRegisterConfiguration = 'Enregistrement de la configuration en cours . . .';
const messageModalInfoConfiguration = 'Récupération de la configuration en cours . . .';
const messageConfigurationRegistred = 'Configuration enregistrée';

/**
 * Composants
 */
const $ssidSelector = $('#ssid-selector');
const $teamSelector = $('#team-selector');
const $buttonRegister = $('#button-register');
const $teamContainer = $('#team-container');
const $teamChoosenContainer = $('#team-choosen-container');
const $modalInformation = $('#modal-information');
const $modalConfiguration = $('#modal-configuration');

const $switchInput = $('#switch-input');
const $ssidVisibilityInput = $('#ssid-visibility-input');
const $ssidVisibilitySelector = $('#ssid-visibility-selector');

const $inputSsid = $('#ssid');
const $inputPassword = $('#password');
const $inputServerBgq = $('#server-ip-bgq');
const $imgTeamChoosen = $('#img-team-choosen');

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
const initSelectorWithSSID = function (next) {
    $modalInformation.text(messageModalInfoSSID);
    showComponent($modalConfiguration);
    // Requete l'ESP
    clientCommunicatorService.getSSIDList(function (err, response, body) {
        // Affiche la modal avec le message qui va bien       
        performAction(function () {
            if (err)
                throw new Error(err);
            // Récupère la liste des SSID's grâce au body
            let ssidList = retrieveSSIDListFromBody(body);
            populateSsidSelector(ssidList);
        }, titleRetrieveSSID);
        // Cache la modal dans tous les cas une fois
        // Le traitement terminé
        hiddenComponent($modalConfiguration);
        // Passe à la function suivante
        if (typeof next === 'function' && !err)
            next();
    });
}
/**
 * Initialise le formulaire avec la configuration
 * Obtenue depuis l'ESP8266
 */
const initFormWithConfiguration = function (next) {
    // Affiche la modal avec le message qui va bien
    $modalInformation.text(messageModalInfoConfiguration);
    showComponent($modalConfiguration);
    // Requete l'ESP
    clientCommunicatorService.getConfiguration(function (err, response, body) {
        performAction(function () {
            if (err)
                throw new Error(err);
            // Hydrate le formulaire de conf grâce au body
            populateFormFromBody(body);
        }, titleRetrieveConfiguration);
        // Cache la modal dans tous les cas une fois
        // Le traitement terminé
        hiddenComponent($modalConfiguration);
        // Passe à la function suivante
        if (typeof next === 'function' && !err)
            next();
    });
}

/**
 * Se charge de peupler la liste déroulante
 * Des SSID's obtenue depuis l'ESP8266
 * @param {*} ssidList 
 */
const populateSsidSelector = function (ssidList) {
    // Hydrate le composant avec la liste
    ssidList.map((ssid) => {
        let option = createOptionElement(ssid, ssid);
        $ssidSelector.append(option);
    });
    // On vient manuellement déclencher le rafraichissement
    $ssidSelector.trigger('contentChanged');
}

/**
 * Hydrate le formulaire avec la configuration
 * Récupérer grâce au body passé en paramètre
 * NOTA : Flux json
 * @param {*} body 
 */
const populateFormFromBody = function (body) {
    if (!body)
        throw new Error(messageErrorNoConfiguration);
    // Construit l'objet configuration
    let configuration = JSON.parse(body);
    $inputSsid.val(configuration.ssid);
    $inputPassword.val(configuration.password);
    $inputServerBgq.val(configuration.serverIpBGQ);
    // Rafraichit les labels des inputs
    M.updateTextFields();
    // Récupération du choix du SSID
    onSelectValueInSelectorAndTrig($ssidSelector, configuration.ssid);
    // Si aucun valeur n'est sélectionnée
    // On ajoute à la liste la valeur de la
    // Configuration récupérée depuis l'ESP8266
    if ($ssidSelector.val() === null) {
        let title = configuration.ssid + ' (Depuis Conf)';
        let option = createOptionElement(configuration.ssid, title);
        $ssidSelector.append(option);
        // On relance la sélection
        onSelectValueInSelectorAndTrig($ssidSelector, configuration.ssid);
    }
    // Récupération des choix possible de teams    
    onSelectValueInSelectorAndTrig($teamSelector, configuration.teamChoice);
}

/**
 * Se charge de sélectionner une valeur 
 * Dans le composant selector et de déclancher
 * Les évènements de changements
 * @param {*} $selector Le composant
 * @param {*} value La valeur que l'on va sélectionner
 */
const onSelectValueInSelectorAndTrig = function ($selector, value) {
    if (value === undefined)
        return;
    $selector.val(value);
    $selector.trigger('change');
    $selector.trigger('contentChanged');
}

/**
 * Récupère une liste de SSID's depuis le body passé en paramètre
 * Parse le flux Json
 * @param {*} body Le body permettant
 * De récupérer la liste des SSID's
 */
const retrieveSSIDListFromBody = function (body) {
    if (!body) {
        throw new Error(messageErrorNoSSID);
    }
    // Parse le json pour récupérer la liste des SSID's
    let ssidList = JSON.parse(body).ssids;
    if (!(ssidList instanceof Array)) {
        throw new Error(messageErrorNoSSID);
    }
    return ssidList;
}

/**
 * Se charge de pousser la configuration à l'ESP8266
 */
const sendConfiguration = function () {
    $modalInformation.text(messageModalRegisterConfiguration);
    showComponent($modalConfiguration);
    // Récupère la configuration
    let configuration = retrieveConfigurationFromForm();
    // Pousse la configuration sur l'ESP8266
    clientCommunicatorService.sendConfigurationFromForm(configuration, function (error, response, body) {
        // Dans tous les cas on cache la modal
        hiddenComponent($modalConfiguration);
        if (error) {
            sweetAlertService.showError(titleSendConfiguration, error.message);
            return;
        }
        sweetAlertService.showSuccess(titleSendConfiguration, messageConfigurationRegistred);
    });
}

/**
 * Récupère l'objet configuration depuis le formulaire
 */
const retrieveConfigurationFromForm = function () {
    let ssid = $switchInput.is(':checked') ? $inputSsid.val() : $ssidSelector.val();
    let password = $inputPassword.val();
    let serverIpBGQ = $inputServerBgq.val();
    let teamChoice = $teamSelector.val();
    // Construit l'objet que l'on va pousser
    return {
        ssid: ssid,
        password: password,
        serverIpBGQ: serverIpBGQ,
        teamChoice: teamChoice
    }
}

/**
 * Se charge de réduire la taille du container
 * De choix des équipes pour afficher une image
 * A sa droite par la suite
 */
const reduceSizeTeamContainer = function () {
    let contentClass = $teamContainer.attr('class');
    // On modifie l'affichage du container
    // En le réduisant pour laisser la place
    // A l'image de l'équipe sélectionné
    if (!contentClass.includes('col s12'))
        return;
    $teamContainer.removeClass('col s12');
    $teamContainer.addClass('col s11');
}

/**
 * Se charge de switcher entre 
 * Le composant selector ou l'input 
 * Pour saisir un SSID suivant si
 * On clic sur le bouton switch input
 */
const switchVisibilityComponantsSsid = function () {
    let isChecked = $switchInput.is(':checked');
    if (isChecked) {
        hiddenComponent($ssidVisibilitySelector, true);
        showComponent($ssidVisibilityInput, true);
    } else {
        hiddenComponent($ssidVisibilityInput, true);
        showComponent($ssidVisibilitySelector, true);
    }
}

/**
 * Se charge de récupérer :
 * - Les SSID's depuis l'ESP    
 * - La configuration depuis l'ESP
 * Et d'hydrater la vue avec ces informations
 */
const initWithSSIDAndConfigurationView = function () {
    // Récupère la liste des SSID's que l'ESP peut voir
    // Puis récupère la configuration de l'ESP
    initSelectorWithSSID(initFormWithConfiguration);
}

/**
 * Se charge d'éxécuter une fonction sécurisée par un block try / catch
 * @param {*} callBackToExecute La fonction que l'on va éxécuter
 * @param {*} titleError Le titre de l'erreur
 */
const performAction = function (callBackToExecute, titleError) {
    try {
        callBackToExecute();
    } catch (error) {
        sweetAlertService.showError(titleError, error.message);
    }
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
        reduceSizeTeamContainer();
        $imgTeamChoosen.attr('src', locationPicture);
        showComponent($teamChoosenContainer);
    });
    $switchInput.click(function () {
        switchVisibilityComponantsSsid();
    });
    $switchInput.change(function () {
        switchVisibilityComponantsSsid();
    });
    $buttonRegister.click(function () {
        sendConfiguration();
    })
}

initComponantsSelector();

initWithSSIDAndConfigurationView();

// Les évènements sont init's volontairement
// Après l'initialisation de la vue
initEvents();