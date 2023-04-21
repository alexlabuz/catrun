<?php
$rankingJson = file_get_contents("ranking.json");

if(isset($_POST['time'])){
	$tableRanking = json_decode($rankingJson);

	$table[0] = intval($_POST['time']);
	$table[1] = $_POST['pseudo'];

	if(count($tableRanking) >= 5){
		if($_POST['time'] < $tableRanking[4][0]){
			array_push($tableRanking, $table);

			sort($tableRanking);
			$supp = array_pop($tableRanking);
		}
	}else{
		array_push($tableRanking, $table);
		sort($tableRanking);
	}

	file_put_contents("ranking.json", json_encode($tableRanking));
}