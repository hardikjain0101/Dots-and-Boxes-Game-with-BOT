var boxes = [];
var turn = true;
var you = 0;
var comp = 0;


function load(size){

	boxes = [];
	turn = true;
	you = 0;
	comp = 0;
	var m = size;
	var n = size;
	var offset = 50;

	var sx= sx = window.innerWidth/2 - (m*offset)/2,
	sy = offset*2.5;
	var html = "";
	$("#app").html(html);
	var c = 0;
	for(var j=0; j<m; j++){
		for(var i=0; i<n; i++){

			var x = sx + i * offset,
				y = sy + j * offset;

			html += `
				<div class="box" data-id="${c}" style="z-index=${i-1}; left:${x+2.5}px; top:${y+2.5}px"></div>
				<div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>						
				<div class="line lineh" data-line-1="${c}" data-line-2="${c-m}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				<div class="line linev" data-line-1="${c}" data-line-2="${c-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				`;			
			boxes.push(0);
			c++;
		}
	}

	//right boxes
	for(var i=0; i<n; i++){
		var x = sx + m * offset,
			y = sy + i * offset;
		html += `				
				<div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>
				<div class="line linev" data-line-1="${m*(i+1)-1}" data-line-2="${-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				`;		
	}

	//bottom boxes
	for(var i=0; i<m; i++){
		var x = sx + i * offset,
			y = sy + n * offset;
		html += `				
				<div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>
				<div class="line lineh" data-line-1="${((n-1)*m)+i}" data-line-2="${-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				`;		
	}

	//right-bottom most dot
	html += `<div class="dot" style="z-index=${i}; left:${sx+m*offset-5}px; top:${sy+n*offset-5}px" data-active="false"></div>`
	
	//append to dom
	$("#app").html(html);
	applyEvents();
}

function applyEvents(){
	$("div.line").unbind('click').bind('click', function(){

		var id1 = parseInt($(this).attr("data-line-1"));
		var id2 = parseInt($(this).attr("data-line-2"));  
		
		if(checkValid(this) && turn){	
			var a = false, b = false;

			if(id1 >= 0) var a = addValue(id1);
			if(id2 >= 0) var b = addValue(id2);
			$(this).addClass("line-active");
			$(this).attr("data-active", "true");

			if(a === false && b === false){
				computer();	
			}			
		}	
	});
}

function acquire(id){

	var color;
	if(turn){
		color = SelPlayerColor//"salmon";
		you++;
	}else{
		color = SelBotColor//"skyblue";
		comp++;
	}
	
	$("div.box[data-id='"+id+"']").css("background-color", color);	
	boxes[id] = "full";

	$(".player2").text("You : " + you);
	$(".player1").text("Computer : " + comp);
	console.log(boxes);

	var full = true;
	for(var i=boxes.length-1; i>=0; i--){
		if(boxes[i] != "full"){
			full = false;
			break;
		}
	}

	if(full) alert(((you>comp) ? "You": "Computer") + " won");
}


function addValue(id){
	boxes[id]++;

	if(boxes[id] === 4){
		acquire(id);
		return true;
	}
	return false;
}


function checkValid(t){
	return($(t).attr("data-active") === "false");
}

function computer(){
	turn = false;
	$("#turn").text("Turn : " + "Computer");

	setTimeout(function(){		

		//play
		var length = boxes.length;

		var arr3 = [], arr2 = [], arr1 = [], arr0 = [];

		for(var i=length-1; i>=0; i--){
			if(boxes[i] === 3) arr3.push(i);
			else if(boxes[i] === 2) arr2.push(i);
			else if(boxes[i] === 1) arr1.push(i);
			else arr0.push(i);
		}

		//best case
		if(arr3.length > 0){
			computerSelect(arr3[random(0, arr3.length-1)]);
		}

		//better case
		else if(arr2.length > 0){
			computerSelect(arr2[random(0, arr2.length-1)]);
		}

		//normal case
		else if(arr1.length > 0){
			computerSelect(arr1[random(0, arr1.length-1)]);
		}

		//worst case
		else if(arr0.length > 0){
			computerSelect(arr0[random(0, arr0.length-1)]);
		}
		
	}, 500);

}

function selectBox(){

}


function computerSelect(id){
	console.log("Box " + id);

	$("div.line[data-line-1='"+id+"'], div.line[data-line-2='"+id+"']").each(function(i, v){		
		if(!$(v).hasClass("line-active")){
			var id1 = parseInt($(v).attr("data-line-1"));
			var id2 = parseInt($(v).attr("data-line-2"));  

			console.log("----- " + turn);

			if(checkValid(v) && turn === false){
				console.log("-----");
				if(id1 >= 0) var a = addValue(id1);
				if(id2 >= 0) var b = addValue(id2);
				$(v).addClass("line-active");
				$(v).attr("data-active", "true");

				if(a === true || b === true){
					computer();	
				}else{
					turn = true;
					$("#turn").text("Turn : " + "You");
				}					
			}
		}
	});
}

