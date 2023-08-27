var buttonOpenWindow = document.getElementById("openWindow");
var buttonCloseWindow = document.getElementById("closeWindow");

var buttonCloseRanking = document.getElementById("closeRanking");

var divHelp = document.getElementById("help");
var divMain = document.getElementById("main");
var divRanking = document.getElementById("ranking");

buttonOpenWindow.addEventListener("click", function(){
	buttonOpenWindow.disabled = "disabled";
	divHelp.style.display = "block";

});
buttonCloseWindow.addEventListener("click", function(){
	buttonOpenWindow.removeAttribute("disabled");
	divHelp.style.display = "none";
});

buttonCloseRanking.addEventListener("click", function(){
	buttonOpenRanking.removeAttribute("disabled");
	divRanking.style.display = "none";
});

document.getElementById("play").addEventListener("click", function(){
	window.location = "play/";
});

/*
ajaxGet("server/ranking.json?" + Math.round(+new Date() / 1000), function(e){
	rankingTable = JSON.parse(e);

	for(i = 0; i < rankingTable.length; i++){
		var trTable = document.createElement("tr");

		var tdRang = document.createElement("td");
		tdRang.textContent = (i+1) + ". ";
		tdRang.className = "rang";

		var tdScore = document.createElement("td");
		tdScore.textContent = rankingTable[i][0] + " sec";
		
		var tdName = document.createElement("td");
		tdName.textContent = rankingTable[i][1];

		trTable.appendChild(tdRang);
		trTable.appendChild(tdScore);
		trTable.appendChild(tdName);
		document.getElementById("rankingTable").appendChild(trTable);
	}
});
*/