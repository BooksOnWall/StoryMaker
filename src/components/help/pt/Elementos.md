## Elementos
Alguns elementos, tais como fundos, céus, etc., são perfeitamente adequados para a realidade virtual e não para a realidade aumentada.
Deve-se notar que a renderização de elementos depende dos motores de renderização 3D (webgl para StageMaker, arKit para ios, arCore para andróide).


### Elementos de tipo leve
#### SpotLight

* posição [x,y,z]
* cor "#77777777"
* direcção [x,y,z]
* atenuaçãoStartDistance 5
* atenuaçãoEndDistance 10
* innerAngle 5
* Ângulo exterior 20

#### AmbientLight
* cor "#FF0000"

#### DirectionalLight
* cor "#FFF"
* direcção

#### OmniLight
* cor "#FFF"
* posição [x,y,z]
* atenuaçãoStartDistance 5
* atenuaçãoEndDistance 10

#### Sombras
O Viro faz sombras por mapeamento de sombras, uma técnica em que as silhuetas dos objectos são renderizadas numa imagem, e esta imagem é depois reprojectada no ecrã. O Viro gera sombras para todas as luzes cujo castsShadow propriedade está definida para true.

As sombras são particularmente importantes para a RA, pois fornecem uma pista visual para a superfície do mundo real sobre a qual um objecto virtual está a repousar. No entanto, uma vez que a fundição de sombras envolve a renderização da cena várias vezes, tem um custo de performance.

As sombras só são suportadas para luzes direccionais e holofotes.

[Referência](https://docs.viromedia.com/docs/3d-scene-lighting#shadows)

### Elementos da câmara
A câmara da cena em realidade aumentada é modificada pela câmara do telefone.
Em Realidade Virtual podem ser os movimentos da cabeça
O enquadramento da sua animação depende do comportamento do utilizador.

#### câmara predefinida

### Elementos do tipo decoração
#### Céu

#### Grelha


### Elementos do objecto
O Viro suporta o carregamento de modelos 3D nos formatos FBX, GLTF e OBJ. Viro irá carregar a geometria, texturas e configurações de iluminação do ficheiro. Para FBX, Viro irá carregar adicionalmente todas as animações esqueléticas instaladas. Os ficheiros OBJ são carregados directamente através da definição do atributo fonte de <Viro3DObject>, enquanto que os ficheiros FBX devem ser convertidos para o formato VRX do próprio Viro.

#### Malha

#### ficheiro .obj

#### ficheiro .fbx

#### ficheiro .gltf

#### ficheiro .vrx

### Elementos de textura
#### textura da imagem

#### textura de vídeo

### Elementos de partículas

### Elementos de áudio
#### áudio principal
#### espacialização áudio

### Elementos do tipo vídeo

### Elementos do tipo de imagem

### Elementos do grupo
