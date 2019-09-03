#ifndef INCLUDE_LIB_H
#define INCLUDE_LIB_H

#include "Utils.h"

#endif


#ifndef INCLUDE_WIFI_SERVICE_H
#define INCLUDE_WIFI_SERVICE_H

#include <ESP8266WiFiMulti.h>

class WifiService {
  public:
    WifiService();
    bool isConnectedToWifi();
    bool connectToWifi(char* ssidWifi, char* passWifi);
    bool setupAp(char* ssidWifi, char* passWifi, int channelWifi);
    void getSSIDList(char** ssidList, size_t sizeList);
    size_t scanNetworks();
};

#endif
