# Eventos
Realidad Aumentada, Realidad Virtual, estos nuevos medios obedecen a simples eventos durante el curso de una animación.

## Eventos de la escena
Una escena tiene al menos 5 eventos:

### onStart
Este evento se ejecuta cuando su animación comienza

### onEnterStage
Este evento se ejecuta justo después de onStart, es el lugar ideal para una animación de entrada.

### onMain
Este evento se ejecuta justo después de onEnterStage, es el lugar para la animación principal, también es donde puedes añadir eventos opcionales como onGpsMatch o onPictureMatch

### onLeaveStage
Este evento se ejecuta justo después de onMain, es el lugar ideal para una animación de salida

### onEnd
Este evento se desarrolla al final de la escena

## Eventos opcionales
Son eventos que añaden interactividad y dinamismo a tu escena:
Normalmente se reproducen dentro del evento onMain.

### onPlaneMatch
Esta opción le permite buscar con la cámara del teléfono una superficie plana (vertical u horizontal) también debe indicar las dimensiones reales de la superficie en cuestión.
Una vez encontrada la superficie plana, se puede reproducir una animación.

### onPictureMatch
Esta opción permite buscar con la cámara del teléfono en una superficie plana (vertical u horizontal) una imagen o foto.
Una vez detectada la imagen, se puede reproducir una animación.
Existe una herramienta para probar la tasa de reconocimiento de la imagen por parte de arCore, su uso está integrado en la aplicación.

### onObjectMatch
Esta opción permite buscar con la cámara del teléfono un objeto en formato obj y especificar sus dimensiones reales
NB: Funciona bien en ios y arKit, no se implementa en arCore

### onGpsMatch
Esta opción permite activar una animación cuando el gps del teléfono coincide con una posición georreferenciada.

## Eventos para elementos de la escena
Asimismo, cada objeto o elemento de la escena tiene  
