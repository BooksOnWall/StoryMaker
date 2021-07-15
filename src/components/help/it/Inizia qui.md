## Inizia qui
StageMaker permette di creare animazioni di Realtà Aumentata 2D o 3D che possono essere visualizzate su un'applicazione mobile creata con react-native e react-viro.

Questo sito è un'applicazione gratuita, sei libero di registrarti e puoi creare, pubblicare e guardare la tua animazione sul tuo cellulare.

StageMaker prende l'idea da [React Three Editable](https://github.com/AndrewPrifer/react-three-editable) di usare un formato aperto r3f per passare scene, eventi, oggetti e parametri di animazione all'applicazione mobile.

### Realtà aumentata

Tuttavia, anche se react-viro ci permette di guidare i due motori 3D di arkit (Apple) e arCore (Google), abbiamo bisogno di un formato che ci permetta di ricodificare scene e animazioni in un modo che sia supportato da:

* Threejs | ReactThreeFiber per l'applicazione che permette la modifica web delle scene
* ReactViro | arKit | arCore

Quindi ci sono opzioni e comandi che sono disponibili solo per Apple o Google, o perché non sono implementati in arKit o arCore, o perché non sono ancora stati implementati in React-viro.   

### Realtà virtuale

React-viro permette anche di utilizzare i motori 3D dei telefoni per la realtà virtuale, saranno presto proposti nella configurazione delle scene dei parametri e delle opzioni dedicate a questo compito.

### Events, Layers and Timeline

StageMaker funziona dividendo le animazioni in animazioni più piccole che vengono eseguite in eventi specifici.

Per ogni evento avrete:

* una lista di elementi (telecamera, luce, oggetto 3D, suono, texture ...)   
* Una linea temporale in cui tutti gli elementi possono essere regolati e i punti chiave definiti e configurati.
* un lettore di animazione per riprodurre e mettere in pausa l'animazione scegliendo diversi modelli di rendering 3D  

### Documentazione utente

* [Eventi](Eventi)
* [Livelli](Livelli)
* [Timeline](Timeline)
* [Opzioni](Opzioni)
* [Voci](Voci)
* [Traduci](Traduci)
* [Configurare](Configurare)
* [Salva](Salva)
* [Duplicato](Duplicato)
* [Pubblicare](Pubblicare)
* [Quota](Quota)
* [Contributo](Contributo)

### Documentazione per sviluppatori

### Fonti
https://git.booksonwall.art
https://github/booksonwall
https://gitlab.com/booksonwall

### Licenza
afferoGPL per il codice sorgente delle applicazioni
Creativo comune per il contenuto
