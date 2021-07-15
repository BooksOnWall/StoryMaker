## Elementi
Alcuni elementi, come gli sfondi, i cieli, ecc., sono perfettamente adatti alla realtà virtuale e non alla realtà aumentata.
Va notato che il rendering degli elementi dipende dai motori di rendering 3D (webgl per StageMaker, arKit per ios, arCore per android).


### Elementi di tipo leggero
#### SpotLight

* posizione [x,y,z]
* colore "#777777"
* direzione [x,y,z]
* attenuazioneStartDistance 5
* attenuazioneFineDistanza 10
* innerAngle 5
* outerAngle 20

#### AmbientLight
* colore "#FF0000"

#### DirectionalLight
* colore "#FFF"
* direzione

#### OmniLight
* colore "#FFF"
* posizione [x,y,z]
* attenuazioneStartDistance 5
* attenuazioneFineDistanza 10

#### Ombre
Viro rende le ombre tramite shadow mapping, una tecnica in cui le sagome degli oggetti sono rese in un'immagine, e questa immagine viene poi riprodotta sullo schermo. Viro genera ombre per tutte le luci la cui proprietà castsShadow è impostata a true.

Le ombre sono particolarmente importanti per l'AR, in quanto forniscono un indizio visivo della superficie del mondo reale su cui è appoggiato un oggetto virtuale. Tuttavia, poiché il lancio di ombre implica un nuovo rendering della scena diverse volte, ha un costo in termini di prestazioni.

Le ombre sono supportate solo per le luci direzionali e i riflettori.

[Riferimento](https://docs.viromedia.com/docs/3d-scene-lighting#shadows)

### Elementi della macchina fotografica
La fotocamera della scena in realtà aumentata è modificata dalla fotocamera del telefono.
Nella realtà virtuale possono essere i movimenti della testa
L'inquadratura della vostra animazione dipende dal comportamento dell'utente.

#### telecamera di default

### Elementi di tipo decorativo
#### Cielo

#### Griglia


### Elementi dell'oggetto
Viro supporta il caricamento di modelli 3D nei formati FBX, GLTF e OBJ. Viro caricherà la geometria, le texture e le impostazioni di illuminazione dal file. Per FBX, Viro caricherà inoltre tutte le animazioni scheletriche installate. I file OBJ vengono caricati direttamente impostando l'attributo source di <Viro3DObject>, mentre i file FBX devono essere convertiti nel formato VRX di Viro.

#### Mesh

#### File .obj

#### file .fbx

#### File .gltf

#### File .vrx

### Elementi della struttura
#### immagine texture

#### video texture

### Elementi di particelle

### Elementi audio
#### audio principale
#### spazializzazione audio

### Elementi di tipo video

### Elementi di tipo immagine

### Elementi del gruppo
