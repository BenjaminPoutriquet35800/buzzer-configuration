const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu } = electron;

let mainWindow = null;

app.on('ready', function () {
    // Création de la fenêtre principale
    mainWindow = createWindowsWithFileView('/app/views/main/main.html');
    initEventsMainWindows();
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
const createWindowsWithFileView = function (viewPathFile, windowProperties) {
    windowToCreate = new BrowserWindow(windowProperties);
    windowToCreate.loadURL(url.format({
        pathname: path.join(__dirname, viewPathFile),
        protocol: 'file:',
        slashes: true
    }));
    return windowToCreate;
}

/**
 * Initialise les évènements de la vue principale
 */
const initEventsMainWindows = function () {
    mainWindow.on('close', function () {
        app.quit();
    })
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

/**
 * Construit le sous menu de développement
 */
const buildDevMenuItems = function () {
    // Construit le sous menu de développement
    const subMenuDevTools = [
        {
            label: "Debug",
            accelerator: 'F12',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        },
        {
            label: "Reload",
            accelerator: 'F5',
            role: 'reload'
        }
    ];
    return subMenuDevTools;
}

/**
 * Rend la template du menu principal
 */
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
    if (process.env.NODE_ENV === 'production')
        return template;

    // Obtient le menu de développement
    const subMenuDevTools = buildDevMenuItems();

    template.push({
        label: 'Dev Tools',
        submenu: subMenuDevTools
    });
    return template;
}