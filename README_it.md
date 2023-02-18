<center>

![insert banner here](file)

<center>
  
[![CodeFactor](https://www.codefactor.io/repository/github/fc-softwares/baseball-scoreboard/badge/main)](https://www.codefactor.io/repository/github/fc-softwares/baseball-scoreboard/overview/main)
![Version](https://img.shields.io/github/package-json/v/FC-softwares/baseball-scoreboard/next)
<!-- [![Better Uptime Badge](https://betteruptime.com/status-badges/v1/monitor/aauk.svg)](https://betteruptime.com/?utm_source=status_badge) -->

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

## Documentazione
Probabilmente queste istruzioni non sono state molto esaustive, ma non c'è da preoccuparsi! Per maggiori informazioni, la documentazione è disponibile [qui](https://github.com/FC-softwares/baseball-scoreboard/tree/main/docs/it/)!
> **ATTENZIONE**: la documentazione in italiano è ancora WIP! Nel mentre, si può consultare la documentazione in lingua inglese [qui](https://github.com/FC-softwares/baseball-scoreboard/tree/main/docs/en/)!

---

## Licenza
[![Licenza Creative Commons](https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-nd/4.0/)  
Baseball-Scoreboard di [F&C softwares](https://github.com/FC-softwares) è distribuito con Licenza [Creative Commons Attribuzione - Non commerciale - Non opere derivate 4.0 Internazionale](http://creativecommons.org/licenses/by-nc-nd/4.0/).  
Based on a work at [https://github.com/FC-softwares/baseball-scoreboard](https://github.com/FC-softwares/baseball-scoreboard).  
Permessi ulteriori rispetto alle finalità della presente licenza possono essere disponibili presso [https://github.com/FC-softwares](https://github.com/FC-softwares).
