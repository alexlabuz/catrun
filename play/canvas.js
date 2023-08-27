window.addEventListener("load",function(){
	var canvas = document.querySelector("canvas");
	var context = canvas.getContext('2d');
	
	//Boutons tactiles
	var buttonGauche = document.getElementById("gauche");
	var buttonDroit = document.getElementById("droit")
	var buttonSaut = document.getElementById("saut");
	var buttonSprint = document.getElementById("sprint");

	var hauteurPersonage = 120;
	var hauteurPlatforme = 260;
	var hauteurMax = 260;
	var vie = 5;
	var end = false;

	var sprite = new Image();
	sprite.src = "sprite.png";
	var sprite2 = new Image();
	sprite2.src = "sprite2.png";
	var background = new Image();
	background.src = "paysage.jpg";

	var position = 140;

	function menuDraw(){
		var text1;
		var text2;
		if(vie > 0){
			text1 = "Try end this game";
			text2 = "Cliquez sur espace pour démarrer";
		}else{
			text1 = "Partie terminée";
			text2 = "Saisir espace pour recharger la jeu";
			function reset(e){
				if(e.keyCode === 32 || e.type === "click"){
					document.location.reload(true);
				}
			}
			window.addEventListener("keydown", reset);
			buttonSaut.addEventListener("click", reset);
		}
		//Background
		context.fillStyle = "white";
		context.fillRect(0,0,300,300);
		
		//Text1
		context.font = "24pt arial";
		context.fillStyle = "black";
		context.textAlign = "center";
		context.fillText(text1, 150, 120);

		//Text2
		context.font = "12pt arial";
		context.fillText(text2, 150, 190);
	}

	var imageDefile = 0;
	var spriteTable = [0, 42, 83, 124, 163, 215, 255, 300, 341, 384];
	var spriteEtat = 2;
	function gameDraw(){
		toucherPiege();

		//Background
		if(arrivee > 140){
			context.drawImage(background, imageDefile, 0,600, 600, 0, 0 ,300 ,300);
		}else{
			context.fillStyle = "black";
			context.fillRect(0, 0, 300, 300);
		}

		//Ligne arrivee
		context.fillStyle = "yellow";
		context.fillRect(arrivee, 0, 20, 300);

		//Platforme
		for(i = 0; i < platforme.length; i++){
			if(platforme[i][0] < 300 && (platforme[i][0] + platforme[i][2]) > 0){
				context.fillStyle = platforme[i][4];
				context.fillRect(platforme[i][0], platforme[i][1], platforme[i][2], platforme[i][3]);
			}
		}
		//Piége
		for(i = 0; i < piege.length; i++){
			if(piege[i][0] < 300 && (piege[i][0] + 20) > 0){
				if(piege[i][2] === 0){
					context.drawImage(sprite2, 0, 0, 49, 49, piege[i][0], piege[i][1],20 ,20);
				}else{
					//Si la bombe touché on affiche le sprite explosion
					context.drawImage(sprite2, 86, 0, 76, 50, piege[i][0], piege[i][1],50 ,40);
				}
			}
		}
		//Personnage
		context.drawImage(sprite, spriteTable[spriteEtat], 0, 40, 80, 140, hauteurPersonage, 20 ,40);

		//Bar
		context.fillStyle = "rgb(40,40,150)";
		context.fillRect(0,0,300,20);

		//Text bar
		context.font = "12pt arial";
		context.textBaseline = "top";
		context.textAlign = "left";
		if(vie > 1){
			context.fillStyle = "white";
		}else{
			context.fillStyle = "red";
		}
		context.fillText("Vie : " + vie, 10, 4);
	}
	menuDraw();

	var platforme = plNiv1;
	var piege = piNiv1;
	var arrivee = arNiv1;
	//Met tout les pieges en etat non touché
	for(i = 0; i < piege.length; i++){
		piege[i][2] = 0;
	}

	function startGame(e){
		if(e.keyCode === 32 || e.type === "click"){
			graviteInterval = setInterval(gravite, 10);//Gravité toujours active
			timerInterval = setInterval(timer, 1000);
			window.addEventListener("keydown", toucheControl);

			tactileButton(true, "Saut");
			window.removeEventListener("keydown", startGame);
			buttonSaut.removeEventListener("click", startGame);
			gameDraw();
		}
	}
	window.addEventListener("keydown", startGame);
	buttonSaut.addEventListener("click", startGame);

	var sautActive = false;
	var deplaceActive = true;
	var sprintActive = true;
	var graviteActive = true;
	function toucheControl(e){
		//Vérifie si l'appuie viens d'un clavier ou des boutons tactile
		if(e.keyCode === undefined){
			touche = e; //Tactile
		}else{
			touche = e.keyCode //Clavier
		}

		switch(touche){
			case 32:
				if(sautActive){
					sautActive = false;
					saut();
				}
				break;
			case 37:
				if(deplaceActive){
					deplaceActive = false;
					deplaceMap("g");
				}
				break;
			case 39:
				if(deplaceActive){
					deplaceActive = false;
					deplaceMap("d");
				}
				break;
			case 70:
				if(sprintActive){
					sprintActive = false;
					sprint();
				}
				break;
		}
	}

	/*---FONCTION TOUCHES TACTILES---*/
	function attributionTactile(){
		switch(this.getAttribute("id")){
			case "gauche":
				toucheControl(37);
				break;
			case "droit":
				toucheControl(39);
				break;
			case "saut":
				toucheControl(32);
				break;
			case "sprint":
				if(speed === 6){
					speed = 4;
					buttonSprint.removeAttribute("style");
				}else{
					speed = 6;
					buttonSprint.style.backgroundColor = "red";
				}
		}
	}
	function tactileButton(active, textButtonSaut){
		if(active){
			buttonGauche.addEventListener("touchstart",attributionTactile);
			buttonDroit.addEventListener("touchstart",attributionTactile);
			buttonSaut.addEventListener("touchstart", attributionTactile);
			buttonSprint.addEventListener("touchstart", attributionTactile);
		}else{
			buttonGauche.removeEventListener("touchstart",attributionTactile);
			buttonDroit.removeEventListener("touchstart",attributionTactile);
			buttonSaut.removeEventListener("touchstart", attributionTactile);
			buttonSprint.removeEventListener("touchstart", attributionTactile);
		}
		buttonSaut.textContent = textButtonSaut;
	}
	tactileButton(false, "ESPACE");
	/*---FIN---*/

	function saut(){
		graviteActive = false;
		drawGravite = true;
		hauteurActuel = hauteurPersonage;

		sautInterval = setInterval(function(){

			hauteurPersonage = hauteurPersonage - 5;
			if(hauteurPersonage > (hauteurMax - 5)){
				if(hauteurPersonage <= hauteurMax){
					clearInterval(sautInterval);
					graviteActive = true;
				}
			}else{
				if(hauteurPersonage <= 140 - (260-hauteurActuel)){
					clearInterval(sautInterval);
					graviteActive = true;
				}
			}
			gameDraw();

		}, 10);

		function stopSaut(e){
			if(e.keyCode === 32 || e.type === "touchend"){
				clearInterval(sautInterval);
				graviteActive = true;
				window.removeEventListener("keyup", stopSaut);
				buttonSaut.removeEventListener("touchend", stopSaut);
			}
		}
		window.addEventListener("keyup", stopSaut); //Relachement clavier
		buttonSaut.addEventListener("touchend", stopSaut); //Relachement tactile
	}

	var drawGravite = true;
	function gravite(){
		if(graviteActive){

			if(hauteurPersonage < hauteurPlatforme){
				hauteurPersonage = hauteurPersonage + 5;
				if(hauteurPersonage > (hauteurPlatforme - 5)){
					hauteurPersonage = hauteurPlatforme;
				}
			}else if(hauteurPersonage > hauteurPlatforme && hauteurPersonage < 260){
				if(hauteurPersonage < 260){
					hauteurPersonage = hauteurPersonage + 5;
				}
			}
			else{
				if(hauteurPersonage > 240){
					hauteurPersonage = 260;
				}
				sautActive = true;
				drawGravite = false;
			}

		}
		if(drawGravite){
			gameDraw();
		}
	}

	var collisionGauche = null;
	var collisionDroit = null;

	var speed = 4;
	function deplaceMap(direction){

		deplaceInterval = setInterval(function(){
			if(direction === "d" && !collisionDroit){
				//Sprite défilement
				if(sautActive){
					spriteEtat++;
					if(spriteEtat > 4){
						spriteEtat = 0;
					}
				}else{
					spriteEtat = 2;
				}

				//Défilement background
				if(!sprintActive){
					imageDefile++;
				}else{
					imageDefile = imageDefile + 0.5;
				}

				position = position + speed;
				arrivee = arrivee - speed;
				for(i2 = 0; i2 < platforme.length; i2++){
					platforme[i2][0] = platforme[i2][0] - speed;
				}
				for(i2 = 0; i2 < piege.length; i2++){
					piege[i2][0] = piege[i2][0] - speed;
				}
			}
			else if (direction === "g" && !collisionGauche){
				//Sprite défilement
				if(sautActive){
					spriteEtat++;
					if(spriteEtat > 9 || spriteEtat < 5){
						spriteEtat = 5;
					}
				}else{
					spriteEtat = 7;
				}

				//Sprite background
				if(!sprintActive){
					imageDefile--;
				}else{
					imageDefile = imageDefile - 0.5;
				}

				position = position - speed;
				arrivee = arrivee + speed;
				for(i2 = 0; i2 < platforme.length; i2++){
					platforme[i2][0] = platforme[i2][0] + speed;
				}
				for(i2 = 0; i2 < piege.length; i2++){
					piege[i2][0] = piege[i2][0] + speed;
				}
			}

			/*---Colision droite et gauche---*/
			for(i = 0; i < platforme.length; i++){

				//Vérif droit
				if(platforme[i][0]-16 > 136 && platforme[i][0]-16 < 147){ 
					//Vérif hauteur
					if(hauteurPersonage > (platforme[i][1]-40) && hauteurPersonage < (platforme[i][1] + platforme[i][3])){
						collisionDroit = true;
					}else{
						collisionDroit = false;
					}
    				break; //Si colision détetctée (on stop la boucle)
				}
				//Vérif gauche
				else if((platforme[i][0] + platforme[i][2]) > 136 && (platforme[i][0] + platforme[i][2]) < 147){ 
					//Vérif hauteur
					if(hauteurPersonage > (platforme[i][1]-40) && hauteurPersonage < (platforme[i][1] + platforme[i][3])){
						collisionGauche = true;
					}else{
						collisionGauche = false;
					}
    				break; //Si colision détetctée (on stop la boucle)
				}
				else{
					collisionDroit = false;
					collisionGauche = false;
					drawGravite = true;
				}

			}
			/*---Colision haut et bas---*/
			for(i2 = 0; i2 < platforme.length; i2++){
				
				if(platforme[i2][0]-20 < 139 && (platforme[i2][0] + platforme[i2][2]) > 141){
					hauteurPlatforme = (platforme[i2][1]-40);
					hauteurMax = platforme[i2][1] + platforme[i2][3];
					break; //Si colision détetctée (on stop la boucle)
				}else{
					hauteurPlatforme = 260;
					hauteurMax = 260;
				}
				
			}

			//Arriver au bout du parcours
			if(arrivee <= 140 && !end){
				winGame();
			}
			
			gameDraw();
		}, 30);

		function stopDeplace(e){
			if(e.keyCode === 37 || e.keyCode === 39 || e.type === "touchend"){
				if(!end){
					clearInterval(deplaceInterval);
					deplaceActive = true;
				}
				window.removeEventListener("keyup", stopDeplace);
				buttonGauche.removeEventListener("touchend", stopDeplace);
				buttonDroit.removeEventListener("touchend", stopDeplace);
			}
		}
		window.addEventListener("keyup", stopDeplace);
		buttonGauche.addEventListener("touchend", stopDeplace);
		buttonDroit.addEventListener("touchend", stopDeplace);

	}

	function toucherPiege(){
		if(end != true){
		for(i = 0; i < piege.length; i++){

			if((piege[i][0]-20 < 140) && (piege[i][0] + 20) > 140){
				if((piege[i][1] < hauteurPersonage+40) && (piege[i][1] + 20 > hauteurPersonage)){
					if(piege[i][2] === 0){
						vie--;
					}
					if(vie <= 0){
						vie = 0;
						endGame();
					}

					piege[i][2] = 1;

					var dernierPiege = i;
					setTimeout(function(){
						delete piege[dernierPiege][2];
						delete piege[dernierPiege][1];
						delete piege[dernierPiege][0];
						gameDraw();
					}, 450);
				}
			}

		}
		}
	}

	var userTime = 0;
	function timer(){
		userTime++;
	}

	function sprint(){
		speed = 6;
		window.addEventListener("keyup", function(e){
			if(e.keyCode === 70){
				sprintActive = true;
				if(end === false){
					speed = 4;
				}
			}
		});
	}

	function winGame(){
		end = true;
		window.removeEventListener("keydown", toucheControl);
		tactileButton(false, "");
		clearInterval(deplaceInterval);
		clearInterval(sautInterval);
		clearInterval(timerInterval);

		speed = 2;
		deplaceMap("d");

		setTimeout(function(){
			clearInterval(deplaceInterval);

			context.textAlign = "center";
			context.fillStyle = "rgb(220,220,80)";
			context.font = "24pt arial";
			context.fillText("Stage terminé", 150, 70);

			/*
			context.fillStyle = "white";
			//Vérifie si le joueur est dans le classement
			ajaxGet("../server/ranking.json", function(e){
				var tableRanking = JSON.parse(e);
				if(tableRanking.length >= 5){
					if(userTime < tableRanking[4][0]){
						addScoreRanking();
					}else{
						displayRanking();
					}
				}else{
					addScoreRanking();
				}

			});
			*/

			context.textAlign = "center";
			context.font = "12pt arial";
			context.fillStyle = "#97ff49";
			context.fillText("Votre temps : " + userTime + " sec", 150, 150);

			context.font = "10pt arial";
			context.fillStyle = "white";
			context.fillText("Développement : Alex Labuz", 150, 220);
			context.fillText("Graphisme : Elisa Labuz", 150, 240);
			context.fillText("Projet pour le Lycée Guy Mollet d'Arras, 2019", 150, 260);
		}, 2500);
		
	}

	function endGame(){
		end = true;
		window.removeEventListener("keydown", toucheControl);
		tactileButton(false, "ESPACE");
		clearInterval(graviteInterval);
		clearInterval(sautInterval);
		clearInterval(timerInterval);

		var endInterval = setInterval(function(){

			hauteurPersonage = hauteurPersonage + 5;
			gameDraw();
			if(hauteurPersonage >= 300){
				clearInterval(deplaceInterval);
				clearInterval(endInterval);
				setTimeout(menuDraw, 1200);
			}

		}, 10);
	}

	function displayRanking(){
		ajaxGet("../server/ranking.json?1", function(e){
			var tableRanking = JSON.parse(e);

			var heightfillText = 110;
			context.textAlign = "left";
			context.font = "12pt arial";
			
			for(i = 0; i < tableRanking.length; i++){
				context.fillText((i+1) + ". " + tableRanking[i][1] + " | " + tableRanking[i][0] + " sec", 70, heightfillText);
				heightfillText = heightfillText + 20;
			}
			context.fillStyle = "#97ff49";
			context.fillText("Votre temps : " + userTime + " sec", 70, heightfillText);
		});
	}

	function addScoreRanking(){
		var userName = prompt("FELICITATION. Vous êtes dans le classement, saisissez votre nom :");
		if(userName === null){
			displayRanking();
		}
		else if(userName.length >= 3 && userName.length <= 12){
			var userData = new FormData;
			userData.append("pseudo", userName);
			userData.append("time", userTime);
			ajaxPost("../server/score.php", userData, displayRanking ,false);
		}else{
			return addScoreRanking();
		}
	}
});