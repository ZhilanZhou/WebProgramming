var CLIPlayer = function(game, cli_input, cli_output, map, is_player_one) {
    
    if (is_player_one) {
	var key = game.registerPlayerOne();
    } else {
	key = game.registerPlayerTwo();
    }


    cli_output = $(cli_output);
    cli_input = $(cli_input);
    map = $(map);
    
    
    var eventLogHandler = function(e) {
	var cli_msg = $('<div class="cli_msg"></div>');
	
	switch (e.event_type) {
	case SBConstants.TURN_CHANGE_EVENT:
	    if (e.who == SBConstants.PLAYER_ONE) {
		cli_msg.text("Player one's turn (count = " + game.getTurnCount() + ")");
	    } else {
		cli_msg.text("Player two's turn (count = " + game.getTurnCount() + ")");
	    }
	    break;
	case SBConstants.MISS_EVENT:
	    cli_msg.text("Miss event at (" + e.x + ", " + e.y + ")");
	    break;
	case SBConstants.HIT_EVENT:
	    cli_msg.text("Hit event at (" + e.x + ", " + e.y + ")");
	    break;
	case SBConstants.SHIP_SUNK_EVENT:
	    var ship = e.ship;
	    if (ship.isMine(key)) {
		var pos = ship.getPosition(key);
		cli_msg.text("Foe sunk your " + ship.getName() + " at (" + pos.x + ", " + pos.y + ")");
	    } else {
		var pos = ship.getPosition(null); // This works because ship is dead.
		cli_msg.text("You sunk their " + ship.getName() + " at (" + pos.x + ", " + pos.y + ")");
	    }
	    break;
	case SBConstants.GAME_OVER_EVENT:
	    if (is_player_one && e.winner == SBConstants.PLAYER_ONE) {
		cli_msg.text("Game over. You win!");
	    } else {
		cli_msg.text("Game over. You lose!");
	    }
	    break;
	}
	cli_output.prepend(cli_msg);
    };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
			      eventLogHandler);
    game.registerEventHandler(SBConstants.MISS_EVENT,
			      eventLogHandler);
    game.registerEventHandler(SBConstants.HIT_EVENT,
			      eventLogHandler);
    game.registerEventHandler(SBConstants.SHIP_SUNK_EVENT,
			      eventLogHandler);


    var mapDrawHandler = function(e) {
	map.empty();
    var table1 = document.createElement("table");

	for (var i = 0; i < game.getBoardSize(); i++) {//row
        var tr1 = document.createElement("tr");
	   
        for (var j = 0; j < game.getBoardSize(); j++) {//col
           var td1 = document.createElement("td");
           
           td1.id = 'r' + i + 'c' + j;
           
           var sqr = game.queryLocation(key, i, j);
		switch (sqr.type) {
		case "miss":
		    $(td1).addClass("miss");
		    break;
		case "p1":
		    if (sqr.state == SBConstants.OK) {
			$(td1).addClass("p1");
		    } else {
			$(td1).addClass("hit");
		    }
		    break;
		case "p2":
		    if (sqr.state == SBConstants.OK) {
			$(td1).addClass("p2");
		    } else {
			$(td1).addClass("hit");
		    }
		    break;
		case "empty":
		    $(td1).addClass("empty");
		    break;
		case "invisible":
		    $(td1).addClass("invisible");
		    break;
		}
           tr1.appendChild(td1);
	   }
        table1.appendChild(tr1);
    }
        map.append(table1);
    /*   
	var map_str = "";

	map_str += "   ";
	for (var x=0; x<game.getBoardSize(); x++) {
	    map_str += Math.floor(x/10);
	}
	map_str += "\n";
	map_str += "   ";
	for (var x=0; x<game.getBoardSize(); x++) {
	    map_str += x%10;
	}
	map_str += "\n";
	for (var x=-3; x<game.getBoardSize()+1; x++) {
	    map_str += "-";
	}
	map_str += "\n";
	
	for (var y=0; y<game.getBoardSize(); y++) {
	    map_str += Math.floor(y/10);
	    map_str += y%10;
	    map_str += "|";
	    for (var x=0; x<game.getBoardSize(); x++) {
		var sqr = game.queryLocation(key, x, y);
		switch (sqr.type) {
		case "miss":
		    map_str += "M";
		    break;
		case "p1":
		    if (sqr.state == SBConstants.OK) {
			map_str += "1";
		    } else {
			map_str += "X";
		    }
		    break;
		case "p2":
		    if (sqr.state == SBConstants.OK) {
			map_str += "2";
		    } else {
			map_str += "X";
		    }
		    break;
		case "empty":
		    map_str += ".";
		    break;
		case "invisible":
		    map_str += "?";
		    break;
		}
	    }
	    map_str += "|";
	    map_str += "\n";
	}
	for (var x=-3; x<game.getBoardSize()+1; x++) {
	    map_str += "-";
	}
	map_str += "\n";
*/
	
    };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
			      mapDrawHandler);

    $(function(){
        $('#p1_view').on('click', 'td', function(){
            $(this).addClass('hit');
            /*var position = $(this).get().id;
            var x = position.substring(1,3);
            var y = position.substring(4,6);*/
            //game.shootAt(key, x, y);
            
        });
    });
    /*
    cli_input.on('keypress', function (e) {
	if (e.keyCode == 13) {
	    var cmd_str = $(this).val();
//	    $(this).val('');
	    var cmd_array = cmd_str.split(' ');
	    if (cmd_array[0] == "shootAt") {
		var x = parseInt(cmd_array[1]);
		var y = parseInt(cmd_array[2]);
		game.shootAt(key, x, y);
	    } else if (cmd_array[0] == "fleetInfo") {
		var fleet = game.getFleetByKey(key);
		var fleet_ul = $('<ul></ul>');
		fleet.forEach(function (s) {
		    var ship_str = "<li>" + s.getName();
		    var ship_pos = s.getPosition(key);
		    ship_str += "<ul>";
		    ship_str += "<li>Position: " + ship_pos.x + ", " + ship_pos.y + "</li>";
		    ship_str += "<li>Direction: " + ship_pos.direction + "</li>";
		    ship_str += "<li>Size: " + s.getSize() + "</li>";
		    if (s.getStatus() == SBConstants.ALIVE) {
			ship_str += "<li>Status: ALIVE</li>";
		    } else {
			ship_str += "<li>Status: DEAD</li>";
		    }
		    ship_str += "</ul></li>";
		    fleet_ul.append(ship_str);
		})
		cli_output.prepend($('<div class="cli_msg"></div>').append(fleet_ul));
	    } else if (cmd_array[0] == "moveForward") {
		var ship_name = cmd_array[1];
		var ship = game.getShipByName(key, ship_name);
		if (ship != null) {
		    game.moveShipForward(key, ship);
		}
	    } else if (cmd_array[0] == "moveBackward") {
		var ship_name = cmd_array[1];
		var ship = game.getShipByName(key, ship_name);
		if (ship != null) {
		    game.moveShipBackward(key, ship);
		}
	    } else if (cmd_array[0] == "rotateCW") {
		var ship_name = cmd_array[1];
		var ship = game.getShipByName(key, ship_name);
		if (ship != null) {
		    game.rotateShipCW(key, ship);
		}
	    } else if (cmd_array[0] == "rotateCCW") {
		var ship_name = cmd_array[1];
		var ship = game.getShipByName(key, ship_name);
		if (ship != null) {
		    game.rotateShipCCW(key, ship);
		}
	    }
	}
    });*/
};
