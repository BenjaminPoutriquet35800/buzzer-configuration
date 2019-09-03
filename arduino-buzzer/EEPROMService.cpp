#include "EEPROMService.h"

EEPROMService::EEPROMService() {}

/**
   Se charge d'initialiser l'EEPROM
   Permettant d'écrire dessus par la suite
*/
void EEPROMService::initSizeEEPROM(int size) {
  EEPROM.begin(size);
  delay(10);
}

/**
   Se charge de commit les modifications sur EEPROM
*/
void EEPROMService::commit() {
  EEPROM.commit();
}

/**
   Nettoyage de l'EEPROM
*/
void EEPROMService::cleanupEEPROM() {
  for (int i = 0; i < CLEAN_EEPROM_INDEX; ++i) {
    EEPROM.write(i, 0);
  }
}

/**
   Se charge de lire le SSID stockée dans l'EEPROM
*/
char* EEPROMService::readSsidFromEEPROM() {
  return baseReadFromEEPROM(SSID_INDEX_START, SSID_INDEX_END, "Lecture SSID");
}

/**
   Se charge de lire le mot de passe Wifi depuis l'EEPROM
*/
char* EEPROMService::readWifiPasswordFromEEPROM() {
  return baseReadFromEEPROM(PASSWORD_INDEX_START, PASSWORD_INDEX_END, "Lecture password wifi");
}

/**
   Se charge de lire le type de buzzer depuis l'EEPROM
*/
char* EEPROMService::readTeamChoiceFromEEPROM() {
  return baseReadFromEEPROM(TEAM_INDEX_START, TEAM_INDEX_END, "Lecture de l'équipe");
}

/**
   Se charge de construire le corps de la charge utile pour buzzer
*/
char* EEPROMService::buildPayloadOnBuzz() {
  char* choiceTeam = readTeamChoiceFromEEPROM();
  String build = "\"";
  build += BASE_PAYLOAD_TEAM;
  build += choiceTeam;
  build += "\"";
  Serial.println(build);
  return Utils::strToChar(build);
}

/**
   Se charge de lire le type de buzzer depuis l'EEPROM
*/
char* EEPROMService::readServerBurgerQuizFromEEPROM() {
  return baseReadFromEEPROM(SERVER_BGQ_INDEX_START, SERVER_BGQ_INDEX_END, "Lecture du serveur Burger Quiz");
}

/**
   Méthode de base permettant de lire une valeur dans l'EEPROM
   Pour des index donnés
*/
char* EEPROMService::baseReadFromEEPROM(int startReadAt, int endReadAt, String messageDebugging) {
  Serial.println(messageDebugging);
  String result;
  for (int i = startReadAt; i < endReadAt; ++i) {
    byte value = EEPROM.read(i);
    // Si la valeur correspond à un 255
    // Cela signifie que l'on lit une valeur
    // Pour laquelle rien n'a encore été écrit
    // A cette adresse mémoire
    if (BYTE_NEVER_WRITTEN_VALUE == value)
      continue;
    result += char(value);
  }
  Serial.print("Lecture OK :");
  Serial.println(result);
  return Utils::strToChar(result);
}

/**
   Ecriture du SSID sur EEPROM
*/
void EEPROMService::writeOnEEPROMSsid(String ssidToSave) {
  baseWriteOnEEPROM(SSID_INDEX_START, ssidToSave, "de SSID");
}

/**
   Ecriture du Password wifi sur EEPROM
*/
void EEPROMService::writeOnEEPROMPasswordWifi(String passwordWifiToSave) {
  baseWriteOnEEPROM(SSID_INDEX_END, passwordWifiToSave, "du password wifi");
}

/**
   Ecriture du type de buzzer
*/
void EEPROMService::writeOnEEPROMTeamChoice(String teamChoice) {
  baseWriteOnEEPROM(PASSWORD_INDEX_END, teamChoice, "du type buzzer");
}

/**
   Ecriture du serveur du jeu burger quiz
*/
void EEPROMService::writeOnEEPROMServerAddressBurgerQuiz(String addressServer) {
  baseWriteOnEEPROM(TEAM_INDEX_END, addressServer, "de l'adresse du serveur de jeu");
}

/**
   Se charge d'écrire dans l'EEPROM
*/
void EEPROMService::baseWriteOnEEPROM(int startIndexWrite, String contentToWrite, String baseMessageDebugging) {
  Serial.println("Ecriture " + baseMessageDebugging + " sur EEPROM en cours:");
  Serial.println("Valeur à persiter : " + contentToWrite);
  for (int i = 0; i < contentToWrite.length(); ++i) {
    EEPROM.write(startIndexWrite + i, contentToWrite[i]);
  }
  Serial.println("Ecriture " + baseMessageDebugging + " sur EEPROM OK");
}