function random(min, max){        
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var SelPlayerColor ="#FA8072"
var SelBotColor ="skyblue"
function showGridOptionsPopup() {
	var popup = document.createElement("div");
	popup.style.position = "fixed";
	popup.style.top = "0";
	popup.style.left = "0";
	popup.style.width = "100%";
	popup.style.height = "100%";
	popup.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
	popup.style.display = "flex";
	popup.style.alignItems = "center";
	popup.style.justifyContent = "center";
  
	var form = document.createElement("form");
	form.style.backgroundColor = "#fff";
	form.style.padding = "20px";
	form.style.borderRadius = "5px";
  
	var title = document.createElement("h1");
	title.textContent = "Grid Options";
	title.style.fontSize = "30px";
	title.style.marginBottom = "20px";
  
	var gridSizeLabel = document.createElement("label");
	gridSizeLabel.textContent = "Grid Size:";
	gridSizeLabel.style.fontSize = "20px";
	gridSizeLabel.style.display = "block";
	gridSizeLabel.style.marginBottom = "10px";
  
	var gridSizeDropdown = document.createElement("select");
	gridSizeDropdown.style.fontSize = "20px";
	gridSizeDropdown.style.padding = "10px";
	gridSizeDropdown.style.marginBottom = "20px";
  
	var option1 = document.createElement("option");
	option1.text = "2x2";
	gridSizeDropdown.add(option1);

	var option2 = document.createElement("option");
	option2.text = "3x3";
	gridSizeDropdown.add(option2);
  
	var option3 = document.createElement("option");
	option3.text = "4x4";
	gridSizeDropdown.add(option3);

	var option4 = document.createElement("option");
	option4.text = "5x5";
	gridSizeDropdown.add(option4);
  
	var option5 = document.createElement("option");
	option5.text = "6x6";
	gridSizeDropdown.add(option5);

	var option6 = document.createElement("option");
	option6.text = "7x7";
	gridSizeDropdown.add(option6);

	var option7 = document.createElement("option");
	option7.text = "8x8";
	gridSizeDropdown.add(option7);

	var option8 = document.createElement("option");
	option8.text = "9x9";
	gridSizeDropdown.add(option8);

	var option9 = document.createElement("option");
	option9.text = "10x10";
	gridSizeDropdown.add(option9);
  
	var playerColorLabel = document.createElement("label");
	playerColorLabel.textContent = "Player Color:";
	playerColorLabel.style.fontSize = "20px";
	playerColorLabel.style.display = "block";
	playerColorLabel.style.marginBottom = "10px";
  
	var playerColorInput = document.createElement("input");
	playerColorInput.type = "color";
	playerColorInput.style.fontSize = "20px";
	playerColorInput.style.padding = "10px";
	playerColorInput.style.marginBottom = "20px";
  
	var botColorLabel = document.createElement("label");
	botColorLabel.textContent = "Bot Color:";
	botColorLabel.style.fontSize = "20px";
	botColorLabel.style.display = "block";
	botColorLabel.style.marginBottom = "10px";
  
	var botColorInput = document.createElement("input");
	botColorInput.type = "color";
	//botColorInput.value=
	botColorInput.style.fontSize = "20px";
	botColorInput.style.padding = "10px";
	botColorInput.style.marginBottom = "20px";
	
	var button = document.createElement("button");
	button.textContent = "Load";
	button.style.display="block"
	
	button.style.fontSize = "20px";
	button.style.padding = "10px";
  
	button.addEventListener("click", function() {
	  var selectedGridSize = gridSizeDropdown.value;
	  var selectedPlayerColor = playerColorInput.value;
	  var selectedBotColor = botColorInput.value;
	  var size=2
	  console.log(selectedPlayerColor);
	  if("3x3"===selectedGridSize){
		size=3
	  } 
	  if("4x4"===selectedGridSize){
		size=4
	  }
	  if("5x5"===selectedGridSize){
		size=5
	  }
	  if("6x6"===selectedGridSize){
		size=6
	  }
	  if("7x7"===selectedGridSize){
		size=7
	  }
	  if("8x8"===selectedGridSize){
		size=8
	  }
	  if("9x9"===selectedGridSize){
		size=9
	  }
	  if("10x10"===selectedGridSize){
		size=10
	  }
	  if("#000000" != selectedPlayerColor){
		SelPlayerColor = selectedPlayerColor
	  }
	  if("#000000" != selectedBotColor){
		SelBotColor = selectedBotColor
	  }
	  $(".player2").css('color',SelPlayerColor);
	  $(".player1").css('color',SelBotColor);
	  load(size//,
		 //selectedPlayerColor,
		  //selectedBotColor
		  );
	  popup.remove();
	});
  
	form.appendChild(title);
	form.appendChild(gridSizeLabel);
	form.appendChild(gridSizeDropdown);
	form.appendChild(playerColorLabel);
	form.appendChild(playerColorInput);
	form.appendChild(botColorLabel);
	form.appendChild(botColorInput);
	form.appendChild(button);
  
	popup.appendChild(form);
  
	document.body.appendChild(popup);
  }
  

  showGridOptionsPopup()
  