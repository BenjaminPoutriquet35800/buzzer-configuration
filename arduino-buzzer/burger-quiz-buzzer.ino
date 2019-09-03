#include <Arduino.h>
#include <SocketIoClient.h>

#include "Constants.h"
#include "EEPROMService.h"
#include "WifiService.h"
#include "WebServer.h"

WebServer webServer;
EEPROMService serviceEEPROM;
WifiService serviceWifi;

// Configuration Wifi stocké dans l'EEPROM
// Qui sera setté via l'ESP8266
char* ssid = "";
char* passwordWifi = "";

//Configuration serveur NodeJs
// NOTA : L'hote est stocké dans l'EEPROM
char* host = "";

// Messages à envoyer au serveur NodeJs
// NOTA : payloadOnBuzz est stocké dans l'EEPROM
char* payloadOnBuzz = "";

// Permet de lire l'état courant du bouton
int buttonState = 0;

// Permet de savoir si on est connecté
bool isConnectedToWifi = false;

/**
   Socket permettant d'emettre le buzz
*/
SocketIoClient webSocket;

/**
   Initialisation
*/
void setup() {
  Serial.println("Début du setup");
  setupDebugger();
  setupButtonPinMode();
  setupEEPROM();
  setupConfigFromEEPROM();  
  setupApOrSocket();
  Serial.println("Fin setup OK");
}

/**
   Boucle principale
*/
void loop() {  
  readButtonStateAndBuzzWhenPressed();
  webServer.onHandleClient();
}

/**
   Se charge d'initialiser le debugger pour
   Afficher la sortie dans le moniteur
*/
void setupDebugger() {
  Serial.begin(115200);
  // Indique que l'on souhaite recevoir les messages de debug
  Serial.setDebugOutput(true);
  // Flush la sortie
  for (uint8_t t = 4; t > 0; t--) {
    Serial.printf("[SETUP] BOOT WAIT %d...\n", t);
    Serial.flush();
    delay(1000);
  }
}

/**
   Initialise la connexion avec le serveur burger quiz
*/
void setupSocket() {
  Serial.println("Init socket en cours");
  if (strcmp(host, "") == 0)
    return;
  webSocket.begin(host, DEFAULT_SERVER_PORT);
  Serial.println("Socket init OK");
}

/**
   Declare le boutonn du buzzer sur une pinPad
*/
void setupButtonPinMode() {
  pinMode(BUTTON_PIN_BUZZER, INPUT);
}

/**
   Initialisation de l'EEPROM
*/
void setupEEPROM() {
  serviceEEPROM.initSizeEEPROM(512);
}

/**
   Se charge d'initialiser la connexion wifi
*/
bool setupWifi() {
  return serviceWifi.connectToWifi(ssid, passwordWifi);
}

/**
   Se charge de récupérer le :
   - SSID
   - Mot de passe wifi
   - Le choix de l'équipe pour le buzzer
   - L'ip du serveur burger quiz
   Ecrit sur l'EEPROM
*/
void setupConfigFromEEPROM() {
  ssid = serviceEEPROM.readSsidFromEEPROM();
  passwordWifi = serviceEEPROM.readWifiPasswordFromEEPROM();
  host = serviceEEPROM.readServerBurgerQuizFromEEPROM();
  payloadOnBuzz = serviceEEPROM.buildPayloadOnBuzz();
}

/**
   Se charge d'initialiser le serveur de conf
   Si échec de la connexion Wifi
   Dans le cas contraire on init la socket pour se co
   Au serveur burger quiz
*/
void setupApOrSocket() {  
  // Mettre le setup wifi avant le setup AP
  // Voir le lien  : https://goo.gl/c2DfC1
  isConnectedToWifi = setupWifi();  
  // Si on est pas connecté à la wifi
  // On n'init pas la socket
  Serial.print("Connexion wifi : ");
  Serial.println(isConnectedToWifi);  
  setupApAndWebServer();
  if (!isConnectedToWifi)
    return;
  setupSocket();
}

/**
   Lance le point d'accès wifi
   Et le serveur web permettant d'intérargir
   Avec l'ESP8266
*/
void setupApAndWebServer() {
  char strToGenerate[SSID_LENGTH_RANDOM_STRING];
  // Génére la chaine aléatoire
  Utils::generateRandStr(strToGenerate, SSID_LENGTH_RANDOM_STRING);
  // En effet si au moins deux ESP sont montés avec le même SSID
  // Seul le réseau le plus fort en signal sera visible
  char* ssidGenerated = strcat(DEFAULT_SSID, HYPHEN);
  ssidGenerated = strcat(ssidGenerated, strToGenerate);
  serviceWifi.setupAp(DEFAULT_SSID, DEFAULT_PASSWORD, DEFAULT_CHANNEL);
  Serial.println("Setup Ap OK");
  Serial.println("Montage du server web en cours");
  webServer.startServer();
  Serial.println("Montage du server web OK");
}

/**
   Se charge de lire l'état du bouton
   Et d'envoyer la requête de buzz au serveur distant
*/
void readButtonStateAndBuzzWhenPressed() {
  if (!isConnectedToWifi)
    return;
  // Lecture de l'état du bouton
  buttonState = digitalRead(BUTTON_PIN_BUZZER);
  //Serial.println(buttonState);
  if (buttonState != 0) {
    // Envoie le buzz lorsque le bouton est pressé
    webSocket.emit(MESSAGE_ON_BUZZ, payloadOnBuzz);
    delay(100);
  }
  webSocket.loop();
}
