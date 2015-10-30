function moveLiftToFloor(floorNumber) {
	var newMargin = ((9 - floorNumber) * 101) - 2;
	$('#lift').css({'margin-top': newMargin + "px"});
	$('#lift').data().currentfloor = floorNumber;
}

function newPersonOnFloor(floorNumber) {
	var personHtml = '<div class="person"></div>';
	$('#inFloor' + floorNumber).append(personHtml);

	var newNumberInQueue = $('#inFloor' + floorNumber).children(".person").length;
	$('#inFloor' + floorNumber).find('span').html('Floor ' + floorNumber + ' : ' + newNumberInQueue);
}

function personGetsIntoLift(numberOfPeople) {

	var floorNumber = $('#lift').data().currentfloor;

	for (i=1;i<=numberOfPeople;i++) {
		$('#inFloor' + floorNumber).children(".person").last().remove();
	}
	updateNumberOfPeopleInLift(numberOfPeople);
	var newNumberInQueue = $('#inFloor' + floorNumber).children(".person").length;
	$('#inFloor' + floorNumber).find('span').html('Floor ' + floorNumber + ' : ' + newNumberInQueue);
}

function personGetsOutOfLift(numberOfPeople) {
	var floorNumber = $('#lift').data().currentfloor;
	var currentCounter = parseInt($('#personCounter' + floorNumber).html());
	var newCounter = parseInt(currentCounter) + parseInt(numberOfPeople);

	$('#personCounter' + floorNumber).html(parseInt(newCounter));
	updateNumberOfPeopleInLift(0 - numberOfPeople);	
}

function updateNumberOfPeopleInLift(numberOfPeople) {
	var currentNumber = parseInt($('#liftCounter').html());
	var newNumber = parseInt(currentNumber) + parseInt(numberOfPeople);
	newNumber = Math.max(newNumber, 0);
	$('#liftCounter').html(parseInt(newNumber));
}

function replenishQueue(queues) {
	var currentQueues = [];
	for (i=0;i<10;i++) {
		currentQueues.push($('#inFloor' + i + ' .person').length);
	}

	for (i=0;i<10;i++) {
		var delta = Math.max(parseInt(queues[i]) - parseInt(currentQueues[i]),0);
		
		for(x=0;x<delta;x++) {
			newPersonOnFloor(i);	
		}
	}
}

var update = function(i) {
	var newI = parseInt(i);
	$('#counter').html(newI);
	var currentCounter = i.toString() + ".0";
	if (timings[currentCounter] != undefined) {
		
		//do the smart stuff
		var state = timings[currentCounter];

		//disembark people
		setTimeout(function(){
			personGetsOutOfLift(state.disembarked);
		}, 20);

		//embark new people
		setTimeout(function(){
			var currentCounter = parseInt($('#liftCounter').html());
			var newCounter = state.destinations.length;

			personGetsIntoLift( newCounter - currentCounter );
		}, 50);

		//replenish queue
		setTimeout(function(){
			replenishQueue(state.queues)
		}, 10);

		setTimeout(function(){
			moveLiftToFloor(parseInt(state.new_destination));
		}, 60)
		
		setTimeout(function() {
		    update(i+1);
		}, 150);
			

	} else {
		if (i > 510000) {
			return;
		}
		if (stopNow == 1) {
			return
		}

		setTimeout(function() {
		    update(i+1);
		}, 1);

	}
}