let grid_hidden,new_row;
let amount_of_bombs = 20,bomb_near = 0,bomb_multipler = 2;
let placing_flag = false,amount_of_flags = amount_of_bombs;
let row_number,box_number; // column first then row
let number_of_rows = 20,number_of_boxes = 30;
let game_over = false;
let revealed_zero_color = "rgba(255, 255, 255, 0.5)" // careful to syntax here
let seconds = 0, minutes = 0, timer_stop = false;

function loading() {
	size(20,30)
	grid_reset()
	updateTimer()
}

function size(new_value_one,new_value_two) {
	if (screen.width>screen.height) {
		number_of_rows = new_value_one
		number_of_boxes = new_value_two
	} else {
		number_of_rows = new_value_two
		number_of_boxes = new_value_one
	}
	document.getElementsByClassName('selected_size')[0].innerText = "Selected size: " + number_of_rows + "x" + number_of_boxes
}

function difficulty(multiplier,text_to_display) {
	bomb_multipler = multiplier
	document.getElementsByClassName('selected_difficulty')[0].innerText = "Selected difficulty: " + text_to_display
}

function grid_reset() {
	seconds = 0
	minutes = 0
	game_over = false;
	timer_stop = true;
	grid_generated = false;
	grid_html = document.getElementsByClassName("grid")[0]
	for (var i = grid_html.getElementsByClassName("rows").length - 1; i >= 0; i--) {
		remove_row = grid_html.getElementsByClassName("rows")[i]
		remove_row.remove()
	}
	grid_shown = new Array(number_of_rows)
	grid_hidden = new Array(number_of_rows)
	for (var i = 0; i < grid_shown.length; i++) {
		grid_shown[i] = new Array(number_of_boxes)
		grid_hidden[i] = new Array(number_of_boxes)

		new_row = document.createElement('tr');
		new_row.className = "rows"
		new_row.Name = i
		for (var j = 0; j < grid_shown.length; j++) {
			let new_box = document.createElement('td');
			new_row.appendChild(new_box);
			new_box.className = "box"
			new_box.Name = j
			new_box.addEventListener("click", play)
			new_box.addEventListener("contextmenu", right_click)
		}
		grid_html.appendChild(new_row);
	}
}

function grid_generation(start_row,start_box) {
	// bomb generation
	timer_stop = false
	grid_generated = true
	amount_of_bombs = bomb_multipler*Math.floor(Math.sqrt(number_of_rows))*Math.floor(Math.sqrt(number_of_boxes));
	amount_of_flags = amount_of_bombs;
	placing_flag = false;
	document.getElementsByClassName('amount_of_flags')[0].innerText = "Amount of flags: " + amount_of_flags
	for (var i = 0; i < amount_of_bombs; i++) {
		box_number = Math.floor(Math.random()*grid_shown.length)
		row_number = Math.floor(Math.random()*grid_shown.length)
		while ((grid_hidden[row_number][box_number]!=undefined)&&((row_number!=start_row)||(box_number!=start_box))) {
			box_number = Math.floor(Math.random()*grid_shown.length)
			row_number = Math.floor(Math.random()*grid_shown.length)
		}
		grid_hidden[row_number][box_number] = "bomb"
	}
	// number sync
	for (var row_number = 0; row_number < grid_shown.length; row_number++) {
		for (var box_number = 0; box_number < grid_shown.length; box_number++) {
			bomb_near = 0
			if (grid_hidden[row_number][box_number-1]=="bomb") { // above
				bomb_near+=1
			}
			if (grid_hidden[row_number+1]!=undefined) { // right
				if (grid_hidden[row_number+1][box_number-1]=="bomb") { 
					bomb_near+=1
				}
				if (grid_hidden[row_number+1][box_number]=="bomb") {
					bomb_near+=1
				}
				if (grid_hidden[row_number+1][box_number+1]=="bomb") {
					bomb_near+=1
				}
			}
			if (grid_hidden[row_number][box_number+1]=="bomb") { // under
				bomb_near+=1
			}
			if (grid_hidden[row_number-1]!=undefined) { // left
				if (grid_hidden[row_number-1][box_number-1]=="bomb") { 
					bomb_near+=1
				}
				if (grid_hidden[row_number-1][box_number]=="bomb") {
					bomb_near+=1
				}
				if (grid_hidden[row_number-1][box_number+1]=="bomb") {
					bomb_near+=1
				}
			}
			if ((grid_hidden[row_number][box_number]!="bomb")&&(grid_hidden[row_number][box_number]!="0")) {
				grid_hidden[row_number][box_number] = bomb_near
			}
			if (grid_hidden[row_number][box_number]=="0") {
				grid_hidden[row_number][box_number] = ""
			}
			//grid_html.getElementsByClassName("rows")[row_number].getElementsByClassName("box")[box_number].innerText = grid_hidden[row_number][box_number] // that's for output not for normal games
		}
	}
}

