## Elementos
Os elementos são objectos (câmaras de luz, objectos 3D, sons, vídeos, texturas, geradores de partículas...) que são adicionados durante um evento e que compõem uma animação.


Alguns elementos, tais como fundos, céus, etc. são perfeitamente adequados para a realidade virtual e não para a realidade aumentada.
Deve-se notar que a renderização dos elementos depende dos motores de renderização 3D (webgl para StageMaker, arKit para ios, arCore para andróide).


### Elementos relâmpagos
#### Ambiente de relâmpagos
* VIRO API REF <ViroLightingEnvironment/>
* RTF API REF ?
* fonte uri: "http://example.org/myimage.hdr" | require('./myimage.hdr')
*OnLoadStart func
* onLoadEnd func
* onError func

[Referência](https://docs.viromedia.com/docs/virolightingenvironment)

#### SpotLight:
* VIRO API REF <ViroSpotLight/>
* RTF API REF ?
* posição [x,y,z]
* cor "#77777777"
* direcção [x,y,z]
* atenuaçãoStartDistance 5
* atenuaçãoEndDistance 10
* innerAngle 5
* Ângulo exterior 20

[Referência](https://docs.viromedia.com/docs/virospotlight1)

#### AmbientLight
* VIRO API REF <ViroAmbientLight/>
* RTF API REF ?
* cor "#FF0000"
* influenceBitMask "0x1"
* intensidade 1000
* temperatura "6500K

[Referência](https://docs.viromedia.com/docs/viroambientlight)

#### DirectionalLight
* VIRO API REF <ViroDirectionalLight/>
* RTF API REF ?
* posição [x,y,z]
* cor "#FFF"
* direcção [x,y,z]
* castShadow true
* influenceBitMask "0x1
* intensidade 1000
* SombraBias 0.005
* shadowFarZ 20
* shadowNearZ 0.1
*SombraOrthographicSize 20
* SombraOrtografiaPosição [x,y,z] * SombraMapaSize
*SombraMapSize 1024
* shadowOpacity 1.0
* temperatura "6500K

[Referência](https://docs.viromedia.com/docs/virodirectionallight-1)

#### OmniLight
* RTF API REF ?
* VIRO API REF <ViroOmniLight/>
* posição [x,y,z]
* cor "#FFF"
* posição [x,y,z]
* atenuaçãoStartDistance 5
* atenuaçãoEndDistance 10
* influenceBitMask "0x1
* intensidade 1000
* temperatura "6500K

[Referência](https://docs.viromedia.com/docs/viroomnilight)

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
* VIRO API REF <ViroCamera/>
RTF API REF <Câmera/> * posição [x,y,z
* posição [x,y,z]
* rotação [x,y,z]
* verdade activa
* campoOfView 90
* animação
 * nome: anim1,
 * atraso: 800,
 * loop: true,
 * onStart: func,
 * onfinish: func,
 *funcionar verdade


[Referência](https://docs.viromedia.com/docs/virocamera)

#### OrbitCamera
* VIRO API REF <ViroOrbitCamera/>
* RTF API REF <PerspectiveCamera />
* posição [x,y,z]
* ponto focal [x,y,z]
* verdade activa
* campoOfView 90

[Referência](https://docs.viromedia.com/docs/viroorbitcamera)

### Elementos de decoração
#### Céu
* RTF API REF <Sky />
* distância 450000
* sunPosition [x,y,z]
* azimute 0,25
* ...

[Referência](https://github.com/pmndrs/drei#sky)

#### Estrelas
* RTF API REF <Stars />
* raio 100
* profundidade 50
* contar 5000
* factor 4
* saturação 0
* desvanecer verdadeiro

[Referência](https://github.com/pmndrs/drei#stars)

#### Grelha
* RTF API REF <gridHelper />
* args [10, 10, 'branco', 'cinzento']
[Referência](https://threejs.org/docs/#api/en/helpers/GridHelper)

### Elementos do tipo de objecto
O Viro suporta o carregamento de modelos 3D nos formatos FBX, GLTF e OBJ. Viro irá carregar a geometria, texturas e configurações de iluminação do ficheiro. Para FBX, Viro irá carregar adicionalmente todas as animações esqueléticas instaladas. Os ficheiros OBJ são carregados directamente através da definição do atributo fonte de <Viro3DObject>, enquanto que os ficheiros FBX devem ser convertidos para o formato VRX do próprio Viro.

#### Caixa
* VIRO API REF <ViroBox/>
* RTF API REF <mesh />
* posição [x,y,z]
* altura 2
* comprimento 2
* largura 2
* materiais ["boxside"]
* animação
 * nome: anim1,
 * atraso: 800,
 * loop: true,
 * onStart: func,
 * onfinish: func,
 *funcionar verdade
* highAccuracyEvents true
* IgnorarEventarManipulação falsa
* lightReceivingBitMask .5
* dragPlaneta
 * planePoint
 * planeNormal
 * maxDIstance
* ...

[Referência](https://docs.viromedia.com/docs/virobox)

### Objectos 3D

Os objectos precisam de luz para serem visíveis!

#### ficheiro .obj
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* posição [x,y,z]
* fonte requer('./myObbject.obj')
* recursos [...texturas]
* highAccuracyEvents true
* escala [x,y,z] * rotação [x,y,z] * rotação [x,y,z] * rotação [x,y,z] * rotação [x,y,z] * rotação [x,y,z
* rotação[x,y,z]
* tipo "OBJ
* TransformBehaviors ["outdoor"]

#### ficheiro .fbx
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* posição [x,y,z]
* fonte requer('./myObbject.fbx')
* recursos [...texturas]
* highAccuracyEvents true
* escala [x,y,z]
* rotação[x,y,z]
* tipo 'FBX
* TransformBehaviors ["outdoor"]

#### ficheiro .gltf
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* posição [x,y,z]
* fonte requer('./myObbject.gltf')
* recursos [...texturas]
* highAccuracyEvents true
* escala [x,y,z]
* rotação[x,y,z]
* tipo "GLTF
* TransformBehaviors ["outdoor"]

#### ficheiro .vrx
* VIRO API REF <Viro3DObject/>
* RTF API REF ?
* posição [x,y,z]
* fonte requer('./myObbject.vrx')
* recursos [...texturas]
* highAccuracyEvents true
* escala [x,y,z]
* rotação[x,y,z]
* tipo 'VRX
* TransformBehaviors ["outdoor"]

### Elementos de textura
#### textura da imagem
* VIRO API REF <ViroMaterials/>
* ambientOcclusionTextura de textura
* blendMode ['None', 'Alpha', 'Add', 'Subtract', 'Multiply', 'Screen']
* bloomThreshold ['Nenhum', 'Vermelho', 'Verde', 'Azul', 'Alfa', 'Todos']
* colorWriteMask ['None', 'Red', 'Green', 'Blue', 'Alpha', 'All']
* cullMode ['Nenhum', 'Atrás', 'Frente']
* diffuseColor
* chromaKeyFilteringColor
* diffuseIntensity 1.0
* diffuseTexture uri: "http://example.org/myimage.png" | require('./image.png')
* Modelo de iluminação ['Phong', 'Blinn', 'Lambert', 'Constant', 'PBR']
* ampliaçãoFiltro ['Mais próximo', 'Linear']
* metalness 1
* metalnessTextura de textura
* minificationFilter ['Nearest', 'Linear']
* mipFilter ['Nearest', 'Linear']
* normalTexture uri: "http://example.org/myimage.png" | require('./image.png')
* lê-seFromDepthBuffer true
* rugosidade 1
* roughnessTexture uri: "http://example.org/myimage.png" | require('./image.png')
* brilhantismo 1
* specularTexture uri: "http://example.org/myimage.png" | require('./image.png')
* embrulho ['Clamp', 'Repeat', 'Mirror']
* embrulho ['Clamp', 'Repetir', 'Mirror']
* escreveToDepthBuffer true

[Referência](https://docs.viromedia.com/docs/materials)

#### textura de vídeo
* VIRO API REF <ViroMaterialVideo />
* RTF API REF ?
* material
* pausou verdadeiro
* loop true
* mudo verdade
* onBufferEnd event
* onError evento
* evento onBufferStart
*evento final
* onUpdateTime event
* volume 0.8

[Referência](https://docs.viromedia.com/docs/viromaterialvideo)

### Elementos do tipo partícula
#### ParticleEmitter
* VIRO API REF <ViroParticleEmitter/>
* RTF API REF ?
* posizione [x,y,z]
* durata 2000
* visibile vero
* ritardo 0
* run true
* loop true
* fixedToEmitter true
* immagine
 * source require('./particle_snow.png')
 * altezza 0.1
 * larghezza 0.1
 * bloomThreshold 1.0
* spawnBehavior
 * particleLifetime [4000,4000]
 * emissionRatePerSecond [150, 200]
 * spawnVolume
  * forma "box"
  * params [20, 1, 20]
  * spawnOnSurface false
 * maxParticles 800
* particleAppearance
 * opacità
  * initialRange [0, 0]
  * fattore "tempo"
  * interpolazione [{valore finale:0.5, intervallo:[0,500]}, {valore finale:1.0, intervallo:[4000,5000]}]
 * rotazione
  * initialRange [0, 360]
  * fattore: "tempo",
  * interpolazione:[{endValue:1080, intervallo:[0,5000]}]
 * scala
  * initialRange [[5,5,5], [10,10,10]]
  * fattore "tempo"
  * interpolazione [{endValue:[3,3,3], intervallo:[0,4000]}, {endValue:[0,0,0], intervallo:[4000,5000]}]
* particlePhysics
 * velocità
  * initialRange [[-2,-.5,0], [2,-3.5,0]]


[Référence](https://docs.viromedia.com/docs/viroparticleemitter)

### Elementi di tipo audio
#### audio principale

[Référence]

#### spazializzazione audio

[Riferimento]

### Elementi di tipo video

[Riferimento]

### Elementi di tipo immagine

[Riferimento]()

### Elementi di tipo gruppo
#### Nodo
* VIRO API REF <ViroNode/>
* RTF API REF <group />
* posizione [x,y,z]
* Altezza 2
* lunghezza 2
* larghezza 2
* materiali ["boxside"]
* forma dell'animazione [{
 * nome: anim1,
 * ritardo: 800,
 * loop: true,
 * onStart: func,
 * onfinish: func,
 * run true
* highAccuracyEvents true
*ignoreEventHandling false
* lightReceivingBitMask .5
* dragPlane
 * planePoint
 * planeNormal
 * maxDIstance
* ...

[Riferimento]
