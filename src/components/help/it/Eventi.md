# Eventi
Realtà aumentata, realtà virtuale, questi nuovi media obbediscono a semplici eventi nel corso di un'animazione.

## Eventi della scena
Una scena ha almeno 5 eventi:

### onStart
Questo evento viene eseguito quando l'animazione inizia

### onEnterStage
Questo evento viene eseguito subito dopo onStart, è il posto ideale per un'animazione di entrata.

### onMain
Questo evento viene eseguito subito dopo onEnterStage, è il posto per l'animazione principale, è anche dove puoi aggiungere eventi opzionali come onGpsMatch o onPictureMatch

### onLeaveStage
Questo evento viene eseguito subito dopo onMain, è il posto ideale per un'animazione di uscita

### onEnd
Questo evento si svolge alla fine della scena

## Eventi opzionali
Si tratta di eventi che aggiungono interattività e dinamismo alla vostra scena:
Vengono normalmente riprodotti all'interno dell'evento onMain.

### onPlaneMatch
Questa opzione permette di cercare con la fotocamera del telefono una superficie piana (verticale o orizzontale) è necessario indicare anche le dimensioni reali della superficie in questione.
Una volta trovata la superficie piatta, un'animazione può essere riprodotta.

### onPictureMatch
Questa opzione permette di cercare con la fotocamera del telefono su una superficie piana (verticale o orizzontale) un'immagine o una foto.
Una volta che l'immagine è stata rilevata, un'animazione può essere riprodotta.
C'è uno strumento per testare il tasso di riconoscimento dell'immagine da parte di arCore, il suo utilizzo è integrato nell'applicazione.

### onObjectMatch
Questa opzione permette di cercare con la fotocamera del telefono un oggetto in formato obj e di specificare le sue dimensioni reali
NB: funziona bene su ios e arKit, nessuna implementazione su arCore

### onGpsMatch
Questa opzione permette di attivare un'animazione quando il gps del telefono corrisponde a una posizione georeferenziata.

## Eventi per elementi di scena
Allo stesso modo, ogni oggetto o elemento nella scena ha  
