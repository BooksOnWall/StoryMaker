## Comece aqui
StageMaker permite-lhe criar animações 2D ou 3D de Realidade Aumentada que podem ser vistas numa aplicação móvel criada com react-native e react-viro.

Este website é uma aplicação gratuita, é livre de se registar e pode criar, publicar e ver a sua animação no seu telemóvel.

StageMaker tira a ideia de [React Three Editable](https://github.com/AndrewPrifer/react-three-editable) de usar um formato r3f aberto para passar cenas, eventos, objectos e parâmetros de animação para a aplicação móvel.

### Realidade aumentada

Contudo, mesmo que o react-viro nos permita conduzir os dois motores 3D de arkit (Apple) e arCore (Google), precisamos de um formato que nos permita recodificar cenas e animações de uma forma que seja suportada por:

* Threejs | ReactThreeFiber para a aplicação que permite a edição web de cenas
* ReactViro | arKit | arCore

Assim, existem opções e comandos que só estão disponíveis para a Apple ou Google, ou porque não são implementados no arKit ou arCore, ou porque ainda não foram implementados no React-viro.   

### Realidade virtual

React-viro também permite utilizar os motores 3D dos telefones para a realidade virtual, em breve ser-lhe-ão propostos na configuração das cenas dos parâmetros e opções dedicadas a esta tarefa.

#### Eventos, Camadas e Linha do Tempo

O StageMaker trabalha dividindo as animações em animações mais pequenas que são executadas em eventos específicos.

Para cada evento que terá:

* uma lista de elementos (câmara, luz, objecto 3D, som, textura ...)   
* Uma linha temporal na qual todos os elementos podem ser ajustados e os pontos-chave definidos e configurados.
* um leitor de animação para reproduzir e pausar a animação, escolhendo diferentes modelos de renderização 3D  

### Documentação do utilizador

* [Eventos](Eventos)
* [Camadas](Camadas)
* [Linha do tempo](Linha do tempo)
* [Opções](Opções)
* [Artigos](Artigos)
* [Traduzir](Traduzir)
* [Configurar](Configurar)
* [Guardar](Guardar)
* [Duplicado](Duplicado)
* [Publish](Publish)
* [Partilhar](Partilhar)
* [Contribuir](Contribuir)

#### Documentação do desenvolvedor

### Fontes
https://git.booksonwall.art
https://github/booksonwall
https://gitlab.com/booksonwall

#### Licença
afferoGPL para o código fonte das aplicações
Criativo comum para o conteúdo
