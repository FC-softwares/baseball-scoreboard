<center>

<!-- ![insert banner here](file) -->

<center>

[![CodeFactor](https://www.codefactor.io/repository/github/fc-softwares/baseball-scoreboard/badge/main)](https://www.codefactor.io/repository/github/fc-softwares/baseball-scoreboard/overview/main)
[![Better Uptime Badge](https://betteruptime.com/status-badges/v1/monitor/aauk.svg)](https://status.fc-software.it)
[![Maintainability](https://api.codeclimate.com/v1/badges/60d1dc20274d613c67db/maintainability)](https://codeclimate.com/github/FC-softwares/baseball-scoreboard/maintainability)
![GitHub All Releases](https://img.shields.io/github/downloads/FC-softwares/baseball-scoreboard/total)

</center>

# Baseball Scoreboard
Un segnapunti del baseball semplice, veloce e leggero, realizzato con Electron.
Funziona su tutte le applicazioni di streaming con supporto alle sorgenti web.

| Language: | [ 🇬🇧 English ]( https://github.com/FC-softwares/baseball-scoreboard/blob/main/README.md )  | [ 🇮🇹 <u>Italian</u> ]( https://github.com/FC-softwares/baseball-scoreboard/blob/main/README_it.md )  |
|---|---|---|

</center>

---

## Installazione
### Installazione da file setup
1. Visita la pagina delle versioni dell'app [(Releases)](https://github.com/FC-softwares/baseball-scoreboard/releases/latest)
2. Scarica l'ultima versione disponibile per la tua piattaforma
3. Esegui il file di setup ed installa il software
4. Et voila! Potrai trovare l'app nel launcher applicazioni del tuo sistema operativo ed eseguirlo da lì!
### Installazione da codice sorgente
Se desideri installare l'applicazione dal codice sorgente, assicurati di aver già installato l'ultima versione LTS disponibile di Node.js ed npm.
1. Clona la repository eseguendo `git clone https://github.com/FC-softwares/baseball-scoreboard.git`
2. Entra nella nuova cartella "baseball-scoreboard" (`cd baseball-scoreboard`)
3. Esegui `npm i` ed attendi che tutte le dipendenze vengano installate
4. Esegui `npm start` per avviare il software

## Uso
Le scoreboard e il pannello di controllo sono delle pagine web fatte in modo tale da essere aggiunte a OBS o ad altre applicazioni di streaming come sorgente browser. È sufficiente aggiungere la pagina web e inserire l'URL della scoreboard che si desidera utilizzare.
### Aggiunta Scoreboard a OBS
1. Avvia l'applicazione OBS o simili
2. Avvia Baseball-Scoreboard
3. Aggiungi una nuova fonte browser e inserisci il nome che preferisci
4. L'indizizzo web da inserire è `http://localhost:2095/nome-scoreboard.html` se esegui Baseball-Scoreboard sulla tua macchina locale, altrimenti è `http://IP-DEL-PC:2095/nome-scoreboard.html` (dove IP-DEL-PC è l'indirizzo IP della macchina su cui è eseguito Baseball-Scoreboard) Il nome della scoreboard segue la tabella sottostante

| Nome scoreboard | Nome file |
|---|---|
| Scoreboard Principale | `scoreboard.html` |
| Pre Game | `pregame.html` |
| Post Game | `postgame.html` |
| Parziali / Inning | `inning.html` |
| Arbitri | `umpires.html` |
| Classificatori | `scorers.html` |
| Telecronista | `commentator.html` |
| Commentatore Tecnico | `technicalComment.html` |

5. Una volta aggiunta la fonte browser, trascinala nella posizione che preferisci e ridimensionala a piacimento (durante il posizionamento si consiglia di attivare la scoreboard dal `Control Center` per vedere il risultato)
6. Una volta finito, si consiglia di disattivare tutte le altre scoreboard dal `Control Center` per evitare che vengano visualizzate durante la trasmissione

### Aggiunta Pannello di Controllo a OBS (opzionale)
1. Avvia l'applicazione OBS (Queste istruzioni sono valide per OBS, ma dovrebbero funzionare anche per altre applicazioni di streaming)
2. Avvia Baseball-Scoreboard
3. Per aggiungere il pannello di controllo, è necessario creare un nuovo pannello web e inserire l'indirizzo `http://localhost:2095/control-center.html` se Baseball-Scoreboard è eseguito sulla tua macchina locale, altrimenti è `http://IP-DEL-PC:2095/control-center.html` (dove IP-DEL-PC è l'indirizzo IP della macchina su cui è eseguito Baseball-Scoreboard)
4. Per farlo vai su `Pannelli` > `Pannelli Browser Personalizzati`
5. Poi aggiungi alla tabella una nuova riga inseredo il nome che preferisci nella colonna `Nome Del Pannello` e l'indirizzo web: `http://localhost:2095/control-center.html` o `http://IP-DEL-PC:2095/control-center.html` (dove IP-DEL-PC è l'indirizzo IP della macchina su cui è eseguito Baseball-Scoreboard) nella colonna `URL`
6. Conferma premendo `Applica` e poi `Chiudi`
7. Ora puoi trascinare il nuovo pannello nella posizione che preferisci, ridimensionarlo a piacimento e bloccarlo nella UI di OBS dove preferisci

### Uso con licenza già acquistata
Nel caso in cui si abbia già acquistato una licenza, è possibile utilizzare Baseball-Scoreboard liberamente ma bisognerà inseririre un file: `.env.json` nella
## Documentazione
Probabilmente queste istruzioni non sono state molto esaustive, ma non c'è da preoccuparsi! Per maggiori informazioni, la documentazione è disponibile [qui](https://github.com/FC-softwares/baseball-scoreboard/tree/main/docs/it/)!
> **ATTENZIONE**: la documentazione in italiano è ancora WIP! Nel mentre, si può consultare la documentazione in lingua inglese [qui](https://github.com/FC-softwares/baseball-scoreboard/tree/main/docs/en/)!

---

## Licenza
Copyright [2023] [F&C software]

Tutti i diritti riservati.

Il software Baseball-Scoreboard di [F&C software] ("Software") è protetto da copyright ed è di proprietà esclusiva di [F&C software]. Il Software è concesso in licenza, non venduto.

SOGGETTI ALL'ACQUISTO DI UNA LICENZA:

L'utilizzo del Software è consentito solo ai sensi dei termini e delle condizioni stabiliti in una licenza valida per il Software, che deve essere acquistata presso https://www.fc-software.it/.

UTILIZZO PER SCOPI DI TESTING:

Nonostante quanto sopra indicato, è consentito l'utilizzo del Software per scopi di testing senza acquistare una licenza per la modifica e/o vendita, a condizione che tale utilizzo sia limitato al solo scopo di testare e valutare il Software e non a scopi commerciali o di distribuzione. Questa licenza va richiesta all'indirizzo mail help@fc-software.it

VIETATO L'UTILIZZO SENZA LICENZA:

Salvo quanto previsto dal presente accordo, non è consentito l'utilizzo, la copia, la modifica, la distribuzione o la commercializzazione del Software senza l'acquisto di una licenza valida da parte di [F&C software].

DIRITTI DI PROPRIETÀ INTELLETTUALE:

Il Software è protetto da copyright e da altre leggi sulla proprietà intellettuale. [F&C software] conserva tutti i diritti, titoli e interessi sul Software, inclusi tutti i diritti di proprietà intellettuale.

LIMITAZIONE DELLA RESPONSABILITÀ:

[F&C software] non sarà responsabile per danni di qualsiasi tipo derivanti dall'utilizzo del Software, anche se [F&C software] è stata informata della possibilità di tali danni.

LEGGE APPLICABILE:

Il presente accordo è regolato dalle leggi dello Stato in cui ha sede [F&C software] e deve essere interpretato in conformità con tali leggi.

ACCETTAZIONE DEI TERMINI:

L'utilizzo del Software implica l'accettazione dei termini e delle condizioni del presente accordo.