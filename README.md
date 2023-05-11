<center>

<!-- ![insert banner here](file) -->

<center>

[![CodeFactor](https://www.codefactor.io/repository/github/fc-softwares/baseball-scoreboard/badge/main)](https://www.codefactor.io/repository/github/fc-softwares/baseball-scoreboard/overview/main)
[![Better Uptime Badge](https://betteruptime.com/status-badges/v1/monitor/aauk.svg)](https://status.fc-software.it)
[![Maintainability](https://api.codeclimate.com/v1/badges/60d1dc20274d613c67db/maintainability)](https://codeclimate.com/github/FC-softwares/baseball-scoreboard/maintainability)
![GitHub All Releases](https://img.shields.io/github/downloads/FC-softwares/baseball-scoreboard/total)

</center>

# Baseball Scoreboard
A fast, lightweight and simple scoreboard manager built with Electron.<br>
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
### Add Scoreboard to OBS
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
Copyright [2023] [F&C software]

All rights reserved.

The Baseball-Scoreboard software from [F&C software] ("Software") is protected by copyright and is the exclusive property of [F&C software]. The Software is licensed, not sold.

SUBJECT TO LICENSE PURCHASE:

Use of the Software is only permitted under the terms and conditions set forth in a valid license for the Software, which must be purchased at https://www.fc-software.it/.

UNAUTHORIZED USAGE:

Except as provided in this Agreement, it is not permitted to use and/or copy the Software for private or commercial purposes without the purchase of a valid license from [F&C software]. Distribution and marketing rights are given only with a special grant, which must be requested by emailing help@fc-software.it

USE FOR TESTING AND DEVELOPMENT PURPOSES:

Use and copy of the Software for evaluation or development purposes is permitted without purchasing a license, provided that such use is limited to testing, evaluating and modifying the Software. Unauthorized usage terms still apply. Modifications must not change or violate the terms and conditions of this Agreement.

INTELLECTUAL PROPERTY RIGHTS:

The Software is protected by copyright and other intellectual property laws. [F&C software] retains all rights, titles, and interests in the Software, including all intellectual property rights.

LIMITATION OF LIABILITY:

[F&C software] shall not be liable for any damages of any kind arising from the use of the Software, even if [F&C software] has been advised of the possibility of such damages.

APPLICABLE LAW:

This Agreement shall be governed by the laws of the state in which [F&C software] is located and shall be interpreted in accordance with such laws.

ACCEPTANCE OF TERMS:

Use of the Software implies acceptance of the terms and conditions of this Agreement.