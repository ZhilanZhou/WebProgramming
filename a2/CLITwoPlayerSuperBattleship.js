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
    var cli_player_one = new CLIPlayer(game, $('#p1_cli_input'),
				       $('#p1_cli_output'), $('#p1_view'), true);
    var cli_player_two = new CLIPlayer(game, $('#p2_cli_input'),
				       $('#p2_cli_output'), $('#p2_view'), false);
    game.startGame();
});
