#include <Arduino.h>
#include "Constants.h"
/**
   Class utilitaire
*/
class Utils {
  public :
    Utils();
    static char* strToChar(String s);
    static void generateRandStr(char* strToGenerate, size_t lenghtToGenerate);
};
