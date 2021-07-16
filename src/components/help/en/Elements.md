## Elements
Some elements, such as backgrounds, a sky can be perfectly suitable for virtual reality and not for augmented reality.
It should be noted that the rendering of elements is dependent on 3D rendering engines (webgl for StageMaker, arKit for ios, arCore for android).


### Light elements
#### Lightning environment
* VIRO API REF <Virolightingenvironment/>
* RTF API REF ?
* source uri: "http://example.org/myimage.hdr" | require('./myimage.hdr')
* onLoadStart func
* onLoadEnd func
* onError func

[Reference](https://docs.viromedia.com/docs/virolightingenvironment)

#### SpotLight:
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

#### AmbientLight
* VIRO API REF <ViroAmbientLight/>
* RTF API REF ?
* color "#FF0000"
* influenceBitMask "0x1"
* intensity 1000
* temperature "6500K"

[Reference](https://docs.viromedia.com/docs/viroambientlight)

#### DirectionalLight
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

#### OmniLight
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

#### Shadows
Viro renders shadows by shadow mapping, a technique where the silhouettes of objects are rendered in an image, and this image is then reprojected on the screen. Viro generates shadows for all lights whose castsShadow property is set to true.

Shadows are particularly important for AR, as they provide a visual clue to the real-world surface on which a virtual object rests. However, since casting shadows involves re-rendering the scene multiple times, it comes at a performance cost.

Shadows are only supported for directional lights and spotlights.

[Reference](https://docs.viromedia.com/docs/3d-scene-lighting#shadows)

### Camera elements
The camera of the scene in augmented reality is modified by the camera of the phone.
In Virtual Reality it can be the movements of the head
The framing of your animation depends on the user's behavior.

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

[Reference](https://docs.viromedia.com/docs/virocamera)

#### OrbitCamera
* VIRO API REF <ViroOrbitCamera/>
* RTF API REF ?
* position [x,y,z]
* focalPoint [x,y,z]
* active true
* fielOfView 90

[Reference](https://docs.viromedia.com/docs/viroorbitcamera)

### Decor elements
#### Sky
* RTF API REF ?

[Reference]

#### Grid
* RTF API REF ?

[Reference]

### Object type elements
Viro supports loading 3D models in FBX, GLTF and OBJ formats. Viro will load the geometry, textures and lighting settings from the file. For FBX, Viro will additionally load all installed skeletal animations. OBJ files are loaded directly by setting the source attribute of <Viro3DObject>, while FBX files must be converted to Viro's own VRX format.

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

[Reference](https://docs.viromedia.com/docs/virobox)

### 3D Objects

Objects need light to be visible !

#### .obj file
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

#### .fbx file
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

#### .gltf file
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

#### .vrx file
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

### Texture elements
#### image texture

[Reference]

#### video texture

[Reference]

### Particle elements

[Reference]

### Audio elements
#### main audio

[Reference] ###

#### spatial audio

[Reference]

### Video type elements

[Reference]

### Image type elements

[Reference]

### Group elements
#### Node
* VIRO API REF <ViroNode/>
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

[Reference]

Translated with www.DeepL.com/Translator (free version)
