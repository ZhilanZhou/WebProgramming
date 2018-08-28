$(document).ready(function () {
    $('#p1_view_btn').click(function () {
	$('#p2_view').hide();
	$('#p1_view').show();
    });

    $('#p2_view_btn').click(function () {
	$('#p1_view').hide();
	$('#p2_view').show();
    });

    var game = new SuperBattleship();
    var ai_one = new DumbAI(game, true, 1000);
    var ai_two = new DumbAI(game, false, 1000);

    var ai_one_key = ai_one.giveUpKey();
    var ai_two_key = ai_two.giveUpKey();
    
    var p1MapDrawHandler = function(e) {
	drawMap(game, $('#p1_view'), ai_one_key);
    }

    var p2MapDrawHandler = function(e) {
	drawMap(game, $('#p2_view'), ai_two_key);
    }

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
			      p1MapDrawHandler);
    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
			      p2MapDrawHandler);

    game.registerEventHandler(SBConstants.ALL_EVENTS,
			      eventLogHandler);
    
    game.startGame();
});

var eventLogHandler = function(e) {
    var event_log = $('#event_log');

    var ediv = $('<div class="event"></div>');
    switch (e.event_type) {
    case SBConstants.TURN_CHANGE_EVENT:
	if (e.who == SBConstants.PLAYER_ONE) {
	    ediv.append("Player one's turn. Turn count = " + e.game.getTurnCount())
	} else {
	    ediv.append("Player two's turn. Turn count = " + e.game.getTurnCount())
	}
	break;
    case SBConstants.HIT_EVENT:
	ediv.append("Hit player " +
		    (e.ship.getOwner() == SBConstants.PLAYER_ONE ? "one's " : "two's ") +
		    e.ship.getName() +
		    " at (" + e.x + ", " + e.y + ")");
	break;
    case SBConstants.MISS_EVENT:
	ediv.append("Miss event at (" + e.x + ", " + e.y + ")");
	break;
    case SBConstants.SHIP_SUNK_EVENT:
	ediv.append("Sunk player " + 
		    (e.ship.getOwner() == SBConstants.PLAYER_ONE ? "one's " : "two's ") +
		    e.ship.getName());
	break;
    case SBConstants.GAME_OVER_EVENT:
	ediv.append("Game over. ");
	switch (e.winner) {
	case SBConstants.PLAYER_ONE: ediv.append("Player one wins!"); break;
	case SBConstants.PLAYER_TWO: ediv.append("Player two wins!"); break;
	case SBConstants.DRAW: ediv.append("It's a draw."); break;
	}
	break;
    }
    event_log.prepend(ediv);
};

var drawMap = function(game, map, key) {
    map.empty();
    
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
    
    map.append($('<pre></pre>').text(map_str));
};


