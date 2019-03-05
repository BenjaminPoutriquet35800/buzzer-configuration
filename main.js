const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu } = electron;

let mainWindow = null;

app.on('ready', function () {
    // Création de la fenêtre principale
    createWindowsWithFileView(mainWindow, '/app/views/main/main.html');
    const mainMenuTemplate = renderMainMenuTemplate();
    // Création du menu
    buildMenuFromTemplate(mainMenuTemplate);
});

/**
 * Se charge de créer une fenêtre
 * @param {*} windowToCreate L'objet fenêtre que l'on va instancier
 * @param {*} viewPathFile Le chemin vers la vue associé
 * @param {*} windowProperties Les propriétés de le fenêtre
 */
const createWindowsWithFileView = function (windowToCreate, viewPathFile, windowProperties) {
    windowToCreate = new BrowserWindow(windowProperties);
    windowToCreate.loadURL(url.format({
        pathname: path.join(__dirname, viewPathFile),
        protocol: 'file:',
        slashes: true
    }));
}

/**
 * Construit le menu de l'application grâce
 * A la template passé en paramètre
 * @param {*} template La template du menu à créer
 */
const buildMenuFromTemplate = function (template) {
    const mainMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(mainMenu);
}

const renderMainMenuTemplate = function () {
    const template = [];
    // Si on est sur Mac on ajoute un menu vide
    // Pour ne pas a avoir un espace supplémentaire
    // Lors du rendu
    if (process.platform == 'darwin') {
        // Ajoute au début de la collection une prop vide
        template.unshift({});
    }
    // Affiche l'onglet pour debug en environnement de dev
    if (process.env.NODE_ENV !== 'production') {
        template.push({
            label: 'Dev Tools (F12)',
            accelerator: 'F12',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        });
    }

    return template;
}