function flag_status() {
	if (placing_flag) {
		placing_flag = false;
		document.getElementsByClassName('placing_flag')[0].innerText = "You are currently not placing a flag"
	} else {
		placing_flag = true
		document.getElementsByClassName('placing_flag')[0].innerText = "You are currently placing a flag"
	}
}

function updateTimer() {
	if (!timer_stop) {
		seconds ++
	}
   
     setTimeout(updateTimer, 1000)
     if (seconds==60) {
     	seconds=0
     	minutes+=1
     }
     if ((minutes==59)&&(seconds==59)) {
     	stop_timer = true
     }
     if (seconds<10) {
    	document.getElementsByClassName('timer')[0].innerText = "Timer: " + minutes + ":0" + seconds
     } else {
    	document.getElementsByClassName('timer')[0].innerText = "Timer: " + minutes + ":" + seconds
    }
     if ((seconds==0)&&(minutes==0)) {
    	document.getElementsByClassName('timer')[0].innerText = "Game didn't start yet, click on a box to play."
     }
}

function right_click(e) {
	placing_flag = true
	temp_flag = true
	e.preventDefault()
	play(e)
}

function play(e) {
	if (game_over) {
		if (game_win) {
			alert("The game is over, you won")
		} else {
			alert("The game is over, you lost")
		}
		return
	}
	box_selected = e.target
	box_number = box_selected.Name
	row_number = box_selected.parentElement.Name
	//console.log(grid_hidden[row_number][box_number])
	if (!grid_generated) {
		grid_generation()
	}
	if (placing_flag) {
		if ((box_selected.style.backgroundImage=="")&&(box_selected.innerText=="")&&(amount_of_flags>0)&&(box_selected.style.backgroundColor=="")) {
			box_selected.style.backgroundImage = 'url("http://bit.ly/target_png")';
			amount_of_flags--
			document.getElementsByClassName('amount_of_flags')[0].innerText = "Amount of flags: " + amount_of_flags
			if (temp_flag) {
				placing_flag = false
			}
		} else if (box_selected.style.backgroundImage=='url("http://bit.ly/target_png")') { // careful with the " or '
			box_selected.style.backgroundImage = "";
			amount_of_flags++
			document.getElementsByClassName('amount_of_flags')[0].innerText = "Amount of flags: " + amount_of_flags
		}
		temp_flag = false
	} else {
		if (grid_hidden[row_number][box_number]=="bomb") {
			box_selected.style.backgroundImage = "url('http://bit.ly/bomb_png')"
			alert("You hit a bomb!")
			end_game(false)
		}
		if (grid_hidden[row_number][box_number]==0) {
			box_selected.style.backgroundColor = revealed_zero_color;
			box_selected.style.backgroundImage = "";
			reveal_the_zeros(row_number,box_number)
		}
		if (grid_hidden[row_number][box_number]>0) {
			reveal_box(row_number,box_number)
		}
	}
}

