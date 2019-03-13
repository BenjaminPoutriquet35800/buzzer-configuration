/**
 * Service en charge de créer des alertes
 * A afficher à la vue
 */
function sweetAlertService() {
    const Swal = require('sweetalert2');
    const appRoot = require('app-root-path');

    // Le chemin de base pour les backgrounds
    const baseDirBackground = '/app/views/public/images/backgrounds/';
    const defaultImageHeight = 80;
    /**
     * Se charge d'afficher une fenêtre demandant 
     * A l'utilisateur de saisir un champ
     */
    this.showWithRequireField = function (title, callBackRetrieveField) {
        Swal.fire({
            title: title,
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            imageHeight: defaultImageHeight,
            imageUrl: appRoot + baseDirBackground + 'wifi-burger.png',
            imageAlt: `Icone wifi`,
            showCancelButton: true,
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Valider',
            showLoaderOnConfirm: true,
            preConfirm: (value) => {
                callBackRetrieveField(value);
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    /**
     * Affiche un message type pour une erreur
     */
    this.showError = function (title, message) {
        Swal.fire({
            title: title,
            text: message,
            imageHeight: defaultImageHeight,
            imageUrl: appRoot + baseDirBackground + 'oups.png',
            imageAlt: `Une erreur s'est produite`
        })
    }
}