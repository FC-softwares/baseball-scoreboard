<center>

![insert banner here](file)

<center>

[![CodeFactor](https://www.codefactor.io/repository/github/fc-softwares/baseball-scoreboard/badge/main)](https://www.codefactor.io/repository/github/fc-softwares/baseball-scoreboard/overview/main)
![Version](https://img.shields.io/github/package-json/v/FC-softwares/baseball-scoreboard/next)
[![Better Uptime Badge](https://betteruptime.com/status-badges/v1/monitor/aauk.svg)](https://betteruptime.com/?utm_source=status_badge)

</center>

# Baseball Scoreboard
A fast, lightweight and simple scoreboard manager built with Electron.
Works on all streaming apps with support for browser sources.

| Language: | [ 🇬🇧 <u>English</u> ]( https://github.com/FC-softwares/baseball-scoreboard/blob/main/README.md )  | [ 🇮🇹 Italian ]( https://github.com/FC-softwares/baseball-scoreboard/blob/main/README_it.md )  |
|---|---|---|

</center>

---

## Install
### Install from the setup executable
1. Visit our [Releases](https://github.com/FC-softwares/baseball-scoreboard/releases/latest) page
2. Download the latest release for your platform 
3. Run the setup file and install the software
4. Good to go! You can now find the app in your applications launcher and run it!
### Install from source
Before installing the software from the source code, make sure you already have the latest LTS version of Node.js and npm installed.
1. Clone the repository with `git clone https://github.com/FC-softwares/baseball-scoreboard.git`
2. Go into the newly created "baseball-scoreboard" folder (`cd baseball-scoreboard`)
3. Run `npm i` and wait for all the dependencies to install
4. Run `npm start` to execute the software

## Usage
All scoreboards and dashboards are treated as web pages to add them to OBS or other streaming applications, simply add the web page and enter the URL of the scoreboard you want to use.
### Added Scoreboard to OBS
1. Launch the OBS application or similar
2. Start Baseball-Scoreboard
3. Add a new web source and enter the name of your choice
4. The web address to enter is `http://localhost:2095/name-scoreboard.html` if you run Baseball-Scoreboard on your local machine, otherwise, it is `http://PC-IP:2095/name-scoreboard.html` (where PC-IP is the IP address of the machine running Baseball-Scoreboard) The name of the scoreboard follows the table below

| Scoreboard Name | Filename |
|---|---|
| Main Scoreboard | `scoreboard.html` |
| Pre Game | `pregame.html` |
| Post Game | `postgame.html` |
| Partials / Innings | `innings.html` |
| Umpires | `umpires.html` |
| Scorers | `scorers.html` |
| SportCaster | `commentator.html` |
| Technical Commenror | `technicalComment.html` |

5. Once the web source has been added, drag it to the position you prefer and resize it as you like (when positioning it is recommended to activate the scoreboard from the `Control Center` to see the result)
6. Once finished, it is recommended to deactivate all other scoreboards from the `Control Center` to prevent them from being displayed during the broadcast

### Add Control Panel to OBS (optional)
1. Launch the OBS application (These instructions are valid for OBS, but should also work for other streaming applications they probably have similar names)
2. Start Baseball-Scoreboard
3. To add the control panel, you need to add a new web panel and enter the address `http://localhost:2095/control-center.html` if Baseball-Scoreboard is running on your local machine, otherwise, it is ` http://PC-IP:2095/control-center.html` (where PC-IP is the IP address of the machine running Baseball-Scoreboard)
4. To do this go to `Doks` > `Custom Browser Docks...`
5. Then add a new row to the table by entering the name of your choice in the `Dock Name` column and the web address: `http://localhost:2095/control-center.html` or `http://PC-IP:2095/control-center.html` (where PC-IP is the IP address of the machine running Baseball-Scoreboard) in the `URL` column
6. Confirm by pressing `Apply` and then `Close`
7. Now you can drag the new panel to the position you prefer, resize it to your liking and pin it to the OBS UI where you prefer

## Docs
Probably these instructions weren't that clear. If that's the case, don't panic! You can read the docs [here](https://github.com/FC-softwares/baseball-scoreboard/tree/main/docs/en/) for more info!
> **WARNING**: the docs are far from being completed, yet. Everything is still a WIP, but we'll try to write everything down as soon as possible.

---

## License
[![Creative Commons License](https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-nd/4.0/)  
Baseball Scoreboard by [F&C software](https://github.com/FC-softwares/) is licensed under a [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License](http://creativecommons.org/licenses/by-nc-nd/4.0/).  
Based on a work at [https://github.com/FC-softwares/baseball-scoreboard](https://github.com/FC-softwares/baseball-scoreboard).  
Permissions beyond the scope of this license may be available at [https://github.com/FC-softwares/](https://github.com/FC-softwares/).
