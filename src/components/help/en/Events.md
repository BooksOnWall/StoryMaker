# Events
Augmented Reality, Virtual Reality, these new media obey simple events during the course of an animation.

## Events of the scene
A scene has at least 5 events:

### onStart
This event is executed when your animation starts

### onEnterStage
This event is executed just after onStart, it is the ideal place for an entry animation.

### onMain
This event is executed right after onEnterStage, it's the place for the main animation, it's also where you can add optional events like onGpsMatch or onPictureMatch

### onLeaveStage
This event is executed just after onMain, it is the ideal place for an exit animation

### onEnd
This event is executed at the very end of the scene

## Optional events
These are events that add interactivity and dynamism to your scene:
They are normally played inside the onMain event.

### onPlaneMatch
This option allows you to search with the camera of the phone a flat surface (vertical or horizontal) you must also indicate the real dimensions of the surface in question.
Once the flat surface is found, an animation can be played.

### onPictureMatch
This option allows you to search with the phone's camera on a flat surface (vertical or horizontal) for an image or photo. You must also indicate the real dimensions of the surface in question.
Once the image is detected, an animation can be played.
There is a tool to test the recognition rate of the image by arCore, its use is integrated in the application.

### onObjectMatch
This option allows to search with the camera of the phone an object in obj format and to specify its real dimensions
NB: Works well on ios and arKit, no implementation on arCore

### onGpsMatch
This option allows to trigger an animation when the gps of your phone matches a georeferenced position.

## Events for the scene elements
Similarly, each object or element of the scene has events  
