## Éléments
Certains éléments, comme des fonds , un ciel  peuvent parfaitement convenir a la realité virtuelle et non à la réalité augmentée.
Il est a noter que le rendu des éléments est dépendant des moteurs 3D de rendu (webgl pour le StageMaker, arKit pour ios, arCore pour android).


### Éléments de type lumière
#### SpotLight

* position [x,y,z]
* color "#777777"
* direction [x, y, z]
* attenuationStartDistance 5
* attenuationEndDistance 10
* innerAngle 5
* outerAngle 20

#### AmbientLight
* color "#FF0000"

#### DirectionalLight
* color "#FFF"
* direction

#### OmniLight
* color "#FFF"
* position [x,y,z]
* attenuationStartDistance 5
* attenuationEndDistance 10

#### Shadows
Viro rend les ombres par shadow mapping, une technique où les silhouettes des objets sont rendues dans une image, et cette image est ensuite reprojetée sur l'écran. Viro génère des ombres pour toutes les lumières dont la propriété castsShadow est définie sur true.

Les ombres sont particulièrement importantes pour la RA, car elles fournissent un indice visuel sur la surface du monde réel sur laquelle repose un objet virtuel. Toutefois, étant donné que la projection d'ombres implique un nouveau rendu de la scène plusieurs fois, elle entraîne un coût en termes de performances.

Les ombres ne sont prises en charge que pour les lumières directionnelles et les spots.

[Référence](https://docs.viromedia.com/docs/3d-scene-lighting#shadows)

### Éléments de type camera
La camera de la scene en realité augmentée est modifié par la camera du téléphone.
En Realité virtuelle cela peut être les mouvements de la tête
Le cadrage de votra animation depend donc du comportement de l'utilisateur.

#### default camera

### Éléments de type decor
#### Sky

#### Grid


### Éléments de type objet
Viro prend en charge le chargement de modèles 3D dans les formats FBX, GLTF et OBJ. Viro chargera la géométrie, les textures et les paramètres d'éclairage du fichier. Pour FBX, Viro chargera en plus toutes les animations squelettiques installées. Les fichiers OBJ sont chargés directement en définissant l'attribut source de <Viro3DObject>, tandis que les fichiers FBX doivent être convertis dans le format VRX propre à Viro.

#### Mesh

#### Fichier .obj

#### Fichier .fbx

#### Fichier .gltf

#### Fichier .vrx

### Éléments de type texture
#### image texture

#### video texture

### Éléments de type particule

### Éléments de type audio
#### main audio
#### audio spatialisation

### Éléments de type video

### Éléments de type image

### Éléments de type group
