var block1 = new Layer({
	width: 100,
	height: 100,
	x: 50,
	y: 50,
	style: { backgroundColor: utils.randomColor(0.8) }
});

var block2 = new Layer({
	width: 100,
	height: 100,
	x: 50,
	y: 200,
	style: { backgroundColor: utils.randomColor(0.8) }
});

var block3 = new Layer({
	width: 100,
	height: 100,
	x: 50,
	y: 350,
	style: { backgroundColor: utils.randomColor(0.8) }
});

var block4 = new Layer({
	width: 100,
	height: 100,
	x: 50,
	y: 500,
	style: { backgroundColor: utils.randomColor(0.8) }
});

block1.on('click', function() {
	block1.animate({
		aid: 'Block 1 Animation',
		properties: { x: (block1.x > 50 ? 50 : 300) },
		curve: 'spring(200,20,0)'
	})
});

block2.on('click', function() {
	block2.animate({
		aid: 'Block 2 Animation',
		properties: { x: (block2.x > 50 ? 50 : 300) },
		curve: 'ease-in-out',
		time: 0.5
	})
});

block3.on('click', function() {
	block3.animate({
		aid: 'Block 3 Animation',
		properties: { x: (block3.x > 50 ? 50 : 300) },
		curve: 'bezier-curve(.42, 1, .42, 1)',
		time: 0.5,
		delay: 0.1
	})
});

block4.on('click', function() {
	block4.animate({
		aid: 'Block 4 Animation',
		properties: { x: (block4.x > 50 ? 50 : 300) },
		curve: 'spring',
		curveOptions: { tension: 200, friction: 20, velocity: 0 }
	})
});