function reveal_the_zeros(temp_row,temp_box) {
	//console.log("calling function with arguments: ",temp_row,temp_box)
	if (grid_hidden[temp_row-1]!=undefined) {
		box_above = grid_html.getElementsByClassName("rows")[temp_row-1].getElementsByClassName("box")[temp_box]
		if ((grid_hidden[temp_row-1][temp_box]==0)&&(box_above.style.backgroundColor!=revealed_zero_color)) { // if it's 0
			reveal_box(temp_row-1,temp_box) // reveal box
			reveal_the_zeros(temp_row-1,temp_box) // restart function on the revealed box
		}
		if ((box_above.style.backgroundColor!=revealed_zero_color)&&(box_above.innerText=="")) { // if the box above is unrevealed but nearby is a 0
			reveal_box(temp_row-1,temp_box) // then reveal the box
		}
	}
	if (grid_hidden[temp_row+1]!=undefined) {
		box_under = grid_html.getElementsByClassName("rows")[temp_row+1].getElementsByClassName("box")[temp_box]
		if ((grid_hidden[temp_row+1][temp_box]==0)&&(box_under.style.backgroundColor!=revealed_zero_color)) {
			reveal_box(temp_row+1,temp_box)
			reveal_the_zeros(temp_row+1,temp_box)
		}
		if ((box_under.style.backgroundColor!=revealed_zero_color)&&(box_under.innerText=="")) { // The second condition is to stop a very weird bug that I can't figure out the cause
			reveal_box(temp_row+1,temp_box)
		}
	}
	if (grid_hidden[temp_row][temp_box-1]!=undefined) {
		box_left = grid_html.getElementsByClassName("rows")[temp_row].getElementsByClassName("box")[temp_box-1]
		if ((grid_hidden[temp_row][temp_box-1]==0)&&(box_left.style.backgroundColor!=revealed_zero_color)) {
			box_left.style.backgroundColor = revealed_zero_color;
			reveal_box(temp_row,temp_box-1)
			reveal_the_zeros(temp_row,temp_box-1)
		}
		if ((box_left.style.backgroundColor!=revealed_zero_color)&&(box_left.innerText=="")) {
			reveal_box(temp_row,temp_box-1)
		}
	}
	if (grid_hidden[temp_row][temp_box+1]!=undefined) {
		box_right = grid_html.getElementsByClassName("rows")[temp_row].getElementsByClassName("box")[temp_box+1]
		if ((grid_hidden[temp_row][temp_box+1]==0)&&(box_right.style.backgroundColor!=revealed_zero_color)) {
			box_right.style.backgroundColor = revealed_zero_color;
			reveal_box(temp_row,temp_box+1)
			reveal_the_zeros(temp_row,temp_box+1)
		}
		if ((box_right.style.backgroundColor!=revealed_zero_color)&&(box_right.innerText=="")) {
			reveal_box(temp_row,temp_box+1)
		}
	}
	// doing the corners below
	if (grid_hidden[temp_row+1]!=undefined) {
		if (grid_hidden[temp_row+1][temp_box+1]!=undefined) {
			box_bottom_right = grid_html.getElementsByClassName("rows")[temp_row+1].getElementsByClassName("box")[temp_box+1]
			if ((grid_hidden[temp_row+1][temp_box+1]==0)&&(box_bottom_right.style.backgroundColor!=revealed_zero_color)) {
				reveal_box(temp_row+1,temp_box+1)
				reveal_the_zeros(temp_row+1,temp_box+1)
			}
			if ((box_bottom_right.style.backgroundColor!=revealed_zero_color)&&(box_bottom_right.innerText=="")) {
				reveal_box(temp_row+1,temp_box+1)
			}
		}
		
	}
	if (grid_hidden[temp_row+1]!=undefined) {
		if (grid_hidden[temp_row+1][temp_box-1]!=undefined) {
			box_bottom_left = grid_html.getElementsByClassName("rows")[temp_row+1].getElementsByClassName("box")[temp_box-1]
			if ((grid_hidden[temp_row+1][temp_box-1]==0)&&(box_bottom_left.style.backgroundColor!=revealed_zero_color)) {
				reveal_box(temp_row+1,temp_box-1)
				reveal_the_zeros(temp_row+1,temp_box-1)
			}
			if ((box_bottom_left.style.backgroundColor!=revealed_zero_color)&&(box_bottom_left.innerText=="")) {
				reveal_box(temp_row+1,temp_box-1)
			}
		}
		
	}
	if (grid_hidden[temp_row-1]!=undefined) {
		if (grid_hidden[temp_row-1][temp_box+1]!=undefined) {
			box_top_right = grid_html.getElementsByClassName("rows")[temp_row-1].getElementsByClassName("box")[temp_box+1]
			if ((grid_hidden[temp_row-1][temp_box+1]==0)&&(box_top_right.style.backgroundColor!=revealed_zero_color)) {
				reveal_box(temp_row-1,temp_box+1)
				reveal_the_zeros(temp_row-1,temp_box+1)
			}
			if ((box_top_right.style.backgroundColor!=revealed_zero_color)&&(box_top_right.innerText=="")) {
				reveal_box(temp_row-1,temp_box+1)
			}
		}
		
	}
	if (grid_hidden[temp_row-1]!=undefined) {
		if (grid_hidden[temp_row-1][temp_box-1]!=undefined) {
			box_top_left = grid_html.getElementsByClassName("rows")[temp_row-1].getElementsByClassName("box")[temp_box-1]
			if ((grid_hidden[temp_row-1][temp_box-1]==0)&&(box_top_left.style.backgroundColor!=revealed_zero_color)) {
				reveal_box(temp_row-1,temp_box-1)
				reveal_the_zeros(temp_row-1,temp_box-1)
			}
			if ((box_top_left.style.backgroundColor!=revealed_zero_color)&&(box_top_left.innerText=="")) {
				reveal_box(temp_row-1,temp_box-1)
			}
		}
	}
}

