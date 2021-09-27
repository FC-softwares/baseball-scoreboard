# UPDATE LOG (English)
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
# Update Log (Italiano)
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
* Sovrapposizioni pre-partita e post-partita utilizzate per non lasciare vuota la telecamera, verranno regolate con nome, colore e punteggio (solo dopo la partita)
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
