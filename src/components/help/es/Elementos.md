## Elementos
Algunos elementos, como los fondos, los cielos, etc., son perfectamente adecuados para la realidad virtual y no para la realidad aumentada.
Hay que tener en cuenta que el renderizado de los elementos depende de los motores de renderizado 3D (webgl para StageMaker, arKit para ios, arCore para android).


### Elementos de tipo lumínico
#### SpotLight

* posición [x,y,z]
* color "#777777"
* dirección [x,y,z]
* attenuationStartDistance 5
* attenuationEndDistance 10
* innerAngle 5
* outerAngle 20

#### AmbientLight
* color "#FF0000"

#### DirectionalLight
* color "#FFF"
* dirección

#### OmniLight
* color "#FFF"
* posición [x,y,z]
* attenuationStartDistance 5
* attenuationEndDistance 10

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

### Elementos de tipo decorativo
#### Cielo

#### Rejilla


### Elementos del objeto
Viro soporta la carga de modelos 3D en formatos FBX, GLTF y OBJ. Viro cargará la geometría, las texturas y los ajustes de iluminación del archivo. Para FBX, Viro cargará adicionalmente todas las animaciones esqueléticas instaladas. Los archivos OBJ se cargan directamente estableciendo el atributo source de <Viro3DObject>, mientras que los archivos FBX deben ser convertidos al formato VRX propio de Viro.

#### Malla

#### archivo .obj

#### archivo .fbx

#### archivo .gltf

#### archivo .vrx

### Elementos de textura
#### textura de la imagen

#### textura de vídeo

### Elementos de las partículas

### Elementos de audio
#### audio principal
#### espacialización de audio

### Elementos de tipo vídeo

### Elementos de tipo de imagen

### Elementos del grupo