function reveal_box(temp_row,temp_box) {
	box_selected = grid_html.getElementsByClassName("rows")[temp_row].getElementsByClassName("box")[temp_box]
	if (box_selected.style.backgroundImage=='url("http://bit.ly/target_png")') {
		box_selected.style.backgroundImage = "";
		amount_of_flags++
		document.getElementsByClassName('amount_of_flags')[0].innerText = "Amount of flags: " + amount_of_flags
	}
	if (grid_hidden[temp_row][temp_box]==0) {
		box_selected.style.backgroundColor = revealed_zero_color;
	} else {
		box_selected.innerText = grid_hidden[temp_row][temp_box]
		if (box_selected.innerText=="1") {
			box_selected.style.color = "#4287f5"
		}
		if (box_selected.innerText=="2") {
			box_selected.style.color = "#42f55a"
		}
		if (box_selected.innerText=="3") {
			box_selected.style.color = "#fa4e1e"
		}
		if (box_selected.innerText=="4") {
			box_selected.style.color = "#000396"
		}
		if (box_selected.innerText=="5") {
			box_selected.style.color = "#a80000"
		}
	}
}

function verify_win() {
	if (game_over) {
		if (game_win) {
			alert("The game is over, you won")
		} else {
			alert("The game is over, you lost")
		}
		return
	}
	win_check = true
	if (amount_of_flags>0) {
		alert("You need to use all flags first")
		win_check = false
		return
	}
	for (var row_number = 0; row_number < grid_shown.length; row_number++) {
		for (var box_number = 0; box_number < grid_shown.length; box_number++) {
			box_selected = grid_html.getElementsByClassName("rows")[row_number].getElementsByClassName("box")[box_number]
			if ((grid_hidden[row_number][box_number]=="bomb")&&(box_selected.style.backgroundImage!='url("http://bit.ly/target_png")')) {
				win_check = false
			}
		}
	}
	if (win_check) {
		alert("You won!")
		end_game(true)
	} else {
		alert("You didn't win")
		end_game(false)
	}
}

function end_game(win_or_loss) {
	for (var row_number = 0; row_number < grid_shown.length; row_number++) {
		for (var box_number = 0; box_number < grid_shown.length; box_number++) {
			if (grid_hidden[row_number][box_number]=="bomb") {
				box_selected = grid_html.getElementsByClassName("rows")[row_number].getElementsByClassName("box")[box_number]
				box_selected.style.backgroundImage = "url('http://bit.ly/bomb_png')"
			}
		}
	}
	game_over = true
	timer_stop = true
	game_win = win_or_loss
	alert('The game is over, you can start a new one by pressing on "start over"')
}
