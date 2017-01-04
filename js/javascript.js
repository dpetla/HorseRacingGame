window.onload = function () {
	main();
	btn1.addEventListener('click', start);
	document.addEventListener('keydown', spacebar); //this event listener is removed after the game starts
	btn2.addEventListener('click', reset);

}

//global variables
// usefull shortcuts to accessing elements
var horses = document.querySelectorAll('.horse');
var btn1 = document.querySelector('#btn1');
var btn2 = document.querySelector('#btn2');
//trigger to stop AnimationFrame
var animation = true;
//variables for display clock time
var ti = document.createElement('p');
document.querySelector('.botton').appendChild(ti);
ti.className = "finalMsg";
var clockOn;
var clockOff;


function main() {
	//number of horses in the game
	var numHorse = 5;

	//create racing horses
	for (var i = 0; i < numHorse; i++) {
		var competitor = new Horse(); // ##### creating instances of the horse class
	}

	// set vertical start position 
	var horses = document.querySelectorAll('.horse');
	for (var i = 0; i < horses.length; i++) {
		horses[i].style.top = (i) * 5 + "px";
	}
}


/**
 * // ##### Horse class
 * 
 */
var Horse = function () {
		//public variables
		this.x = 0; //position
		this.speed = 0; //velocities
		this.angle = 1; //angle of the trout movent
		this.delta = 1; //delta applied to angle
		//private variables
		var el = null;
		var self = this;


		//Horse class funcitons
		//initialze object
		function init() {
			el = document.createElement('div');
			document.querySelector(".track").appendChild(el);
			//add class
			el.className = 'horse';
			//set speed variables
			self.speed = (Math.random() * 2) + 1;
			//listen to event start race event
			el.addEventListener('bang', move);
			el.addEventListener('finishLine', crossLine);

		}
		init();

		//move the horse
		function move() {
			self.x += self.speed;
			//boundaries or finish line
			var trackLength = window.innerWidth - el.offsetWidth - 10;
			// stop horse when it touches right side of the browser window (finishline)
			if (self.x >= trackLength) {
				var final = new Event('finishLine');
				self.x = trackLength;
				//stop run/move functions
				el.dispatchEvent(final);
				return;
			}
			// update horizontal (x) position
			el.style.left = self.x + 'px';
			//trot movent
			if (self.angle > 3) self.delta *= -1;
			if (self.angle < -3) self.delta *= -1;
			self.angle += self.delta;
			el.style.transform = "rotate(" + self.angle + "deg)";
		}

		function crossLine() {
			// ##### this line ends recursion of the animation
			animation = false;
			el.style.transform = "rotate(0deg)";
			el.style.border = "2px solid limegreen";
		}

	} //end of Horse class


//display start text anaimation
//functions runs with click event on #btn1 button or pressing down the space bar
function start() {
	//toggle start reset button
	btn1.style.display = 'none';
	btn2.style.display = "block";
	document.removeEventListener('keydown', spacebar);
	document.addEventListener('keydown', esc); //add ability to cancel game only after it begins

	// increment start text size
	var msg = document.getElementById('start');
	var inc = 1; //used to increment font size during animation
	msg.style.display = 'block';
	// ##### this line shows use of setInterval to text animation
	var startAnimaimation = setInterval(function () {
			msg.style.fontSize = inc + 'pt';
			inc++;
		}, 16)
		// ends 'start' msg and animation
		// ##### this line shows the use of setTimeOut to end the previous animation
	setTimeout(function () {
		msg.style.display = 'none';
		msg.style.fontSize = '1pt';
		clearInterval(startAnimaimation);
	}, 1000);

	clockOn = new Date();
	run()
}

//checks if the key input is a space bar
function spacebar(ev) {
	var code = ev.keyCode;
	if (code === 32) start();
}

//checks if the key input is a space bar
function esc(ev) {
	var code = ev.keyCode;
	if (code === 27) {
		animation = false;
		console.log('cancelled');
	}
}

//makes horse race towards the finish line
function run() {
	//create an event to let horses race
	var bang = new Event('bang');
	// dispatch bang event to horses array
	var horses = document.querySelectorAll('.horse');
	for (var i = 0; i < horses.length; i++) {
		horses[i].dispatchEvent(bang);
	}

	//update timer
	clock();

	//start racing animation
	// ##### this line shows use of requestAnimationFrame
	// ##### this line shows the use of recursion
	if (animation) request = requestAnimationFrame(run);
}

//measure race leader's time
function clock() {
	clockOff = new Date();
	var clock = (clockOff - clockOn) / 1000;
	ti.textContent = "Race time: " + clock.toFixed(2) + " secs.";
}

//function runs when #btn1 button is clicked
function reset() {
	location.reload();
}
