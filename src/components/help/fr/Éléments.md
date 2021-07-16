## Éléments
Certains éléments, comme des fonds , un ciel  peuvent parfaitement convenir a la realité virtuelle et non à la réalité augmentée.
Il est a noter que le rendu des éléments est dépendant des moteurs 3D de rendu (webgl pour le StageMaker, arKit pour ios, arCore pour android).


### Éléments de type lumière
#### Lightning environement
* VIRO API REF <ViroLightingEnvironment/>
* RTF API REF ?
* source uri:"http://example.org/myimage.hdr" | require('./myimage.hdr')
* onLoadStart func
* onLoadEnd func
* onError func

[Référence](https://docs.viromedia.com/docs/virolightingenvironment)

#### SpotLight:
* VIRO API REF <ViroSpotLight/>
* RTF API REF ?
* position [x,y,z]
* color "#777777"
* direction [x, y, z]
* attenuationStartDistance 5
* attenuationEndDistance 10
* innerAngle 5
* outerAngle 20

[Référence](https://docs.viromedia.com/docs/virospotlight1)

#### AmbientLight
* VIRO API REF <ViroAmbientLight/>
* RTF API REF ?
* color "#FF0000"
* influenceBitMask "0x1"
* intensity 1000
* temperature "6500K"

[Référence](https://docs.viromedia.com/docs/viroambientlight)

#### DirectionalLight
* VIRO API REF <ViroDirectionalLight/>
* RTF API REF ?
* position [x,y,z]
* color "#FFF"
* direction [x,y,z]
* castShadow true
* influenceBitMask "0x1"
* intensity 1000
* shadowBias 0.005
* shadowFarZ 20
* shadowNearZ 0.1
* shadowOrthographicSize 20
* shadowOrthographicPosition [x,y,z]
* shadowMapSize	1024
* shadowOpacity 1.0
* temperature "6500K"

[Référence](https://docs.viromedia.com/docs/virodirectionallight-1)

#### OmniLight
* RTF API REF ?
* VIRO API REF <ViroOmniLight/>
* position [x,y,z]
* color "#FFF"
* position [x,y,z]
* attenuationStartDistance 5
* attenuationEndDistance 10
* influenceBitMask "0x1"
* intensity 1000
* temperature "6500K"

[Référence](https://docs.viromedia.com/docs/viroomnilight)

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
* VIRO API REF <ViroCamera/>
* RTF API REF <Camera />
* position [x,y,z]
* rotation [x,y,z]
* active true
* fielOfView 90
* animation shape [{
** name: anim1,
** delay: 800,
** loop: true,
** onStart: func,
** onfinish: func,
** run true
  }]

[Référence](https://docs.viromedia.com/docs/virocamera)

#### OrbitCamera
* VIRO API REF <ViroOrbitCamera/>
* RTF API REF <PerspectiveCamera />
* position [x,y,z]
* focalPoint [x,y,z]
* active true
* fielOfView 90

[Référence](https://docs.viromedia.com/docs/viroorbitcamera)

### Éléments de type decor
#### Sky
* RTF API REF <Sky />
* distance 450000
* sunPosition [x,y,z]
* azimuth 0.25
* ...

[Référence](https://github.com/pmndrs/drei#sky)

#### Stars
* RTF API REF <Stars />
* radius 100
* depth 50
* count 5000
* factor 4
* saturation 0
* fade true

[Référence](https://github.com/pmndrs/drei#stars)

#### Grid
* RTF API REF <gridHelper />
* args [10, 10, 'white', 'gray']
[Référence](https://threejs.org/docs/#api/en/helpers/GridHelper)

### Éléments de type objet
Viro prend en charge le chargement de modèles 3D dans les formats FBX, GLTF et OBJ. Viro chargera la géométrie, les textures et les paramètres d'éclairage du fichier. Pour FBX, Viro chargera en plus toutes les animations squelettiques installées. Les fichiers OBJ sont chargés directement en définissant l'attribut source de <Viro3DObject>, tandis que les fichiers FBX doivent être convertis dans le format VRX propre à Viro.

#### Box
* VIRO API REF <ViroBox/>
* RTF API REF <mesh />
* position [x,y,z]
* height 2
* length 2
* width 2
* materials ["boxside"]
* animation shape [{
** name: anim1,
** delay: 800,
** loop: true,
** onStart: func,
** onfinish: func,
** run true
  }]
* highAccuracyEvents true
* ignoreEventHandling false
* lightReceivingBitMask .5
* dragPlane shape {
** planePoint
** planeNormal
** maxDIstance
  }
* ...

[Référence](https://docs.viromedia.com/docs/virobox)

### Objects 3D

Les Objets ont besoin de lumière pour être visible !

#### Fichier .obj
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* position [x,y,z]
* source require('./myObbject.obj')
* resources [...textures]
* highAccuracyEvents true
* scale [x,y,z]
* rotation[x,y,z]
* type "OBJ"
* transformBehaviors ["billboard"]

#### Fichier .fbx
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* position [x,y,z]
* source require('./myObbject.fbx')
* resources [...textures]
* highAccuracyEvents true
* scale [x,y,z]
* rotation[x,y,z]
* type "FBX"
* transformBehaviors ["billboard"]

#### Fichier .gltf
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* position [x,y,z]
* source require('./myObbject.gltf')
* resources [...textures]
* highAccuracyEvents true
* scale [x,y,z]
* rotation[x,y,z]
* type "GLTF"
* transformBehaviors ["billboard"]

#### Fichier .vrx
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* position [x,y,z]
* source require('./myObbject.vrx')
* resources [...textures]
* highAccuracyEvents true
* scale [x,y,z]
* rotation[x,y,z]
* type "VRX"
* transformBehaviors ["billboard"]

### Éléments de type texture
#### image texture

[Référence]

#### video texture

[Référence]

### Éléments de type particule

[Référence]

### Éléments de type audio
#### main audio

[Référence]

#### audio spatialisation

[Référence]

### Éléments de type video

[Référence]

### Éléments de type image

[Référence]

### Éléments de type group
#### Node
* VIRO API REF <ViroNode/>
* RTF API REF <group />
* position [x,y,z]
* height 2
* length 2
* width 2
* materials ["boxside"]
* animation shape [{
  ** name: anim1,
  ** delay: 800,
  ** loop: true,
  ** onStart: func,
  ** onfinish: func,
  ** run true
  }]
* highAccuracyEvents true
* ignoreEventHandling false
* lightReceivingBitMask .5
* dragPlane shape {
  ** planePoint
  ** planeNormal
  ** maxDIstance
  }
* ...

[Référence]
