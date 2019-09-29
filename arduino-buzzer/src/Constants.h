/**
 * Constantes divers
 */
#define HYPHEN "-"
#define RANDOM_STRING "abcdefghijklmnopqrstuvwxyz0123456789"

/**
   Le bouton que l'on va attacher à la pin D2 (Gpio4)
*/
#define BUTTON_PIN_BUZZER 4

/**
   Constantes pour monter l'ESP8266 en tant que point de terminaison wifi
*/
#define DEFAULT_SSID "ESP8266-Burger-Quiz"
#define DEFAULT_PASSWORD ""
#define DEFAULT_CHANNEL 6
#define SSID_LENGTH_RANDOM_STRING 3

/**
   Constantes index lecture/écriture EEPROM
*/
#define BYTE_NEVER_WRITTEN_VALUE 255

// SSID
#define SSID_INDEX_START  0
#define SSID_INDEX_END  32

// Password Wifi
#define PASSWORD_INDEX_START  32
#define PASSWORD_INDEX_END  96

// Equipe assigné au buzzer
#define TEAM_INDEX_START  96
#define TEAM_INDEX_END  108

// IP Serveur Burger Quiz
#define SERVER_BGQ_INDEX_START  108
#define SERVER_BGQ_INDEX_END  124

// Index pour nettoyage de l'EEPROM
#define CLEAN_EEPROM_INDEX  124

/**
 * Port du Serveur
 */
#define DEFAULT_SERVER_PORT 80
/**
 * Le type de contenu que l'on reverra
 */
#define CONTENT_TYPE_JSON "application/json"

/**
   Constantes des args's que le serveur web recevra
*/
#define QUERY_ARG_SSID "ssid"
#define QUERY_ARG_PASS "password"
#define QUERY_ARG_TEAM "teamChoice"
#define QUERY_ARG_SERVER_BGQ "serverIpBGQ"

#define PROPERTY_SSID_JSON "ssids"

/**
 * Les routes du serveur
 */
#define ROUTE_SETTINGS "/settings"
#define ROUTE_GET_SSID "/ssid"
#define ROUTE_PING_ME "/ping-me"

/**
   Constantes pour le buzzer
*/
#define MESSAGE_ON_BUZZ  "on-buzz"
#define DEFAULT_SERVER_PORT 3000
#define BASE_PAYLOAD_TEAM  "team-"
