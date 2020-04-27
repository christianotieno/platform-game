# platform-game

## Getting Started

This project is configured to be as simple as possible; build, deploy, and play with all with npm.

### Build Dependencies 🚧

The only dependencies are NodeJS & npm. Any NodeJS LTS version will work. Simply clone this repo and run npm install.

### Play The Game 🕹️

Just run `npm start` and go to `localhost:8080` in your favorite web browser.

## Game Development Guidelines & Timelines

| TIMELINE    |  TODO  |  DESCRIPTION  |    OUTCOME   |  STATUS   |
| :---        | :----: |    :----:     |    :----:    |  :----:   |
| Day 1       | Learn Phaser 3 framework | Obtain leads, knowledge and the syntax necessary for the development of the game.| Understanding the game framework.|&#9745;|
| Day 2       | Game Design | Design the game by defining the topic and objective of the game, the game mechanics, the different entities involved in the game (player, enemies, platforms, levels, etc.), the user interactions and finally the different screens (Phaser scenes) that needs implementation. |  Set objectives for remaining days. |&#9745;|
| Day 3       |Game Development| Game Development following the defined design|  Game Logic  |&#9745;|
| Day 4       |Game Development| Game Development following the defined design|  Game Interface |&#9745;|
| Day 5       |Game Documentation| Game Documentation following the defined design|  Game Documentation |&#9745;|

## Game Scenes & Their Work Descriptions

| SCENES           | DESCRIPTION |
| :---             | :---        |
| **Boot**         | The first scene that is loaded by Phaser, and it will in turn load the `PreloaderScene`. |
| **Preloader**    | The second scene that is loaded after the `BootScene`. It displays the progress bar while it loads all of the assets needed for the game. |
| **Title**        | The title of the game. It displays buttons to start the game, view credits, and modify options. It is loaded immediately after `PreloaderScene`. |
| **aboutGame**    | This scene loads when the player presses play in the `TitleScene`. It displays the instructions for the game and the mission ahead. |
| **Credits**      | Credits for the game. It gets displayed when the player presses the credits button in the `TitleScene`. |
| **Game**         | Contains the main logic for the game. Loads after the `aboutScene` loads. |
| **LeadersBoard** | Displays the highscores and their owners. It loads when the game is over. |
| **Options**      | Contains settings for the players to be able to modify in the game (example: mute audio). |

## Pre-requisites

- Basic to intermediate JavaScript skills
- A code editor
- Chrome Web Browser
- Have NodeJS installed locally
