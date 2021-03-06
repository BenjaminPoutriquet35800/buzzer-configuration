# Prérequis

- PC Wifi.
- L'IDE Arduino installé. Disponible [ici](https://www.arduino.cc/en/main/software).

## Composants

Nom composant | Qté |Site marchand
------------ | ------------- | -------------
Wemos d1 mini (ESP8266) | x2 | [Amazon](https://www.amazon.fr/AZDelivery-D1-Mini-d%C3%A9veloppement-compatible/dp/B01N9RXGHY/ref=sr_1_1_sspa?adgrpid=57861652282&gclid=Cj0KCQjwrMHsBRCIARIsAFgSeI3_yetCynGbaTu8NuwP1s9mzjPOWMrfNx7S1xLCrdJi3kXZFt6DcDQaAnzOEALw_wcB&hvadid=275452725042&hvdev=c&hvlocphy=9055384&hvnetw=g&hvpos=1t1&hvqmt=b&hvrand=10982767443727339825&hvtargid=kwd-329468039204&hydadcr=27708_1756269&keywords=wemos+d1+mini&qid=1569765998&s=gateway&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzM0VFQzE3Qk1GU0szJmVuY3J5cHRlZElkPUEwMDg3NzUzMVRSR0pOMjZQV1pWRSZlbmNyeXB0ZWRBZElkPUEwMjkxNzg0MVZWUVg3UEsxWTA4MiZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=)
Bouton d'arrêt d'urgence | x2 | [Amazon](https://www.amazon.fr/durgence-Bouton-Poussoir-Interrupteur-Plastique/dp/B07JQ1MPM4/ref=sr_1_21_sspa?__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=15UB4FY2JWX7C&keywords=bouton+d%27arret+d%27urgence&qid=1569766112&s=gateway&sprefix=bouton+d%27ar%2Caps%2C204&sr=8-21-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyQUZaMzBHWTdIVThHJmVuY3J5cHRlZElkPUEwOTA2NTg0UlhPRlBVS1VOTVRRJmVuY3J5cHRlZEFkSWQ9QTA3NzUwNjcyWjNENkdXNkZWRzNMJndpZGdldE5hbWU9c3BfbXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ==)
Batterie (Aihasd Micro) | x2 | [Amazon](https://www.amazon.fr/Aihasd-Lithium-Battery-Chargeur-Conseil/dp/B0191EVW0C)
Inter Glissière (marche/arrêt) | x2 | [Amazon](https://www.amazon.fr/gp/product/B00NQCPRMA/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1)
Résistance (10 k Ohms ±1% tolérance) | x2 | [Amazon](https://www.amazon.fr/Assortiment-600-r%C3%A9sistance-30-Valeurs-diff%C3%A9rentes/dp/B01LYGIOW4/ref=sr_1_11?__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&keywords=resistance+10k+ohms&qid=1569767647&s=gateway&sr=8-11)
Pile rechargeable 18650 | x1 | [Amazon](https://www.amazon.fr/gp/product/B07ZBC5XSZ/)
Boitier de rangement (pour piles 18650) | x2 | [Amazon](https://www.amazon.fr/gp/product/B018Q6TI5W/ref=ppx_yo_dt_b_asin_title_o06_s00?ie=UTF8&psc=1)

# Installation programme

Depuis l'IDE Arduino, ouvrir le répertoire où se trouve le programme du Buzzer : 

```
C:\...\buzzer-configuration\arduino-buzzer\burger-quiz-buzzer
```

## Ajouter la carte Wemos D1 Mini

- Fichier > Préférences 
    - URL de gestionnaire de cartes supplémentaires : 
    ```http://arduino.esp8266.com/stable/package_esp8266com_index.json```.
    - OK.
- Outils > Type de carte > Gestionnaire de carte :
    - Rechercher : **ESP8266**.
    - Installer la carte : **ESP8266 by ESP8266 community**.
- Outils > Type de carte > **WeMos D1 R1**.

## Ajouter des bibliothèques

La meilleure chose à faire est d'utiliser le gestionnaire de bibliothèque Arduino :

- Croquis > Inclure une bibliothèque > Gérer les bibliothèques.
- Installez la librairie **WebSockets** par **Markus Sattler**.
- Installer la librairie **SocketIoClient** par **Vincent Wyszynski**.

## Compilation

Vous pouvez à présent faire un test de compilation sur ce bouton : 
<img src="https://user-images.githubusercontent.com/25900708/66480441-0076dc00-ea9f-11e9-907c-39362a1c46bb.PNG?sanitize=true"> 

Si tout est OK branchez votre carte (ESP8266) sur votre PC puis **téléverser** le programme sur la carte. 

Bouton à droite du bouton de verification.

Vous devriez voir apparaître dans la liste de votre réseau un point d'accès Wifi qui commence par : **Esp8266-Burger-Quiz**.

# Montage

Cette partie montre les différents branchements pour construire le buzzer ainsi que des indications de montages.

## Instruction

### Bouton poussoir

- Retirer la clavette qui bloque le bouton en position enfoncé lors d'un appui sur ce dernier. 

<p align="center">
<img src="https://user-images.githubusercontent.com/25900708/67088936-b381bc80-f1a6-11e9-8822-0e1e21921e04.PNG?sanitize=true" height="100"> 
</p>

- Faire un trou pour faire passer le bouton glissière à la base du bouton poussoir.

## Schéma de montage

<p align="center">
<img src="https://user-images.githubusercontent.com/25900708/66477026-5fd0ee00-ea97-11e9-92b5-9326822ec213.PNG?sanitize=true" height="350"> 
</p>