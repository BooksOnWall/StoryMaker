## Elementi
Alcuni elementi, come gli sfondi, i cieli, ecc., sono perfettamente adatti alla realtà virtuale e non alla realtà aumentata.
Va notato che il rendering degli elementi dipende dai motori di rendering 3D (webgl per StageMaker, arKit per ios, arCore per android).


### Elementi di fulmine
#### Ambiente fulmineo
* VIRO API REF <ViroLightingEnvironment/>
* RTF API REF ?
* fonte uri: "http://example.org/myimage.hdr" | require('./myimage.hdr')
* func onLoadStart
* onLoadEnd func
* onError func

[Riferimento](https://docs.viromedia.com/docs/virolightingenvironment)

#### SpotLight:
* VIRO API REF <ViroSpotLight/>
* RTF API REF ?
* posizione [x,y,z]
* colore "#777777"
* direzione [x,y,z]
* attenuazioneStartDistance 5
* attenuazioneFineDistanza 10
* innerAngle 5
* outerAngle 20

[Riferimento](https://docs.viromedia.com/docs/virospotlight1)

#### AmbientLight
* VIRO API REF <ViroAmbientLight/>
* RTF API REF ?
* colore "#FF0000"
* influenceBitMask "0x1"
* intensità 1000
* temperatura "6500K"

[Riferimento](https://docs.viromedia.com/docs/viroambientlight)

#### DirectionalLight
* VIRO API REF <ViroDirectionalLight/>
* RTF API REF ?
* posizione [x,y,z]
* colore "#FFF"
* direzione [x,y,z]
* castShadow true
* influenceBitMask "0x1
* intensità 1000
* shadowBias 0.005
* shadowFarZ 20
* shadowNearZ 0.1
* shadowOrthographicSize 20
* shadowOrthographicPosition [x,y,z] * shadowMapSize
* shadowMapSize 1024
* shadowOpacity 1.0
* temperatura "6500K"

[Riferimento](https://docs.viromedia.com/docs/virodirectionallight-1)

#### OmniLight
* RTF API REF ?
* VIRO API REF <ViroOmniLight/>
* posizione [x,y,z]
* colore "#FFF"
* posizione [x,y,z]
* attenuazioneStartDistance 5
* attenuazioneFineDistanza 10
* influenceBitMask "0x1
* intensità 1000
* temperatura "6500K

[Riferimento](https://docs.viromedia.com/docs/viroomnilight)

#### Ombre
Viro rende le ombre tramite shadow mapping, una tecnica in cui le sagome degli oggetti sono rese in un'immagine, e questa immagine viene poi riprodotta sullo schermo. Viro genera ombre per tutte le luci la cui proprietà castsShadow è impostata a true.

Le ombre sono particolarmente importanti per l'AR, in quanto forniscono un indizio visivo della superficie del mondo reale su cui è appoggiato un oggetto virtuale. Tuttavia, poiché il lancio di ombre implica un nuovo rendering della scena diverse volte, ha un costo in termini di prestazioni.

Le ombre sono supportate solo per le luci direzionali e i riflettori.

[Riferimento](https://docs.viromedia.com/docs/3d-scene-lighting#shadows)

### Elementi della macchina fotografica
La fotocamera della scena nella realtà aumentata è modificata dalla fotocamera del telefono.
Nella realtà virtuale possono essere i movimenti della testa
L'inquadratura della vostra animazione dipende dal comportamento dell'utente.

#### telecamera di default
* VIRO API REF <ViroCamera/>
RTF API REF <Camera/> * posizione [x,y,z
* posizione [x,y,z]
* rotazione [x,y,z]
* attivo vero
* fielOfView 90
* forma di animazione [{
** nome: anim1,
** ritardo: 800,
** ciclo: vero,
** onStart: func,
** onfinish: func,
** Esegui vero
  }]

[Riferimento](https://docs.viromedia.com/docs/virocamera)

#### OrbitCamera
* VIRO API REF <ViroOrbitCamera/>
* RTF API REF ?
* posizione [x,y,z]
* focalPoint [x,y,z]
* attivo vero
* fielOfView 90

[Riferimento](https://docs.viromedia.com/docs/viroorbitcamera)

### Éléments de type decor
#### Cielo
* RTF API REF <Sky />
* Distanza 450000
* sunPosition [x,y,z]
* azimut 0,25
* ...

[Référence](https://github.com/pmndrs/drei#sky)

#### Stelle
* RTF API REF <Stars />
* raggio 100
* Profondità 50
* conteggio 5000
* fattore 4
* saturazione 0
* dissolvenza vera

[Riferimento](https://github.com/pmndrs/drei#stars)

#### Griglia
* RTF API REF <gridHelper />
* args [10, 10, 'bianco', 'grigio']
[Riferimento](https://threejs.org/docs/#api/en/helpers/GridHelper)

### Elementi del tipo di oggetto
Viro supporta il caricamento di modelli 3D nei formati FBX, GLTF e OBJ. Viro caricherà la geometria, le texture e le impostazioni di illuminazione dal file. Per FBX, Viro caricherà inoltre tutte le animazioni scheletriche installate. I file OBJ vengono caricati direttamente impostando l'attributo source di <Viro3DObject>, mentre i file FBX devono essere convertiti nel formato VRX di Viro.

#### Box
* VIRO API REF <ViroBox/>
* RTF API REF <mesh />
* posizione [x,y,z]
* altezza 2
* lunghezza 2
* larghezza 2
* materiali ["boxside"]
* forma di animazione [{
** nome: anim1,
** ritardo: 800,
** ciclo: vero,
** onStart: func,
** onfinish: func,
** Esegui vero
  }]
* highAccuracyEvents vero
*ignoreEventHandling false
* lightReceivingBitMask .5
* forma dragPlane {
** pianoPunto
** pianoNormale
** maxDIstanza
  }
* ...

[Riferimento](https://docs.viromedia.com/docs/virobox)

### Oggetti 3D

Gli oggetti hanno bisogno di luce per essere visibili!

#### File .obj
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* posizione [x,y,z]
* source require('./myObbject.obj')
* risorse [...texture]
* highAccuracyEvents vero
* scala [x,y,z] * rotazione [x,y,z] * rotazione [x,y,z] * rotazione [x,y,z] * rotazione [x,y,z
* rotazione[x,y,z]
* tipo "OBJ"
* transformBehaviors ["billboard"]

#### file .fbx
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* posizione [x,y,z]
* source require('./myObbject.fbx')
* risorse [...texture]
* highAccuracyEvents vero
* scala [x,y,z]
* rotazione[x,y,z]
* tipo 'FBX
* transformBehaviors ["billboard"]

#### File .gltf
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* posizione [x,y,z]
* source require('./myObbject.gltf')
* risorse [...texture]
* highAccuracyEvents vero
* scala [x,y,z]
* rotazione[x,y,z]
* tipo "GLTF"
* transformBehaviors ["billboard"]

#### File .vrx
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* posizione [x,y,z]
* source require('./myObbject.vrx')
* risorse [...texture]
* highAccuracyEvents vero
* scala [x,y,z]
* rotazione[x,y,z]
* tipo 'VRX
* transformBehaviors ["billboard"]

### Elementi della struttura
#### immagine texture

[Riferimento]

### Éléments de type texture
#### immagine texture
* VIRO API REF <ViroMaterials/>
* texture ambientOcclusionTexture
* blendMode ['None', 'Alpha', 'Add', 'Subtract', 'Multiply', 'Screen']
* bloomThreshold ['None', 'Red', 'Green', 'Blue', 'Alpha', 'All']
* colorWriteMask ['None', 'Red', 'Green', 'Blue', 'Alpha', 'All']
* cullMode ['None', 'Back', 'Front']
* diffuseColor
* chromaKeyFilteringColor
* diffuseIntensity 1.0
* diffuseTexture uri: "http://example.org/myimage.png" | require('./image.png')
* lightingModel ['Phong', 'Blinn', 'Lambert', 'Constant', 'PBR']
* magnificationFilter ['Nearest', 'Linear']
* metalness 1
* texture metalnessTexture
* minificationFilter ['Nearest', 'Linear']
* mipFilter ['Nearest', 'Linear']
* normalTexture uri: "http://example.org/myimage.png" | require('./image.png')
* readsFromDepthBuffer true
* rugosità 1
* roughnessTexture uri: "http://example.org/myimage.png" | require('./image.png')
* lucentezza 1
* specularTexture uri: "http://example.org/myimage.png" | require('./image.png')
* wrapS ['Clamp', 'Repeat', 'Mirror']
* wrapT ['Clamp', 'Repeat', 'Mirror']
* writesToDepthBuffer true

[Référence](https://docs.viromedia.com/docs/materials)

#### video texture
* VIRO API REF <ViroMaterialVideo />
* RTF API REF ?
* materiale
* pausa vera
* loop true
* muto vero
* evento onBufferEnd
* Evento onError
* Evento onBufferStart
* Evento onFinish
* Evento onUpdateTime
* volume 0.8

[Référence](https://docs.viromedia.com/docs/viromaterialvideo)

### Éléments de type particule

```
<ViroParticleEmitter
  position={[0, 4.5, 0]}
  duration={2000}
  visible={vero}
  delay={0}
  run={vero}
  loop={vero}
  fixedToEmitter={true}

  image={{
    source:require("./res/particle_snow.png"),                 
    altezza:0.1,
    larghezza:0.1,
    bloomThreshold:1.0
  }}

  spawnBehavior={{
    particleLifetime:[4000,4000],
    emissionRatePerSecond:[150, 200],
    spawnVolume:{
      shape: "box",
      params:[20, 1, 20],
      spawnOnSurface:false
    },
    maxParticles:800
  }}

  particleAppearance={{
    opacità:{
      initialRange:[0, 0],
      fattore: "tempo",
      interpolazione:[
        {endValue:0.5, interval:[0,500]},
        {endValue:1.0, interval:[4000,5000]}
      ]
    },

    rotazione:{
      initialRange:[0, 360],
      fattore: "tempo",
      interpolazione:[
        {endValue:1080, interval:[0,5000]},
      ]
    },

    scala:{
      initialRange:[[5,5,5], [10,10,10]],
      fattore:[[tempo]],
      interpolazione:[
        {endValue:[3,3,3], interval:[0,4000]},
        {endValue:[0,0,0], interval:[4000,5000]}
      ]
    },
  }}

  particlePhysics={{
    velocità:{
    initialRange:[[-2,-.5,0], [2,-3.5,0]]}
  }}
/>

```
[Référence](https://docs.viromedia.com/docs/viroparticleemitter)

### Elementi audio
#### audio principale

[Riferimento] ###

#### audio spaziale

[Riferimento]

### Elementi di tipo video

[Riferimento]

### Elementi di tipo immagine

[Riferimento]

### Gruppo di elementi
#### Nodo
* VIRO API REF <ViroNode/>
* posizione [x,y,z]
* altezza 2
* lunghezza 2
* larghezza 2
* materiali ["boxside"]
* forma di animazione [{
  ** nome: anim1,
  ** ritardo: 800,
  ** ciclo: vero,
  ** onStart: func,
  ** onfinish: func,
  ** Esegui vero
  }]
* highAccuracyEvents vero
*ignoreEventHandling false
* lightReceivingBitMask .5
* forma dragPlane {
  ** pianoPunto
  ** pianoNormale
  ** maxDIstanza
  }
* ...

[Riferimento]
