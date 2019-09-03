#include "Utils.h"

/**
   Convertit une chaine de caractère en char
*/
char* Utils::strToChar(String s) {
  unsigned int bufSize = s.length() + 1;
  char* ret = new char[bufSize];
  s.toCharArray(ret, bufSize);
  return ret;
}

/**
   Se charge de générer une chaine aléatoire
   NOTA : Le char* passé en param doit avoir été
   Initialisé avec une taille en amont
*/
void Utils::generateRandStr(char* strToGenerate, size_t lenghtToGenerate) {
  size_t lenght = strlen(RANDOM_STRING);
  for (int n = 0; n < lenghtToGenerate ; n++) {
    strToGenerate[n] = RANDOM_STRING[random(0, lenght)];
    // On oublie pas de mettre le caractère '\0' 
    // Indiquant le caractère d'échappement
    strToGenerate[n + 1] = '\0';
  }
}
