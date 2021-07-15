## Eventos
Realidade Aumentada, Realidade Virtual, estes novos meios de comunicação obedecem a eventos simples durante o curso de uma animação.

### Eventos da cena
Uma cena tem pelo menos 5 eventos:

#### onStart
Este evento é executado quando a sua animação começa

#### onEnterStage
Este evento é executado logo após o onStart, é o local ideal para uma animação de entrada.

#### onMain
Este evento decorre logo a seguir ao onEnterStage, é o local para a animação principal, é também onde pode adicionar eventos opcionais como onGpsMatch ou onPictureMatch

#### onLeaveStage
Este evento é executado logo a seguir ao onMain, é o local ideal para uma animação de saída

#### onEnd
Este evento decorre no final da cena

### Eventos opcionais
Estes são eventos que acrescentam interactividade e dinamismo à sua cena:
São normalmente jogados dentro do evento onMain.

#### onPlaneMatch
Esta opção permite-lhe procurar com a câmara do telefone uma superfície plana (vertical ou horizontal) e deve também indicar as dimensões reais da superfície em questão.
Uma vez encontrada a superfície plana, uma animação pode ser reproduzida.

#### onPictureMatch
Esta opção permite-lhe procurar com a câmara do telefone numa superfície plana (vertical ou horizontal) por uma imagem ou fotografia.
Uma vez detectada a imagem, uma animação pode ser reproduzida.
Existe uma ferramenta para testar a taxa de reconhecimento da imagem pelo arCore, a sua utilização é integrada na aplicação.

#### onObjectMatch
Esta opção permite pesquisar com a câmara do telefone um objecto em formato obj e especificar as suas dimensões reais
NB: Funciona bem em ios e arKit, sem implementação em arCore

#### onGpsMatch
Esta opção permite-lhe accionar uma animação quando o gps do seu telefone corresponde a uma posição georeferenciada.

### Eventos para elementos da cena
Da mesma forma, cada objecto ou elemento da cena tem  
