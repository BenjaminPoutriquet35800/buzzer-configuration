
# Présentation

Ce répertoire contient l'interface permettant de communiquer avec **l'ESP8266** pour configurer le buzzer.

## Prérequis

- Pc avec Wifi.
- Avoir suvit les instructions du répertoire : [arduino-buzzer](https://github.com/BenjaminPoutriquet35800/buzzer-configuration/tree/master/arduino-buzzer) en amont. 
- Installer NodeJs : https://nodejs.org/fr/.

# Installation

- Se rendre dans le dossier (sur Windows):

```
C:\...\Buzzer-Configuration\buzzer-configuration
```

- Ouvrir l'invite de commande et taper la commande suivante :

```
npm install
```

Si tout s'est bien passé vous pouvez lancer l'application avec la commande :

```
npm start
```

# Fonctionnement

Il faut que votre buzzer (ESP8266) soit **allumé** avec le programme **téléversé** ([arduino-buzzer](https://github.com/BenjaminPoutriquet35800/buzzer-configuration/tree/master/arduino-buzzer)) qui va bien.

**NOTA** : Sous **Windows** il existe un **bug**. En effet Windows **met en cache** les **SSID's** trouvés ([Stack Overflow](https://stackoverflow.com/questions/30786358/how-do-i-reset-the-system-cache-of-wlan-info)). Ce qui pose un problème lorsque vous scanner le réseau avec l'application. Cette dernière ne verra pas le SSID de votre buzzer.
Pour résoudre cela, la seule manipulation trouvée à ce jour est de cliquer sur la **liste des réseaux** pour lancer le rafraîchissement du cache :

<p align="center">
<img src="https://user-images.githubusercontent.com/25900708/66716945-e0635780-edd3-11e9-8a8f-f9c4edc49135.PNG?sanitize=true"> 
</p>

<p align="center">
<img src="https://user-images.githubusercontent.com/25900708/66715907-1d761c80-edc9-11e9-995f-724a21876108.png?sanitize=true"> 
</p>

Lancez ensuite le scan si aucun buzzer n'a été trouvé.
Si tout est OK vous devriez voir apparaître votre buzzer. 
Cliquer sur la ligne en question pour être rediriger vers l'écran de configuration.