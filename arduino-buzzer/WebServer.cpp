#include "WebServer.h"

/**
   Configuration du serveur sur le port 80
*/
ESP8266WebServer server (80);

int statusCode;
char* response;

/**
   Ctor
*/
WebServer::WebServer() { }

/**
   Démarre le serveur Web
*/
void WebServer::startServer() {
  Serial.println("Construction des routes");
  buildApiRoutes();
  Serial.println("Le serveur démarre");
  server.begin();
}

/**
   Permet de détecter lorsque le client
   Intérargie avec le serveur
*/
void WebServer::onHandleClient() {
  server.handleClient();
}

/**
   Se charge de construire les routes
*/
void WebServer::buildApiRoutes() {
  buildRouteSettings();
  buildRouteGetSSID();
  buildRoutePingMe();
}

/**
  Se charge de créer la route pour :
  - Lire la congiguration EEPROM
  - Enregistrer la configuration EEPROM
*/
void WebServer::buildRouteSettings() {
  server.on(ROUTE_SETTINGS, HTTP_GET, [&] () {
    response = retrieveSettingsAndBuildJson();
    server.send(statusCode, "application/json", response);
  });
  server.on(ROUTE_SETTINGS, HTTP_POST, [&] () {
    persistSettings();
    server.send(statusCode, CONTENT_TYPE_JSON, response);
  });
}

/**
   Se charge de créer la route pour
   Lister les SSID's disponible
*/
void WebServer::buildRouteGetSSID() {
  server.on(ROUTE_GET_SSID, HTTP_GET, [&] () {
    response = retrieveSSIDAndBuildJson();
    server.send(statusCode, CONTENT_TYPE_JSON, response);
  });
}

/**
   Se charge de créer la route
   Permettant au client de ping l'ESP8266
   Et de voir ci ce dernier répond
*/
void WebServer::buildRoutePingMe() {
  server.on(ROUTE_PING_ME, HTTP_GET, [&] () {
    response = "{\"connected\":\"success\"}";
    server.send(statusCode, CONTENT_TYPE_JSON, response);
  });
}

/**
   Se charge de récupérer les SSID's
   Que l'ESP8266 peut voir et les renvoie
   Au format Json
*/
char* WebServer::retrieveSSIDAndBuildJson() {
  size_t sizeList = _serviceWifi.scanNetworks();
  char* ssidList[sizeList];
  _serviceWifi.getSSIDList(ssidList, sizeList);

  String buildResponse;
  buildResponse = "{";

  buildResponse += "\"";
  buildResponse += PROPERTY_SSID_JSON;
  buildResponse += "\":";

  buildResponse += "[";

  for (int i = 0; i < sizeList; ++i) {
    buildResponse += "\"";
    buildResponse += ssidList[i];
    buildResponse += "\"";
    // Ajoute la virgule
    if (i != sizeList - 1) {
      buildResponse += ",";
    }
  }

  buildResponse += "]";
  buildResponse += "}";

  statusCode = 200;

  return Utils::strToChar(buildResponse);
}

/**
   Récupère la configuration depuis l'EEPROM
*/
char* WebServer::retrieveSettingsAndBuildJson() {
  char* ssid = _serviceEEPROM.readSsidFromEEPROM();
  char* pass = _serviceEEPROM.readWifiPasswordFromEEPROM();
  char* host = _serviceEEPROM.readServerBurgerQuizFromEEPROM();
  char* team = _serviceEEPROM.readTeamChoiceFromEEPROM();

  String buildResponse;
  buildResponse = "{";

  buildResponse += "\"";
  buildResponse += QUERY_ARG_SSID;
  buildResponse += "\":";
  buildResponse += "\"";
  buildResponse += ssid;
  buildResponse += "\",";

  buildResponse += "\"";
  buildResponse += QUERY_ARG_PASS;
  buildResponse += "\":";
  buildResponse += "\"";
  buildResponse += pass;
  buildResponse += "\",";

  buildResponse += "\"";
  buildResponse += QUERY_ARG_TEAM;
  buildResponse += "\":";
  buildResponse += "\"";
  buildResponse += team;
  buildResponse += "\",";

  buildResponse += "\"";
  buildResponse += QUERY_ARG_SERVER_BGQ;
  buildResponse += "\":";
  buildResponse += "\"";
  buildResponse += host;
  buildResponse += "\"";

  buildResponse += "}";

  statusCode = 200;

  return Utils::strToChar(buildResponse);
}

/**
   Se charge de persister les paramètres dans l'EEPROM
*/
void WebServer::persistSettings() {
  String querySsid = server.arg(QUERY_ARG_SSID);
  String queryPass = server.arg(QUERY_ARG_PASS);
  String queryTeam = server.arg(QUERY_ARG_TEAM);
  String queryServerBgq = server.arg(QUERY_ARG_SERVER_BGQ);
  Serial.println(server.arg("plain"));
  // Test les params
  if (querySsid.length() < 0 && queryPass.length() < 0 &&
      queryTeam.length() < 0 && queryServerBgq.length() < 0) {
    statusCode = 400;
    response = "{\"error\":\"Ecriture EEPROM KO merci de renseigner tous les champs \"}";
    return;
  }
  _serviceEEPROM.cleanupEEPROM();
  _serviceEEPROM.writeOnEEPROMSsid(querySsid);
  _serviceEEPROM.writeOnEEPROMPasswordWifi(queryPass);
  _serviceEEPROM.writeOnEEPROMTeamChoice(queryTeam);
  _serviceEEPROM.writeOnEEPROMServerAddressBurgerQuiz(queryServerBgq);
  _serviceEEPROM.commit();
  statusCode = 204;
  response = "{\"success\":\"Ecriture EEPROM OK \"}";
}
