/***
Team Brogrammners :- Andrew Hamett,Cole Snyder,Siddhant Grover,Steven Mcvicker
Project Description:A fully functional 4 player Board Game with the motive to turn each individual 
player's row green.
Class:CS 410 Software Engineering
Professor :Sudershan Iyengar
Date Due:3/3/2019
app.js:used for connecting the pages,i.e. emmitting data ,connecting all pages together and sending dats
****/
// used to connect pages via socket
var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const path = require('path');

var Player = [];// creates player array
// booleans created to relate with the ids on the scoreboard;p1p1,p2p2,p3p3,p4p4 are green always by default
var p1p2 = false;
var p1p3 = false;
var p1p4 = false;
var p2p1 = false;
var p2p3 = false;
var p2p4 = false;
var p3p1 = false;
var p3p2 = false;
var p3p4 = false;
var p4p1 = false;
var p4p2 = false;
var p4p3 = false;
var roundCount = 0;// to keep track of number of rounds throhroughout the game
var Winner = false
//keeping track of player wins
var P1Wins = 0;
var P2Wins = 0;
var P3Wins = 0;
var P4Wins = 0;


if (!Winner) {// if there is no winner 
    // connecting all players together
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(__dirname + '/public'));

    app.get('/player1', function(req, res) {
        console.log('Routing to index1.ejs')
        res.render('player1');
    });
    app.get('/player2', function(req, res) {
        console.log('Routing to index2.ejs')
        res.render('player2');
    });
    app.get('/player3', function(req, res) {
        console.log('Routing to index3.ejs')
        res.render('player3');
    });
    app.get('/player4', function(req, res) {
        console.log('Routing to index4.ejs')
        res.render('player4');
    });

    app.get('*', function(req, res) {
        res.render('error');
    });

    server.listen(3001, '0.0.0.0', function() {
        console.log('listening on *:3001');
    });


    // Everything below this line will have to do with Socket.io *********************************************

    io.on('connection', function(socket) {// using socket
        console.log("Made socket connection " + socket.id)

        socket.on('object', function(data) {
            playerArray.push("player" + playerArray.length);//pushes player to player array
            console.log(playerArray.length);
            var num = playerArray.length;// length of array 
            io.to(socket.id).emit("player" + num, num);
        });

        socket.on('P1Number', function(data) {// for player1
            Player[0].Hand.push(data);//adds data to the players hand
            console.log(Player)
            console.log(Player[0]);
            //call compare function
            var match = Comapare(Player[0], Player[1], Player[2], Player[3]);// comapre function build to compare playes hand to every individual hand 
            // console.log(Player[0].ID);
            //save response from compare to variable
            io.emit('P1Number', {// sends data  of the player
                data: data,
                match: match
            });
            match = "";

            if (Player[0].roundPoints == 3) {
                console.log("Player 1 wins");
                P1Wins = P1Wins + 1;// adds point after player wins
                //placed round winning code here
                adjustPlayer1GP();
                var P1Points = Player[0].Points;
                var P2Points = Player[1].Points;
                var P3Points = Player[2].Points;
                var P4Points = Player[3].Points;
                io.emit('Player1Wins', {// send the number of wins
                    P1Points: P1Points,
                    P2Points: P2Points,
                    P3Points: P3Points,
                    P4Points: P4Points,
                });
                console.log(Player[0].Points);
                console.log(Player[1].Points);
                console.log(Player[2].Points);
                console.log(Player[3].Points);

                if (roundCount === 1) {
                  Winner(Player[0].Points, Player[1].Points, Player[2].Points, Player[3].Points);
                    //checkWinner();
                }
                resetPlayer();
                FillHand();
            }
        });

        socket.on('P2Number', function(data) {// for player2
            Player[1].Hand.push(data);//adds data to the players hand
            console.log(Player);
            console.log(Player[1]);
            var match = Comapare(Player[1], Player[0], Player[2], Player[3]);// comapre function build to compare playes hand to every individual hand 
            io.emit('P2Number', {// sends data  of the player
                data: data,
                match: match
            });
            match = "";
            if (Player[1].roundPoints == 3) {
                console.log("Player 2 wins");
                P2Wins = P2Wins + 1;// adds point after player wins
                adjustPlayer2GP();
                var P1Points = Player[0].Points;
                var P2Points = Player[1].Points;
                var P3Points = Player[2].Points;
                var P4Points = Player[3].Points;
                io.emit('Player2Wins', {// send the number of wins
                    P1Points: P1Points,
                    P2Points: P2Points,
                    P3Points: P3Points,
                    P4Points: P4Points,
                });
                console.log(Player[0].Points);
                console.log(Player[1].Points);
                console.log(Player[2].Points);
                console.log(Player[3].Points);

                if (roundCount === 1) {
                  Winner(Player[0].Points, Player[1].Points, Player[2].Points, Player[3].Points);
                    //checkWinner();
                }

                resetPlayer();
                FillHand();

            }
        });
             // follows the same for player 3 and player 4
        socket.on('P3Number', function(data) {
            Player[2].Hand.push(data);
            console.log(Player)
            console.log(Player[2]);
            var match = Comapare(Player[2], Player[0], Player[1], Player[3]);
            io.emit('P3Number', {
                data: data,
                match: match
            });
            match = "";
            if (Player[2].roundPoints == 3) {
                console.log("Player 3 wins");
                P3Wins = P3Wins + 1;
                adjustPlayer3GP();
                var P1Points = Player[0].Points;
                var P2Points = Player[1].Points;
                var P3Points = Player[2].Points;
                var P4Points = Player[3].Points;
                io.emit('Player3Wins', {
                    P1Points: P1Points,
                    P2Points: P2Points,
                    P3Points: P3Points,
                    P4Points: P4Points,
                });
                console.log(Player[0].Points);
                console.log(Player[1].Points);
                console.log(Player[2].Points);
                console.log(Player[3].Points);

                if (roundCount === 1) {
                  Winner(Player[0].Points, Player[1].Points, Player[2].Points, Player[3].Points);
                    //checkWinner();
                }

                resetPlayer();
                FillHand();
            }
        });
        socket.on('P4Number', function(data) {
            Player[3].Hand.push(data);
            console.log(Player);
            console.log(Player[3]);
            var match = Comapare(Player[3], Player[0], Player[1], Player[2]);
            io.emit('P4Number', {
                data: data,
                match: match
            });
            match = "";
            if (Player[3].roundPoints == 3) {
                console.log("Player 4 wins");
                P4Wins = P4Wins + 1;
                adjustPlayer4GP();
                var P1Points = Player[0].Points;
                var P2Points = Player[1].Points;
                var P3Points = Player[2].Points;
                var P4Points = Player[3].Points;
                io.emit('Player4Wins', {
                    P1Points: P1Points,
                    P2Points: P2Points,
                    P3Points: P3Points,
                    P4Points: P4Points,
                });
                console.log(Player[0].Points);
                console.log(Player[1].Points);
                console.log(Player[2].Points);
                console.log(Player[3].Points);

                if (roundCount === 1) {
                    Winner(Player[0].Points, Player[1].Points, Player[2].Points, Player[3].Points);
                    //checkWinner();
                }

                resetPlayer();
                FillHand();
            }
        });
        //
        socket.on('sendPlayer', function(data) {// 
            Player.push(data);
            console.log(Player);
        });

        function adjustPlayer1GP() {//adjust the game points if player 1 wins
            for (let i = 0; i < Player[0].Hand.length; i++) {
                Player[0].Points += Player[0].Hand[i];// points = sum of hands
            }
            // every other player gets 10 points
            Player[1].Points += 10;
            Player[2].Points += 10;
            Player[3].Points += 10;
            console.log('adding one to count ')
            roundCount++;
        }

        function adjustPlayer2GP() {//adjust the game points if player 2 wins
            for (let i = 0; i < Player[1].Hand.length; i++) {
                Player[1].Points += Player[1].Hand[i];// points = sum of hands
            }
            // every other player gets 10 points
            Player[0].Points += 10;
            Player[2].Points += 10;
            Player[3].Points += 10;
            console.log('adding one to count ');
            roundCount++;
        }
          // does the same as above function but for player 3 and 4
        function adjustPlayer3GP() {
            for (let i = 0; i < Player[2].Hand.length; i++) {
                Player[2].Points += Player[2].Hand[i];
            }
            Player[0].Points += 10;
            Player[1].Points += 10;
            Player[3].Points += 10;
            console.log('adding one to count ' + roundCount)
            roundCount++;

        }

        function adjustPlayer4GP() {
            for (let i = 0; i < Player[3].Hand.length; i++) {
                Player[3].Points += Player[3].Hand[i];
            }
            Player[0].Points += 10;
            Player[1].Points += 10;
            Player[2].Points += 10;
            console.log('adding one to count ')
            roundCount++;
        }

    });

    function Winner(Player1, Player2, Player3, Player4) {// function that determines the winner

      console.log("Player1: " + Player1);
      console.log("Player2: " + Player2);
      console.log("Player3: " + Player3);
      console.log("Player4: " + Player4);

      if ((Player1 > Player2) && (Player1 > Player3) && (Player1 > Player4)) {// if player 1 has greatest points
                var winner = 1;// player 1 is winner
                io.emit("winner", winner);// send the winner
                console.log("player 1 is the big winner");
            } else if ((Player2 > Player1) && (Player2 > Player3) && (Player2 > Player4)) {// if player 2 has greatest points
                var winner = 2;// player 2 is winner
                io.emit("winner", winner);// send the winner
                console.log("player 2 is the big winner");
            } else if ((Player3 > Player1) && (Player3 > Player2) && (Player3 > Player4)) {// if player 3 has greatest points
                var winner = 3;// player 3 is winner
                io.emit("winner", winner);// send the winner
                console.log("player 3 is the big winner");
            } else if ((Player4 > Player1) && (Player4 > Player2) && (Player4 > Player3)) {// if player 4 has greatest points
                var winner = 4;// player 4 is winner
                io.emit("winner", winner);// send the winner
                console.log("player 4 is the big winner");
            }

        // for (let i = 0; i < Player.length; i++) {
        //     var winner;
        //     var pointsTrack = 0;
        //     const element = Player[i];
        //     if (element.points > pointsTrack) {
        //         pointsTrack = element.points;
        //         winner = element.ID;

        //     }
        // }
        // console.log("We have a winner\n" + winner)
        // io.emit("winner", {winner: winner.value});
    }

    // if (roundCount === 1) {
    //     Winner();
    // }




    function resetPlayer() {
        for (let i = 0; i < Player.length; i++) {// goes through player array and resets all their point and hand to 0
            Player[i].Hand.length = 0;
            Player[i].roundPoints = 0;
        }

    }

    function FillHand() {// done initially in every round to give every player a random hand

        for (let j = 0; j < Player.length; j++) {
            for (let i = 0; i < 3; i++) {
                var Num = RandomNum();
                if (Player[j].Hand.includes(Num)) {
                    Num = RandomNum();
                }
                //console.log(Num);
                Player[j].Hand.push(Num);
            }
        }
    }


    function RandomNum() {
        var random = Math.floor(Math.random() * 20) + 1
        return random
    }




    function Comapare(currentPlayer, temp2, temp3, temp4) {// compare method that individually compares the hand of each player

        var tempMatch1;
        var tempMatch2;
        var tempMatch3;
        var match;

        var firstCompare = temp2.Hand.every(val => currentPlayer.Hand.includes(val));//compares value to the every value in players hand
        if (firstCompare == true) {

            match = "p" + currentPlayer.ID + "p" + temp2.ID; // concatenates the string p with player id so it can be mapped to id on scoreboard to access dom
            //currentPlayer.roundPoints = currentPlayer.roundPoints + 1;
        }
        console.log(firstCompare);
        var secondCompare = temp3.Hand.every(val => currentPlayer.Hand.includes(val))//compares value to the every value in players hand;
        if (secondCompare == true) {
            match = "p" + currentPlayer.ID + "p" + temp3.ID; // concatenates the string p with player id so it can be mapped to id on scoreboard to access dom
            // currentPlayer.roundPoints = currentPlayer.roundPoints + 1;
        }
        console.log(secondCompare);
        var thirdCompare = temp4.Hand.every(val => currentPlayer.Hand.includes(val));//compares value to the every value in players hand
        if (thirdCompare == true) {
            match = "p" + currentPlayer.ID + "p" + temp4.ID; // concatenates the string p with player id so it can be mapped to id on scoreboard to access dom
            //currentPlayer.roundPoints = currentPlayer.roundPoints + 1;
        }
        console.log(thirdCompare);

        if (match != undefined) {
              //uses the logic above to add roundpoints to the players 
            if (match == "p1p2" && p1p2 === false) {
                p1p2 = true;
                currentPlayer.roundPoints = currentPlayer.roundPoints + 1;

                return match;
            } else if (match == "p1p3" && p1p3 === false) {
                p1p3 = true;
                currentPlayer.roundPoints = currentPlayer.roundPoints + 1;

                return match;
            } else if (match == "p1p4" && p1p4 === false) {
                p1p4 = true;
                currentPlayer.roundPoints = currentPlayer.roundPoints + 1;

                return match;
            } else if (match == "p2p1" && p2p1 === false) {
                p2p1 = true;
                currentPlayer.roundPoints = currentPlayer.roundPoints + 1;

                return match;
            } else if (match == "p2p3" && p2p3 === false) {
                p2p3 = true;
                currentPlayer.roundPoints = currentPlayer.roundPoints + 1;

                return match;
            } else if (match == "p2p4" && p2p4 === false) {
                p2p4 = true;
                currentPlayer.roundPoints = currentPlayer.roundPoints + 1;

                return match;
            } else if (match == "p3p1" && p3p1 === false) {
                p3p1 = true;
                currentPlayer.roundPoints = currentPlayer.roundPoints + 1;

                return match;
            } else if (match == "p3p2" && p3p2 === false) {
                p3p2 = true;
                currentPlayer.roundPoints = currentPlayer.roundPoints + 1;
                return match;
            } else if (match == "p3p4" && p3p4 === false) {
                p3p4 = true;
                currentPlayer.roundPoints = currentPlayer.roundPoints + 1;

                return match;
            } else if (match == "p4p1" && p4p1 === false) {
                p4p1 = true;
                currentPlayer.roundPoints = currentPlayer.roundPoints + 1;

                return match;
            } else if (match == "p4p2" && p4p2 === false) {
                p4p2 = true;
                currentPlayer.roundPoints = currentPlayer.roundPoints + 1;

                return match;
            } else if (match == "p4p3" && p4p3 === false) {
                p4p3 = true;
                currentPlayer.roundPoints = currentPlayer.roundPoints + 1;
                return match;
            }
        }

    }





    // for (let i = 0; i < Player.length; i++) {
    //     const current = Player[i];
    //     for (let j = 0; j < Player.length; j++) {
    //         const element = Player[j];
    //         var Token = current.Name + "-" + element.Name
    //         if (Comapare(current.Hand, element.Hand)) {
    //             io.on("Change", {
    //                 Token
    //             })
    //         }
    //     }
    // }


    var playerArray = new Array;

    var playerArray1 = [];
    var playerArray2 = [];
    var playerArray3 = [];
    var playerArray4 = [];
}