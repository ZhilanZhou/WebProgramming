var CLIPlayer = function (game, cli_output, map, is_player_one) {
    
    if (is_player_one) {
	var key = game.registerPlayerOne();
    } else {
	key = game.registerPlayerTwo();
    }


    cli_output = $(cli_output);
    map = $(map);
    var ship = $("#ship");
    var action = $("#action");
    
    var eventLogHandler = function(e) {
	var cli_msg = $('<div class="cli_msg"></div>');
	
	switch (e.event_type) {
	case SBConstants.TURN_CHANGE_EVENT:
	    if (e.who == SBConstants.PLAYER_ONE) {
		cli_msg.text("Player one's turn");
	    } else {
		cli_msg.text("Player two's turn");
	    }
	    break;
	case SBConstants.MISS_EVENT:
	    cli_msg.text("Oh no! You missed it!");
	    break;
	case SBConstants.HIT_EVENT:
	    cli_msg.text("Great! You hit the enemy!");
	    break;
	case SBConstants.SHIP_SUNK_EVENT:
	    var ship = e.ship;
	    if (ship.isMine(key)) {
		var pos = ship.getPosition(key);
		cli_msg.text("Foe sunk your " + ship.getName() + ". Be optimistic.");
	    } else {
		var pos = ship.getPosition(null); // This works because ship is dead.
		cli_msg.text("You sunk their " + ship.getName() + ". Go on!");
	    }
	    break;
	case SBConstants.GAME_OVER_EVENT:
	    if (is_player_one && e.winner == SBConstants.PLAYER_ONE) {
		cli_msg.text("You win!");
	    } else {
		cli_msg.text("You lose...");
	    }
	    break;
	}
	cli_output.prepend(cli_msg);
    };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT, eventLogHandler);
    game.registerEventHandler(SBConstants.MISS_EVENT, eventLogHandler);
    game.registerEventHandler(SBConstants.HIT_EVENT, eventLogHandler);
    game.registerEventHandler(SBConstants.SHIP_SUNK_EVENT, eventLogHandler);


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
    };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT, mapDrawHandler);

    $(function(){
        $('#p1_view').on('click', 'td', function(){
            //$(this).addClass('hit');
            var position = this.id;
            if (position.charAt(2) == "c"){
                var x = position.substring(1,2);
                if (position.length == 4){
                    var y = position.substring(3,4);
                }else{
                    var y = position.substring(3,5);
                }
            }else{
                var x = position.substring(1,3);
                if (position.length == 5){
                    var y = position.substring(4,5);
                }else{
                    var y = position.substring(4,6);
                }
            }
            game.shootAt(key, x, y);
        });
    });
    
    $(function(){
        $('#move').on('click', function(){
            var ship_name = ship.val();
            var current_ship = game.getShipByName(key, ship_name);
            var action_name = action.val();
            if (ship == null){
                cli_msg.text("This ship is sunk!");
            }else{
                if (action_name == "forward"){
                     game.moveShipForward(key, current_ship);
                }else if (action_name == "backward"){
                    game.moveShipBackward(key, current_ship);
                }else if (action_name == "clockwise"){
                    game.rotateShipCW(key, current_ship);
                }else if (action_name == "counterclockwise"){
                    game.rotateShipCCW(key, current_ship);
                }
            }
        });
    });
    
};
