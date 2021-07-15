## Elements
Some elements, such as backgrounds, a sky can be perfectly suitable for virtual reality and not for augmented reality.
It should be noted that the rendering of elements is dependent on 3D rendering engines (webgl for StageMaker, arKit for ios, arCore for android).


### Light type elements
#### SpotLight

* position [x,y,z]
* color "#777777"
* direction [x,y,z]
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
Viro renders shadows by shadow mapping, a technique where the silhouettes of objects are rendered in an image, and this image is then reprojected on the screen. Viro generates shadows for all lights whose castsShadow property is set to true.

Shadows are particularly important for AR, as they provide a visual clue to the real-world surface on which a virtual object rests. However, since casting shadows involves re-rendering the scene multiple times, it comes at a performance cost.

Shadows are only supported for directional lights and spotlights.

[Reference](https://docs.viromedia.com/docs/3d-scene-lighting#shadows)

### Camera elements
The camera of the scene in augmented reality is modified by the camera of the phone.
In Virtual Reality it can be the head movements
The framing of your animation depends on the user's behavior.

#### default camera

### Decor type elements
#### Sky

#### Grid


### Object elements
Viro supports loading 3D models in FBX, GLTF and OBJ formats. Viro will load the geometry, textures and lighting settings from the file. For FBX, Viro will additionally load all installed skeletal animations. OBJ files are loaded directly by setting the source attribute of <Viro3DObject>, while FBX files must be converted to Viro's own VRX format.

#### Mesh

#### .obj file

#### .fbx file

#### .gltf file

#### .vrx file

### Texture elements
#### image texture

#### video texture

### Particle elements

### Audio elements
#### main audio
#### audio spatialization

### Video type elements

### Image type elements

### Group type elements
