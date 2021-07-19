# Start here
StageMaker allows you to create 2D or 3D augmented reality animations that can be viewed on a mobile application created with react-native and react-viro.

This website is a free application, you are free to register and can create, publish and watch your animation on your mobile.

StageMaker uses the idea put into practice in [React Three Editable](https://github.com/AndrewPrifer/react-three-editable) to use an open r3f format to transmit to the mobile application the scenes, events, objects and parameters of the animations.

## Augmented reality

However, even if react-viro allows to drive the two 3D engines of arkit (Apple) and arCore (Google), we need a format that allows us to recode scenes and animations in a way that is supported by:

* Threejs | ReactThreeFiber for the application that allows web editing of scenes
* ReactViro | arKit | arCore

There are options and commands that are only available for Apple or Google, either because they are not implemented in arKit or arCore, or because they have not yet been implemented in React-viro.   

## Virtual reality

React-viro also allows to use the 3D engines of telephones for virtual reality, they will be soon proposed in the configuration of scenes parameters and options dedicated to this task.

## Events, Layers and Timeline

StageMaker works by splitting the animation sequence into smaller animations executed at specific events.

For each event you will have:

* a list of elements (camera, light, 3D object, sound, texture ...)   
* a timeline in which all elements can be adjusted and key points defined and configured.
* an animation player to play and pause the animation by choosing different 3D rendering models  

## User documentation

* [Events](Events)
* [Layers](Layers)
* [Timeline](Timeline)
* [Options](Options)
* [Items](Items)
* [Translate](Translate)
* [Configure](Configure)
* [Save](Save)
* [Duplicate](Duplicate)
* [Publish](Publish)
* [Share](Share)
* [Contribute](Contribute)

## Developer documentation

### Sources

https://git.booksonwall.art

https://github/booksonwall

https://gitlab.com/booksonwall

### License
* afferoGPL for the source code of the applications

* Creative common for the contents
