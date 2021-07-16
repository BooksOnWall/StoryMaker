## Elementos
Alguns elementos, tais como fundos, céus, etc., são perfeitamente adequados para a realidade virtual e não para a realidade aumentada.
Deve-se notar que a renderização de elementos depende dos motores de renderização 3D (webgl para StageMaker, arKit para ios, arCore para andróide).


### Elementos relâmpagos
#### Ambiente de relâmpagos
* VIRO API REF <Virolightingenvironment/>
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
* forma de animação [{\i1}
** nome: anim1,
** atraso: 800,
** loop: verdadeiro,
** onStart: func,
** onfinish: func,
** correr verdadeiro
  }]

[Referência](https://docs.viromedia.com/docs/virocamera)

#### OrbitCamera
* VIRO API REF <ViroOrbitCamera/>
* RTF API REF ?
* posição [x,y,z]
* ponto focal [x,y,z]
* verdade activa
* campoOfView 90

[Referência](https://docs.viromedia.com/docs/viroorbitcamera)

### Elementos de decoração
#### Céu
* RTF API REF ?

[Referência]

#### Grelha
* RTF API REF ?

[Referência]

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
* forma de animação [{\i1}
** nome: anim1,
** atraso: 800,
** loop: verdadeiro,
** onStart: func,
** onfinish: func,
** correr verdadeiro
  }]
* highAccuracyEvents true
* IgnorarEventarManipulação falsa
* lightReceivingBitMask .5
* forma de dragPlaneta {
** planePoint
** planeNormal
** maxDIstance
  }
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

[Referência]

#### textura de vídeo

[Referência]

### Elementos de partículas

[Referência] ####

### Elementos de áudio
#### áudio principal

[Referência] ####

#### áudio espacial

[Referência]

### Elementos do tipo vídeo

[Referência]

### Elementos do tipo de imagem

[Referência]

### Artigos de grupo
#### Nó
* VIRO API REF <ViroNode/>
* posição [x,y,z]
* altura 2
* comprimento 2
* largura 2
* materiais ["boxside"]
* forma de animação [{\i1}
  ** nome: anim1,
  ** atraso: 800,
  ** loop: verdadeiro,
  ** onStart: func,
  ** onfinish: func,
  ** correr verdadeiro
  }]
* highAccuracyEvents true
* IgnorarEventarManipulação falsa
* lightReceivingBitMask .5
* forma de dragPlaneta {
  ** planePoint
  ** planeNormal
  ** maxDIstance
  }
* ...

[Referência]
