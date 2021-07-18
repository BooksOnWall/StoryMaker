# Elements
Elements are objects (Light Cameras, 3D Onjects, Sounds, Videos, Textures, Particle Generators ...) that are added during an event and that compose an animation.


Some elements, such as backgrounds, a sky can be perfectly suitable for virtual reality and not for augmented reality.
It should be noted that the rendering of elements is dependent on 3D rendering engines (webgl for StageMaker, arKit for ios, arCore for android).


## Light elements
### Lightning environment
* VIRO API REF <ViroLightingEnvironment/>
* RTF API REF ?
* source uri: "http://example.org/myimage.hdr" | require('./myimage.hdr')
* onLoadStart func
* onLoadEnd func
* onError func

[Reference](https://docs.viromedia.com/docs/virolightingenvironment)

### SpotLight:
* VIRO API REF <ViroSpotLight/>
* RTF API REF ?
* position [x,y,z]
* color "#777777"
* direction [x,y,z]
* attenuationStartDistance 5
* attenuationEndDistance 10
* innerAngle 5
* outerAngle 20

[Reference](https://docs.viromedia.com/docs/virospotlight1)

### AmbientLight
* VIRO API REF <ViroAmbientLight/>
* RTF API REF ?
* color "#FF0000"
* influenceBitMask "0x1"
* intensity 1000
* temperature "6500K"

[Reference](https://docs.viromedia.com/docs/viroambientlight)

### DirectionalLight
* VIRO API REF <ViroDirectionalLight/>
* RTF API REF ?
* position [x,y,z]
* color "#FFF"
* direction [x,y,z]
* castShadow true
* influenceBitMask "0x1
* intensity 1000
* shadowBias 0.005
* shadowFarZ 20
* shadowNearZ 0.1
* shadowOrthographicSize 20
* shadowOrthographicPosition [x,y,z]
* shadowMapSize 1024
* shadowOpacity 1.0
* temperature "6500K"

[Reference](https://docs.viromedia.com/docs/virodirectionallight-1)

### OmniLight
* RTF API REF ?
* VIRO API REF <ViroOmniLight/>
* position [x,y,z]
* color "#FFF"
* position [x,y,z]
* attenuationStartDistance 5
* attenuationEndDistance 10
* influenceBitMask "0x1
* intensity 1000
* temperature "6500K

[Reference](https://docs.viromedia.com/docs/viroomnilight)

### Shadows
Viro renders shadows by shadow mapping, a technique where the silhouettes of objects are rendered in an image, and this image is then reprojected on the screen. Viro generates shadows for all lights whose castsShadow property is set to true.

Shadows are particularly important for AR, as they provide a visual clue to the real-world surface on which a virtual object rests. However, since casting shadows involves re-rendering the scene multiple times, it comes at a performance cost.

Shadows are only supported for directional lights and spotlights.

[Reference](https://docs.viromedia.com/docs/3d-scene-lighting#shadows)

## Camera elements
The camera of the scene in augmented reality is modified by the camera of the phone.
In Virtual Reality it can be the movements of the head
The framing of your animation depends on the user's behavior.

### default camera
* VIRO API REF <ViroCamera/>
* RTF API REF <Camera />
* position [x,y,z]
* rotation [x,y,z]
* active true
* fielOfView 90
* animation
 * name: anim1,
 * delay: 800,
 * loop: true,
 * onStart: func,
 * onfinish: func,
 * run true


[Reference](https://docs.viromedia.com/docs/virocamera)

### OrbitCamera
* VIRO API REF <ViroOrbitCamera/>
* RTF API REF <PerspectiveCamera />
* position [x,y,z]
* focalPoint [x,y,z]
* active true
* fielOfView 90

[Reference](https://docs.viromedia.com/docs/viroorbitcamera)

## Decor elements
### Sky
* RTF API REF <Sky />
* distance 450000
* sunPosition [x,y,z]
* azimuth 0.25
* ...

[Reference](https://github.com/pmndrs/drei#sky)

### Stars
* RTF API REF <Stars />
* radius 100
* depth 50
* count 5000
* factor 4
* saturation 0
* fade true

[Reference](https://github.com/pmndrs/drei#stars)

### Grid
* RTF API REF <gridHelper />
* args [10, 10, 'white', 'gray']
[Reference](https://threejs.org/docs/#api/en/helpers/GridHelper)

## Object type elements
Viro supports loading 3D models in FBX, GLTF and OBJ formats. Viro will load the geometry, textures and lighting settings from the file. For FBX, Viro will additionally load all installed skeletal animations. OBJ files are loaded directly by setting the source attribute of <Viro3DObject>, while FBX files must be converted to Viro's own VRX format.

### Box
* VIRO API REF <ViroBox/>
* RTF API REF <mesh />
* position [x,y,z]
* height 2
* length 2
* width 2
* materials ["boxside"]
* animation
 * name: anim1,
 * delay: 800,
 * loop: true,
 * onStart: func,
 * onfinish: func,
 * run true
* highAccuracyEvents true
* ignoreEventHandling false
* lightReceivingBitMask .5
* dragPlane
 * planePoint
 * planeNormal
 * maxDIstance
* ...

[Reference](https://docs.viromedia.com/docs/virobox)

## 3D Objects

Objects need light to be visible !

### .obj file
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

### .fbx file
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

### .gltf file
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

### .vrx file
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

## Texture elements
### image texture
* VIRO API REF <ViroMaterials/>
* ambientOcclusionTexture texture
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
* metalnessTexture texture
* minificationFilter ['Nearest', 'Linear']
* mipFilter ['Nearest', 'Linear']
* normalTexture uri: "http://example.org/myimage.png" | require('./image.png')
* readsFromDepthBuffer true
* roughness 1
* roughnessTexture uri: "http://example.org/myimage.png" | require('./image.png')
* shininess 1
* specularTexture uri: "http://example.org/myimage.png" | require('./image.png')
* wrapS ['Clamp', 'Repeat', 'Mirror']
* wrapT ['Clamp', 'Repeat', 'Mirror']
* writesToDepthBuffer true

[Reference](https://docs.viromedia.com/docs/materials)

### video texture
* VIRO API REF <ViroMaterialVideo />
* RTF API REF ?
* material
* paused true
* loop true
* muted true
* onBufferEnd event
* onError event
* onBufferStart event
* onFinish event
* onUpdateTime event
* volume 0.8

[Reference](https://docs.viromedia.com/docs/viromaterialvideo)

## Éléments de type particule
### Émetteur de particules
* VIRO API REF <ViroParticleEmitter/>
* RTF API REF ?
* Position [x,y,z]
* durée 2000
* visible true
* delay 0
* run true
* loop true
* fixedToEmitter true
* image
 * source require('./particle_snow.png')
 * hauteur 0.1
 * largeur 0.1
 * BloomThreshold 1.0
* spawnBehavior
 * particleLifetime [4000,4000] (durée de vie des particules)
 * emissionRatePerSecond [150, 200]
 * spawnVolume
  * shape "box" (forme)
  * params [20, 1, 20]
  * spawnOnSurface false
 * maxParticles 800
* particleAppearance
 * opacité
  * initialRange [0, 0]
  * facteur "time" (temps)
  * interpolation [{valeur finale:0.5, intervalle :[0,500]}, {valeur finale:1.0, intervalle :[4000,5000]}].
 * rotation
  * initialRange [0, 360]
  * facteur : "temps",
  * interpolation :[{valeur finale:1080, intervalle :[0,5000]}]
 * échelle
  * initialRange [[5,5,5], [10,10,10]]
  * facteur "time" (temps)
  * interpolation [{valeur finale :[3,3,3], intervalle :[0,4000]}, {valeur finale :[0,0,0], intervalle :[4000,5000]}]
* particlePhysics
 * vélocité
  * initialRange [[-2,-.5,0], [2,-3.5,0]]


[Référence](https://docs.viromedia.com/docs/viroparticleemitter)

## Éléments de type audio
### audio principal

[Référence] ()

### spatialisation audio

[Référence]

## Éléments de type vidéo

[Référence]

## Éléments de type image

[Référence]()

## Éléments de type group
### Nœud
* API VIRO REF <ViroNode/>
* RTF API REF <groupe/>
* Position [x,y,z]
* hauteur 2
* longueur 2
* largeur 2
* matériaux ["boxside"]
* forme de l'animation [{
 * nom : anim1,
 * delay : 800,
 * loop : true,
 * onStart : func,
 * onfinish : func,
 * run true
* highAccuracyEvents true (événements de haute précision)
* ignoreEventHandling false
* lightReceivingBitMask .5
* dragPlane
 * planePoint
 * planeNormal
 * maxDIstance
* ...

[Référence]
