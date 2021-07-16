## Elementos
Algunos elementos, como los fondos, los cielos, etc., son perfectamente adecuados para la realidad virtual y no para la realidad aumentada.
Hay que tener en cuenta que el renderizado de los elementos depende de los motores de renderizado 3D (webgl para StageMaker, arKit para ios, arCore para android).


### Elementos del rayo
#### Entorno del rayo
* VIRO API REF <ViroLightingEnvironment/>
* RTF API REF ?
* source uri: "http://example.org/myimage.hdr" | require('./myimage.hdr')
* Func onLoadStart
* Func onLoadEnd
* onError func

[Referencia](https://docs.viromedia.com/docs/virolightingenvironment)

#### SpotLight:
* VIRO API REF <ViroSpotLight/>
* RTF API REF ?
* posición [x,y,z]
* color "#777777"
* dirección [x,y,z]
* attenuationStartDistance 5
* attenuationEndDistance 10
* innerAngle 5
* outerAngle 20

[Referencia](https://docs.viromedia.com/docs/virospotlight1)

#### AmbientLight
* VIRO API REF <ViroAmbientLight/>
* RTF API REF ?
* color "#FF0000"
* influenceBitMask "0x1"
* intensidad 1000
* temperatura "6500K"

[Referencia](https://docs.viromedia.com/docs/viroambientlight)

#### DirectionalLight
* VIRO API REF <ViroDirectionalLight/>
* RTF API REF ?
* posición [x,y,z]
* color "#FFF"
* dirección [x,y,z]
* castShadow true
* influenceBitMask "0x1
* intensidad 1000
* shadowBias 0.005
* shadowFarZ 20
* shadowNearZ 0.1
* shadowOrthographicSize 20
* shadowOrthographicPosition [x,y,z] * shadowMapSize
* shadowMapSize 1024
* shadowOpacity 1.0
* temperatura "6500K"

[Referencia](https://docs.viromedia.com/docs/virodirectionallight-1)

#### OmniLight
* RTF API REF ?
* VIRO API REF <ViroOmniLight/>
* posición [x,y,z]
* color "#FFF"
* posición [x,y,z]
* attenuationStartDistance 5
* attenuationEndDistance 10
* influenceBitMask "0x1
* intensidad 1000
* temperatura "6500K

[Referencia](https://docs.viromedia.com/docs/viroomnilight)

#### Sombras
Viro renderiza las sombras mediante el mapeo de sombras, una técnica en la que las siluetas de los objetos se renderizan en una imagen y ésta se reproyecta en la pantalla. Viro genera sombras para todas las luces cuya propiedad castsShadow está establecida como true.

Las sombras son especialmente importantes para la RA, ya que proporcionan una pista visual de la superficie del mundo real sobre la que se apoya un objeto virtual. Sin embargo, como la proyección de sombras implica volver a renderizar la escena varias veces, tiene un coste de rendimiento.

Las sombras sólo son compatibles con las luces direccionales y los focos.

[Referencia](https://docs.viromedia.com/docs/3d-scene-lighting#shadows)

### Elementos de la cámara
La cámara de la escena en realidad aumentada es modificada por la cámara del teléfono.
En la Realidad Virtual pueden ser los movimientos de la cabeza
El encuadre de su animación depende del comportamiento del usuario.

#### cámara por defecto
* VIRO API REF <ViroCamera/>
RTF API REF <Cámara/> * posición [x,y,z
* posición [x,y,z]
* rotación [x,y,z]
* activo verdadero
* fielOfView 90
* forma de animación [{
** nombre: anim1,
** retraso: 800,
** bucle: verdadero,
** onStart: func,
** onfinish: func,
** ejecutar verdadero
  }]

[Referencia](https://docs.viromedia.com/docs/virocamera)

#### OrbitCamera
* VIRO API REF <ViroOrbitCamera/>
* RTF API REF ?
* posición [x,y,z]
* focalPoint [x,y,z]
* activo verdadero
* fielOfView 90

[Referencia](https://docs.viromedia.com/docs/viroorbitcamera)

### Éléments de type decor
#### Cielo
* RTF API REF <Sky />
* distancia 450000
* sunPosition [x,y,z]
* azimut 0.25
* ...

[Référence](https://github.com/pmndrs/drei#sky)

#### Estrellas
* RTF API REF <Stars />
* radio 100
* profundidad 50
* recuento 5000
* factor 4
* saturación 0
* fade true

[Référence](https://github.com/pmndrs/drei#stars)

#### Grid
* RTF API REF <gridHelper />
* args [10, 10, 'blanco', 'gris']
[Referencia](https://threejs.org/docs/#api/en/helpers/GridHelper)

### Elementos del tipo de objeto
Viro soporta la carga de modelos 3D en formatos FBX, GLTF y OBJ. Viro cargará la geometría, las texturas y los ajustes de iluminación del archivo. Para FBX, Viro cargará adicionalmente todas las animaciones esqueléticas instaladas. Los archivos OBJ se cargan directamente estableciendo el atributo source de <Viro3DObject>, mientras que los archivos FBX deben ser convertidos al formato VRX propio de Viro.

#### Caja
* VIRO API REF <ViroBox/>
* RTF API REF <mesh />
* posición [x,y,z]
* altura 2
* longitud 2
* ancho 2
* materiales ["boxside"]
* forma de animación [{
** nombre: anim1,
** retraso: 800,
** bucle: verdadero,
** onStart: func,
** onfinish: func,
** ejecutar verdadero
  }]
* highAccuracyEvents true
* ignoreEventHandling false
* lightReceivingBitMask .5
* forma dragPlane {
** planePoint
** planoNormal
** maxDIstancia
  }
* ...

[Referencia](https://docs.viromedia.com/docs/virobox)

### Objetos 3D

Los objetos necesitan luz para ser visibles.

#### archivo .obj
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* posición [x,y,z]
* source require('./myObbject.obj')
* recursos [...texturas]
* highAccuracyEvents true
* escala [x,y,z] * rotación [x,y,z] * rotación [x,y,z] * rotación [x,y,z] * rotación [x,y,z]
* rotación[x,y,z]
* tipo "OBJ"
* transformBehaviors ["cartelera"]

#### archivo .fbx
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* posición [x,y,z]
* source require('./myObbject.fbx')
* recursos [...texturas]
* highAccuracyEvents true
* escala [x,y,z]
* rotación[x,y,z]
* tipo 'FBX
* transformBehaviors ["cartelera"]

#### archivo .gltf
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* posición [x,y,z]
* source require('./myObbject.gltf')
* recursos [...texturas]
* highAccuracyEvents true
* escala [x,y,z]
* rotación[x,y,z]
* tipo "GLTF"
* transformBehaviors ["cartelera"]

#### archivo .vrx
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* posición [x,y,z]
* source require('./myObbject.vrx')
* recursos [...texturas]
* highAccuracyEvents true
* escala [x,y,z]
* rotación[x,y,z]
* tipo 'VRX
* transformBehaviors ["cartelera"]

### Elementos de textura
#### textura de la imagen

[Referencia]

#### textura de vídeo

[Referencia]

### Elementos de las partículas

[Referencia] ###

### Elementos de audio
#### audio principal

[Referencia] ###

#### audio espacial

[Referencia]

### Elementos de tipo vídeo

[Referencia]

### Elementos de tipo de imagen

[Referencia]

### Group Items
#### Nodo
* VIRO API REF <ViroNode/>
* posición [x,y,z]
* altura 2
* longitud 2
* ancho 2
* materiales ["boxside"]
* forma de animación [{
  ** nombre: anim1,
  ** retraso: 800,
  ** bucle: verdadero,
  ** onStart: func,
  ** onfinish: func,
  ** ejecutar verdadero
  }]
* highAccuracyEvents true
* ignoreEventHandling false
* lightReceivingBitMask .5
* forma dragPlane {
  ** planePoint
  ** planoNormal
  ** maxDIstancia
  }
* ...

[Referencia]
