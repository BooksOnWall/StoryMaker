## Événements
Réalité augmentée , Réalité Virtuelle, ces nouveaux medias obéissent a des événements simples lors du déroulement d'une animation.

### Événements de la scène
Une scène possède au minimum 5 événements:

#### onStart
Cet événement s’exécute au démarrage de votre animation

#### onEnterStage
Cet événement s’exécute juste après onStart, c'est le lieu ideal pour une animation d'entrée.

#### onMain
Cet événement s’exécute juste après onEnterStage, c'est le lieu de l'animation principale , c'est aussi ici que l'on peut ajouter des événements optionnels comme onGpsMatch ou onPictureMatch

#### onLeaveStage
Cet événement s’exécute juste après onMain, c'est le lieu idéal pour une animation de sortie

#### onEnd
Cet événement s’exécute en toute fin de scène

### Événements optionnels
Ce sont des événements qui ajoutent de l'interactivité et du dynamisme à votre scène:
Ils sont normalement joués à l’intérieur de l’événement onMain.

#### onPlaneMatch
Cette option permet de chercher avec la caméra du téléphone une surface plane (verticale ou horizontale) vous devez également indiquer les dimensions réelles de la surface en question.
Une fois détectée la surface plane , une animation peut être jouée.

#### onPictureMatch
Cette option permet de chercher avec la caméra du téléphone sur une surface plane (verticale ou horizontale) une image ou photo. vous devez également indiquer les dimensions réelles de la surface en question.
Une fois détectée l'image , une animation peut être jouée.
Il existe un outil permettant de tester le taux de reconnaissance de l'image par arCore , son usage est intégré a l'application.

#### onObjectMatch
Cette option permet de chercher avec la camera du téléphone un objet au format obj et de préciser ses dimensions réelles
NB: Fonctionne bien sur ios et arKit , pas d’implémentation sous arCore

#### onGpsMatch
Cette option permet de déclencher une animation quand le gps de votre téléphone correspond a une position georéférencée.

### Événements pour les éléments de la scène
De même, chaque objet ou élément de la scène possède des événements  
