# Changelog (English)
## V2.0.0
We have completely reworked the software, and now it is more stable and has more features.

The software passed from a simple web-based scoreboard to a full desktop application removing all the complications due to the installation of third-party software (Apache, PHP, etc..) and the need for a web server. Also, the application is still compatible with OBS Studio and other streaming software.

All of these changes - along with the new features, new style, and new code base - made the software more stable and easier to use at any resolution and/or PC specifications. All the new features are listed below.
### New Features:
* Revamped the software's look and feel, built with Bootstrap 5:
  * Remade the front-end with a more modern and cleaner style, with great responsiveness and compatibility across devices and screen sizes. You can now easily control the scoreboard from any device that is on the same network or directly from a dock into OBS Studio or other streaming software
  * Remade the overlay with a new modern and cleaner style. Now the overlays are compatible with any resolution.
* Added animations and toggles to show or hide scoreboards (#18)
  * Added a panel on `control-center.html` to turn on/off the scoreboard and trigger the respective animations. Note: if the scoreboard is turned off you can still control the overlays from the control panel but the scoreboard will not be visible.
  * For convenience a reset button has been added to hide all overlays.
* Added new overlays (#19)
  * `umpires.html` for the umpires display divided by roles and ordered as follows: Home Plate, First Base, Second Base, Third Base;
  * `scorers.html` for the scorers display. There is no role distinction, and they are ordered as follows: head scorer, second scorer, third scorer;
  * `commentator.html` for the commentator display;
  * `technicalComment.html` for the technical commentator display.
  * For controlling these overlays, you will have to use the new page `staff.html` where you can change the staff's names and roles.
* Switched from PHP to node.js and socket.io:
  * Improved the communication between the control panel and the scoreboard
  * It is now possible to control the scoreboard from multiple devices at the same time and keeping them always synchronized.
    * As an example, you can have the PC running the game and the scoreboard and control the overlays from your phone or tablet, it's your choice.
    * All the devices must be on the same network and port 2095 (default port) has to be whitelisted on the host PC's firewall.
* Changed the authentication system and licensing system
  * You now need to use your email and password to sign into the control panel. You can register an account by visiting our website at [https://www.fc-software.it/](https://www.fc-software.it/)
  * You can use the software with the demo version for evaluation purposes, but if you want to use it for a real game and stream/record it you need to buy a license for the software by purchasing it on our website.
  * From the page `settings.html` you can now add/remove authorized users to share access to the control panel. (If the user is not registered on our website, they will be invited to create an account).
### Known Bugs:
* As usual, we haven't found any bugs yet. If you find any, please notify us or open an issue on GitHub!

That's it for now, we hope you enjoy the new version of the software and if you have any suggestions or you want to report a bug, please contact us on our website or open an issue on GitHub. Thank you for using our software!
New features will be added in the future, so stay tuned!

## V1.3.1
### New Features:
* Password auth in back-end
* Added Security features and blocked access to private file
### Known Bugs:
* We haven't found any bugs yet. If you find any, please notify us!
## V1.3.0
### New Features:
* Added authentication to the site, the password/tokens can be managed by the page `auth.html.`
  * Dedicated Style `style_auth.css` for `auth.html`
  * The default password is "baseball", is recommended to change before using the software.
  * The password is asked for access into: `auth.html` `admin.html` `admin_obs.html`.
  * A valid token is required to use the API: `update.php` `update_pass.php` `update_token.php` `settings.php`.
* Fixed the bug found on #8
* Some Bugfixes
### Known bugs:
* We haven't found any bugs yet. If you find any, please notify us!
## V1.2.1
### New Features:
* Added administration page
   * Dedicated style `style_obs.css`
   * `Admin_OBS.html` page
### Known bugs:
* Sometimes you don't "free" the bases with `Auto Change Inning`
* We haven't found any bugs yet. If you find any, please notify us!
## V1.2.0
### New Features:
* Added Partials:
  * Dedicated Page `parz.html`
  * Dedicated style `style_parz.css`
  * Variable Inning displayed
  * Visible on `admin.html`
* Added Settings
  * Maximum ining for `parz.html`
* Updated navbar and index
* Converted Data passing
* Fixed Visual Bug
### Known Bugs:
* We haven't found any bugs yet. If you find any, please notify us!
## V1.1.0
### New Features:
* Now we use `fetch()` to get the JSON from the file
  * The file will be downloaded only if updated
  * Improved responsiveness
  * Less connection used
* Added an index page for user redirection and help within the program
* Removed debug messages from the console
* Removed the two dashes as overlays are now present
* Added API for data changes:
  * The API only accepts a valid data format
  * Generates a log where all changes are saved
  * Returns a standard response indicating the changes made
* We've updated the style with:
    * A new look for index.html
    * A navbar for both admin and index pages
    * Fixes for the CSS bugs
    * Popups for README and LICENSE in both admin and index pages
### Known bugs:
* Visual Bugs into `admin.html`
* we haven't find any other bug if you find please advise me
## V1.0.1
### New Features:
* LIVE scoreboard: Now scoreboard updates live
* Pre-game and Post-game overlays used for not leaving blank the camera. Name, colour and score will be displayed (Post-game only).
* Fixed cache with all the files. Now the browser will not cache the files.
* Inning arrow more reactive (before dash had a problem)
* Removed debug log on console
### Known Bugs:
* We haven't found any bugs yet. If you find any, please notify us!
## V1.0.0
### Features:
* Adding, Removing score
* Strike, Ball, Out
* Auto Changing Batter
* Occupation Base
* Auto Inning Reset
* Inning with TOP/BOT
* Change Team name and colour
* FULL reset
### Known Bugs:
* initial cache about ALL BROWSERS (Just repeat the action for 3/4 times and it's gone)
* Scoreboard don't update live yo have to wait minus then 5s
* we don't find any other bug if you find please advise me

# Changelog (Italiano)
## V2.0.0
Abbiamo completamente riscritto il software, e ora è più stabile e ricco di funzionalità.

Il software è passato da un insieme di semplici overlay HTML ad un software desktop completo eliminando tutte le complicazioni dovute all'installazione di software di terze parti (Apache, PHP, ecc.) e alla necessità di un server web. Inoltre, l'applicazione è compatibile con OBS Studio e altri software di streaming.

Tutte queste modifiche - insieme alle nuove funzionalità, al nuovo stile e alla nuova base di codice - hanno reso il software più stabile e facile da usare a qualsiasi risoluzione e / o specifiche del PC. Tutte le nuove funzionalità sono descritte di seguito.
### Nuove Funzioni:
* Cambiato completamente il design del software, realizzato con Bootstrap 5
  * Rifatto il front-end con un design più moderno e pulito, reattivo e compatibile con qualsiasi schermo e dispositivo. Si può ora controllare il tabellone da qualsiasi dispositivo che si trova sulla stessa rete o direttamente da un dock in OBS Studio o altri software di streaming.
  * Cambiato lo stile degli overlay, rendendoli moderni e più puliti. Ora gli overlay sono compatibili con qualsiasi risoluzione.
* Aggiunte animazioni e gestione dei tabelloni (#18)
  * Aggiunto un pannello su `control-center.html` per attivare/disattivare gli overlay, animandone la transizione. Nota: se un overlay è spento, è comunque possibile controllarlo dal pannello di controllo, ma esso non sarà visibile.
  * Per comodità è stato aggiunto un pulsante di reset per nascondere tutti gli overlay.
* Aggiunti nuovi overlay (#19)
  * `umpires.html` per la visualizzazione degli arbitri divisi per ruoli (Casa Base, Prima Base, Seconda Base, Terza Base)
  * `scorers.html` per i classificatori visualizzati senza distinzione di ruoli ma nell'ordine: Capo Classificatore, Secondo Classificatore, Terzo Classificatore
  * `commentator.html` per la visualizzazione del commentatore
  * `technicalComment.html` per la visualizzazione del commentatore tecnico
  * Per controllare questi overlay, potrai utilizzare la nuova pagina `staff.html` da dove potrai cambiare i nomi e i ruoli del personale.
* Passato da PHP a node.js usando la libreria socket.io
  * Migliorata la comunicazione tra il pannello di controllo e il tabellone
  * È possibile controllare il tabellone da più dispositivi contemporaneamente, mantenendoli sincronizzati in tempo reale.
    * Ad esempio, puoi avere il PC che esegue OBS e il tabellone, mentre puoi controllare gli overlay dal tuo telefono o tablet. A te la scelta.
    * Tutti i dispositivi devono essere sulla stessa rete e il firewall del PC host dev'essere configurato in modo tale da abilitare la porta 2095 (porta predefinita).
* Modificato il sistema di autenticazione e il sistema di licenze
  * Per accedere al pannello di controllo, o qualsiasi pagina di amministrazione, è necessario registrarsi sul nostro sito Web [https://www.fc-software.it/](https://www.fc-software.it/) ed accedere poi con le stesse credenziali
  * È possibile utilizzare il software con la versione demo a scopi di valutazione, ma se si desidera usarlo in una partita registrata o trasmessa in streaming è necessario acquistare una licenza per il software, disponibile sul nostro sito Web.
  * Dalla pagina `settings.html` è possibile condividere l'accesso al pannello di controllo, aggiungendo o rimuovendo gli utenti autorizzati tramite la loro email. Se l'utente non è registrato, riceverà un invito per registrarsi sul nostro sito web.
### Bug noti:
* Come al solito, non abbiamo ancora trovato alcun bug. Se ne trovi, avvisaci o apri una issue su GitHub!

Per ora è tutto, ci auguriamo che la nuova versione del software ti piaccia. Se hai suggerimenti o vuoi segnalare un bug, contattaci sul nostro sito Web o apri una issue su GitHub. Grazie per aver scelto il nostro software!
Nuove funzionalità verranno aggiunte in futuro. Seguici su GitHub per rimanere aggiornato sulle future versioni!

## V1.3.1
### Nuove caratteristiche:
* Autenticazione password nel back-end
* Aggiunte funzionalità di sicurezza e accesso bloccato ai file privati
### Bug conosciuti:
* Non abbiamo ancora trovato alcun bug. Se ne trovi qualcuno, avvisaci!
## V1.3.0
### Nuove Funzioni:
* Aggiunta l'autenticazione al sito, la password/token può essere gestita dalla pagina `auth.html.`
   * Stile dedicato `style_auth.css` per `auth.html`
   * La password predefinita é "baseball", si consiglia di modificarla prima di utilizzare il software.
   * Viene richiesta la password per accedere a: `auth.html` `admin.html` `admin_obs.html`.
   * Per utilizzare l'API è necessario un token valido: `update.php` `update_pass.php` `update_token.php` `settings.php`.
* Risolto il bug trovato su #8
* Alcuni bug risolti
### Bug noti:
* non abbiamo trovato nessun altro bug se trovi per favore avvisami
## V1.2.1
### Nuove Funzioni:
* Aggiunta pagina amministrazione
   * Stile dedicato `style_obs.css`
   * Pagina `admin_OBS.html`
### Bug noti:
* Alcune volte non si "liberano" le basi con `Auto Change Inning`
* non abbiamo trovato nessun altro bug se trovi per favore avvisami
## V1.2.0
### Nuove caratteristiche:
* Parziali aggiunti:
   * Pagina dedicata `parz.html`
   * Stile dedicato `style_parz.css`
   * Inning variabile visualizzato
   * Visibile su `admin.html`
* Aggiunte impostazioni
   * Massimo ining per `parz.html`
* Barra di navigazione e indice aggiornati
* Passaggio di dati convertiti
* Risolto bug visivo
### Bug noti:
* Non abbiamo ancora trovato alcun bug. Se ne trovi, avvisaci!
## V1.1.0
### Nuove Funzioni:
* Ora usiamo `fetch()` per prendere il JSON dal file
  * Il file verrà scaricato solo se aggiornato
  * Segnapunti più reattivo
  * Meno connessione utilizzata
* Aggiunta una pagina di index per il reinderezzamento dell'utente e la guida all'interno del programma
* Rimossi dei messaggi di debug dalla console
* Rimossi i due trattini dato che ora sono presenti le overlay
* Aggiunte le API per il cambiamento dei dati:
  * La API accetta solo un formato valido di dati
  * Genera un Log dove vengono salvati tutti i cambiamenti
  * Restituisce una risposta standard indicando i cambiamenti effettuati
* Abbiamo aggiornato lo stile con:
    * Un nuovo look della pagina index.html
    * L'aggiunta di un navbar in admin e index
    * Fix di alcuni bug nel CSS
    * Aggiunti box per README e LICENSE nella pagina di index e di amministrazione
### Bug conosciuti:
* Bug visivi in `admin.html`
* non abbiamo trovato nessun altro bug se trovi per favore avvisami
## V1.0.1
### Nuove Funzioni:
* SEGNAPUNTI LIVE: ora il segnapunti si aggiorna in live
* overlay pre-partita e post-partita utilizzate per non lasciare vuota la telecamera, verranno regolate con nome, colore e punteggio (solo dopo la partita)
* Risolto il problema con la cache con tutti i file ora il browser non memorizzerà i file nella cache
* Freccia inning più reattiva (prima il trattino aveva problemi)
* Rimosso il debug log nella console del browser
### Bug conosciuti:
* Non abbiamo trovato nessun bug per ora. Se ne trovi qualcuno, per favore avvisaci!
## V1.0.0
### Funzioni:
* Aggiunta e rimozione punteggio
* Strike, Ball, Out
* Cambio Automatico Battitore
* Grafica occupazione basi
* Reset Ining Automatico
* Ining con Alto/Basso
* Cambio colore e nome delle squadre
* Reset COMPLETO
### Bug conosciuti:
* cache iniziale su TUTTI I BROWSER (Ripeti l'azione per 3/4 volte e non c'è più)
* Il tabellone non si aggiorna dal vivo, devi aspettare meno di 5 secondi
* Non abbiamo trovato nessun bug per ora. Se ne trovi qualcuno, per favore avvisaci!