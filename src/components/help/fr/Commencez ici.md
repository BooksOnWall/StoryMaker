# Commencez ici
StageMaker permet de créer des animations 2D ou 3D de Réalité augmentée qui pourront être visibles sur une application mobile crée avec react-native et react-viro.

Ce site web est une application gratuite , vous êtes libres de vous y inscrire et pouvez creéer , publier et regarder votre animation sur votre mobile.

StageMaker reprend l'idée mise en pratique dans [React Three Editable](https://github.com/AndrewPrifer/react-three-editable) d'utiliser un format ouvert r3f pour transmettre à l'application mobile les scenes, évenements , objects et les parametres des animations.

## Réalité augmentée

Cependant même si react-viro permet de piloter les deux moteurs 3D de arkit (Apple) et arCore (Google), il nous faut disposer d'un format qui nous permette de recoder des scenes et animations d'une manière qui soit supportée par:

* Threejs | ReactThreeFiber pour l'application qui permet l'édtion web des scènes
* ReactViro | arKit | arCore

Il existe donc des options et commandes qui ne sont disponiblent que pour Apple ou que pour Google, soit parce qu'elles ne sont pas implémentées dans arKit ou arCore, soit parcequ'elles n'ont pas encore été implementées dans React-viro.   

## Réalité virtuelle

React-viro permettant également d'utiliser les moteurs 3D des telephones pour la réalité virtuelle, ils vous sera prochainement proposé dans la configuration des scenes des parametres et options dediées à cette tache.

## Événements, Layers et Timeline

StageMaker fonctionne en découpant le déroulé des animations dans des animations plus petites executées lors d'évènements precis.

Pour chaque évenement on aura donc:

* une liste d'éléments (camera , lumière , objet3D , son, texture ...)   
* une timeline dans la quelle tous les éléments peuvent être ajustés et des points clefs definis et configurés.
* un player d'animation pour jouer et mettre en pause l'animation en choisissant des modeles de rendu 3D différents  

##  Documentation utilisateur

* [Événements](Événements)
* [Layers](Layers)
* [Timeline](Timeline)
* [Options](Options)
* [Éléments](Éléments)
* [Traduire](Traduire)
* [Configurer](Configurer)
* [Sauver](Sauver)
* [Dupliquer](Dupliquer)
* [Publier](Publier)
* [Partager](Partager)
* [Contribuer](Contribuer)

## Documentation developeur

### Sources

https://git.booksonwall.art

https://github/booksonwall

https://gitlab.com/booksonwall

## Licence
afferoGPL pour le code source des applications
Creative common pour les contenus
