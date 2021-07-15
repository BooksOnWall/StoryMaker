## Empieza aquí
StageMaker permite crear animaciones de Realidad Aumentada en 2D o 3D que se pueden ver en una aplicación móvil creada con react-native y react-viro.

Este sitio web es una aplicación gratuita, es libre de registrarse y puede crear, publicar y ver su animación en su móvil.

StageMaker toma la idea de [React Three Editable](https://github.com/AndrewPrifer/react-three-editable) de utilizar un formato abierto r3f para pasar escenas, eventos, objetos y parámetros de animación a la aplicación móvil.

### Realidad Aumentada

Sin embargo, aunque react-viro nos permita manejar los dos motores 3D de arkit (Apple) y arCore (Google), necesitamos un formato que nos permita recodificar las escenas y las animaciones de una forma compatible con:

* Threejs | ReactThreeFiber para la aplicación que permite la edición web de escenas
* ReactViro | arKit | arCore

Así que hay opciones y comandos que sólo están disponibles para Apple o Google, bien porque no están implementados en arKit o arCore, o porque aún no se han implementado en React-viro.   

### Realidad virtual

React-viro también permite utilizar los motores 3D de los teléfonos para la realidad virtual, se les propondrá pronto en la configuración de las escenas de los parámetros y opciones dedicadas a esta tarea.

### Eventos, capas y línea de tiempo

StageMaker funciona dividiendo las animaciones en otras más pequeñas que se ejecutan en eventos específicos.

Para cada evento tendrás:

* una lista de elementos (cámara, luz, objeto 3D, sonido, textura...)   
* Una línea de tiempo en la que se pueden ajustar todos los elementos y definir y configurar los puntos clave.
* un reproductor de animación para reproducir y pausar la animación eligiendo diferentes modelos de renderizado 3D  

### Documentación del usuario

* [Eventos](Eventos)
* [Capas](Capas)
* [Timeline](Línea de tiempo)
* [Opciones](Opciones)
* [Artículos](Artículos)
* [Traducir](Traducir)
* [Configurar](Configurar)
* [Save](Guardar)
* [Duplicado](Duplicado)
* [Publicar](Publicar)
* [Acción](Acción)
* [Contribuir](Contribuir)

### Developer documentation

### Fuentes
https://git.booksonwall.art
https://github/booksonwall
https://gitlab.com/booksonwall

### Licencia
afferoGPL para el código fuente de las aplicaciones
Creatividad común para los contenidos
