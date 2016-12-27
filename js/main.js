// global methods

BOARD = {
	x:7,
	y:7
}

// object A equals object B
function equals(a, b) {
	return JSON.stringify(a) === JSON.stringify(b)
}

// random integer between min and max (integer)
function rand(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min)
}

// remove value from Array
function removeFromArray(array,e) {
	var index = array.indexOf(e)
	if (index > -1) {
		array.splice(index, 1)
	}
}

// define classes

// Move
function Move() {} // <-- do we need this ?

// all the possible moves
Move.moves = [{x:1,y:2},{x:2,y:1},{x:2,y:-1},{x:1,y:-2},{x:-1,y:-2},{x:-2,y:-1},{x:-2,y:1},{x:-1,y:2}]

Move.randomMove = function() {
	var m = rand(0,7)
	return Move.moves[m]
}

Move.move = function(i) {
	return Move.moves[i%8]
}

// Route (solution)
function Route() {
	this.moves=[]
}

Route.prototype.addMove = function(m) {
	this.moves.push(m)
}

Route.prototype.getMove = function(i) {
	return this.moves[i]
}

// Point
function Point(x,y) {
	this.x=x
	this.y=y
}

Point.prototype.inBoard = function() {
	return this.x >= 0 && this.y >= 0 && this.x <= BOARD.x && this.y <= BOARD.y
}

Point.prototype.move = function(m) {
	var res = new Point()

	res.x = this.x+m.x
	res.y = this.y+m.y
	
	if (!res.inBoard()) {
		res = this
	}

	return res
}

Point.prototype.possibleMoves = function() {
	var pmoves = []
	for (var i in Move.moves) {
		var move = Move.move(i)
		if (!equals(this.move(move),this)) {
			pmoves.push(move)
		}
	}
	return pmoves
}

Point.prototype.route = function(r) {
	var res = new Point(this.x,this.y)
	
	for (var i in r.moves) {
		res = res.move(r.getMove(i))
	}
	
	return res
}

Point.prototype.distance = function(b) {
	return Math.sqrt(Math.pow(b.x-this.x,2)+Math.pow(b.y-this.y,2))
}

// Problem
function Problem(start_pt,arr_pt) {
	this.start_pt=start_pt
	this.arr_pt=arr_pt
	this.solutions=[] // Route[]
}

Problem.prototype.solve = function() {
	var route = new Route()
	var C = this.start_pt
	var visitedPoints = []
	visitedPoints.push(C)
	
	function hasVisited(p) {
		var res = false
		for (var i in visitedPoints) {
			if (equals(visitedPoints[i],p)) {
				res = true
			}
		}
		return res
	}

	while (!equals(this.arr_pt,C)) {
		// get all the possible moves
		var pmoves = C.possibleMoves()
		// select a random move among the possible ones
		var rmove = pmoves[rand(0,pmoves.length-1)]
		route.addMove(rmove)
		// place C after the move (move C)
		C = C.move(rmove)
		// add C to the list of visited points
		visitedPoints.push(C)
	}

	this.solutions.push(route)
}
