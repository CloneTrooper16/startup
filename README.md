# startup
## Elevator pitch: 
My startup will be a simple chess game. This online web application will be accessible anywhere and with a simple UI, it will be a joy to play wherever you have cell service. With authetication services and games saved on the database, you will be able to quickly and easily play chess for whatever amount of time you have, whether its a full game or just a couple moves. 

![rough sketch of the basic view of the site](/assets/BasicView.png)

## Key features include:
- A chess game! what more could you want?
- __User authetication__. No one else will be able to take your turn
- __Scores__. A running total of your wins and almost wins!
- Games saved on the __database__. That means asynchronious play!

## Technologies used:
- __Authentication__: Keep your games safe behind your own password!
- __Database data__: Save your games for asynchronious play!
- __Websocket Data__: Play in real time with friends anywhere!
- Don't forget HTML, CSS, and Javascript to make a beautiful funcioning chess board!

## HTML Deliverable:
- __HTML pages__: I created 4 pages to login, play, check scores, and read about chess
- __Links__: Every pages has links in the header for the other pages
- __Text__: Text is included on the about page and on the other pages as required
- __3rd Party Service calls__: I included a call to robohash which will generate unique profile icons for users
- __images__: I included an image of chess on the about page
- __login placeholder__: Included on the welcome page, the play page also displays the username
- __Database placeholder__: Win/loss rate will be recorded and displayed on the scores page
- __WebSocket placeholder__: The game of chess will be played in real time as moves are made, data will be passed.

## CSS Deliverable:
- __Header, footer, and main content body__: Used flex to layout the sections
- __Navigation Elements__: Links have changed format, now part of a bootstrap navbar
- __Responsive to window resizing__: Looks great on pc, tablet, and phone
- __Application elements__: Button uses bootstrap, good use of whitespace and contrast
- __Application text content__: Uses one font across the board to be consistent
- __Application images__: about image has a border and the chess pieces fit within their squares

## JavaScript Deliverable:
- __Login__: When you enter a username and press login, it brings you to the home page and displays your username and icon in the top right.
- __database__: The scores page currently displays dummy data for your record, but will be replaced with actual win/loss count and a leaderboard.
- __WebSocket__: I used the setInterval() function to generate messages that will be replaced with message of actual games starting and finishing.
- __Application logic__: ChessPawns is a fully functioning pawn game that displays a win message when someone moves a pawn to the other side. 

## Service Deliverable:
- __Node.js/Express HTTP service__: Done!
- __Static middleware for frontend__: Done!
- __Calls to third party endpoints__: The about page calls for a random piece of advice using fetch.
- __Backend service endpoints__: endpoints for getting individual and highscores.
- __Frontend calls service endpoints__: Used fetch to call the endpoints.