#include "WifiService.h"

ESP8266WiFiMulti WiFiMulti;

WifiService::WifiService() {}

/**
   Se charge de tester la connexion Wifi
*/
bool WifiService::isConnectedToWifi() {
  int c = 0;
  Serial.println("En attente d'une connexion Wi-Fi à l'ESP8266");
  while ( c < 20 ) {
    if (WiFiMulti.run() == WL_CONNECTED) {
      Serial.print("Connexion à la wifi avec l'ip : ");
      Serial.println(WiFi.localIP());
      Serial.print("Point accès actuellement connecté : ");
      Serial.println(WiFi.SSID());
      return true;
    }
    delay(500);
    Serial.print(".");
    //Serial.print(WiFiMulti.run());
    c++;
  }
  Serial.println("");
  Serial.println("Impossible de se connecter à la Wifi :(");
  return false;
}

/**
   Se charge d'établir une connexion wifi
*/
bool WifiService::connectToWifi(char* ssidWifi, char* passWifi) {
  if (strcmp(ssidWifi, "") == 0 || strcmp(passWifi, "") == 0)
    return false;
  // Tente d'établir une connexion
  Serial.print("Tente de se connecter à la wifi avec un SSID ");
  Serial.print(ssidWifi);
  Serial.print(" et un mdp : ");
  Serial.println(passWifi);
  WiFiMulti.addAP(ssidWifi, passWifi);
  bool result =  isConnectedToWifi();
  Serial.print("Est connecté à la wifi : ");
  Serial.println(result);
  return result;
}

/**
   Se charge de monter un point de terminaison wifi
*/
bool WifiService::setupAp(char* ssidWifi, char* passWifi, int channelWifi) {
  Serial.println("Setup AP");
  WiFi.mode(WIFI_STA);
  Serial.print("Mode : ");
  Serial.println(WIFI_STA);
  //WiFi.disconnect(true);
  delay(100);
  bool isSetupAp =  WiFi.softAP(ssidWifi, passWifi, channelWifi);
  Serial.print("Le point d'acces est setup : ");
  Serial.println(isSetupAp);
  return isSetupAp;
}

/**
   Obtient la liste des SSID's
   Que l'ESP8266 arrive à scanner
*/
void WifiService::getSSIDList(char** ssidList, size_t sizeList) {
  for (int i = 0; i < sizeList; ++i) {
    char* ssid =  Utils::strToChar(WiFi.SSID(i));
    ssidList[i] = ssid;
  }
}

/**
   Scan les réseaux disponible et renvoie
   Le nombre de réseau scannés
*/
size_t WifiService::scanNetworks() {
  Serial.println("Début du scan");
  size_t count = WiFi.scanNetworks();
  Serial.print("Nombre de wifi détectées : ");
  Serial.println(count);
  return count;
}
