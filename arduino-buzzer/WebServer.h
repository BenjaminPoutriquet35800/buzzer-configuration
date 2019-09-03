#include <Arduino.h>
#include <map>
#include <vector>
#include <ESP8266WebServer.h>
#include "Constants.h"

#include "EEPROMService.h"
#include "WifiService.h"

class WebServer {
  public:
    WebServer();
    void startServer();
    void onHandleClient();
  private :
    WifiService _serviceWifi;
    EEPROMService _serviceEEPROM;
    void persistSettings();
    char* retrieveSettingsAndBuildJson();
    char* retrieveSSIDAndBuildJson();
    void buildApiRoutes();
    void buildRouteGetSSID();
    void buildRouteSettings();
    void buildRoutePingMe();
};
