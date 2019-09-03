#ifndef INCLUDE_LIB_H
#define INCLUDE_LIB_H

#include "Constants.h"
#include "Utils.h"

#endif

#ifndef INCLUDE_EEPROM_SERVICE_H
#define INCLUDE_EEPROM_SERVICE_H

#include <Arduino.h>
#include <EEPROM.h>

class EEPROMService {
  public :
    EEPROMService();
    void initSizeEEPROM(int size);
    void commit();    
    void cleanupEEPROM();
    char* buildPayloadOnBuzz();
    char* readSsidFromEEPROM();
    char* readTeamChoiceFromEEPROM();
    char* readWifiPasswordFromEEPROM();
    char* readServerBurgerQuizFromEEPROM();
    void writeOnEEPROMSsid(String ssidToSave);
    void writeOnEEPROMPasswordWifi(String passwordWifiToSave);
    void writeOnEEPROMTeamChoice(String teamChoice);
    void writeOnEEPROMServerAddressBurgerQuiz(String addressServer);
  private :    
    char* baseReadFromEEPROM(int startReadAt, int endReadAt, String messageDebugging);
    void baseWriteOnEEPROM(int startIndexWrite, String contentToWrite, String baseMessageDebugging);
};

#endif
