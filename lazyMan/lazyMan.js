var taskManager = (function(){
	var curTask,
	    tasksArr = [];
	return {
		push: function ( func ){
			tasksArr.push( func );
			return this;
		},
		unshift: function ( func ){
			tasksArr.unshift( func );
			return this;
		},
		next: function () {
			if ( tasksArr.length < 1 ) return;
			curTask = tasksArr.shift();
			if ( typeof curTask === 'function') {
				curTask();
			}
			return this;
		},
		start: function () {
			this.next();
		}
	}
})();

function _lazyMan ( name ) {
	this.name  = name;
	this.sayHi = function(){
		console.log( "Hi! This is " + this.name + '!' );
		taskManager.next();
	};
	taskManager.push( this.sayHi.bind(this) );

	this.sleep = function ( time ) {
		var func = function(){
			setTimeout( function(){
				taskManager.unshift( function(){
					console.log( "Wake up after " + time + "s.");
					taskManager.next();
				} );
				taskManager.next();
			}, time * 1000 );
		};
		taskManager.push( func );
		return this;
	};

	this.sleepFirst = function ( time ) {
		var func = function(){
			setTimeout( function(){
				taskManager.unshift( function(){
					console.log( "Wake up after " + time + "s.");
					taskManager.next();
				} );
				taskManager.next();

			}, time * 1000 );
		};
		taskManager.unshift( func );
		return this;
	};

	this.eat   = function ( food ) {
		var func = function(){
			console.log("Eat " + food + '.');
			taskManager.next();
		};
		taskManager.push( func );
		return this;
	};
	// 进入下一个事件循环再启动
	setTimeout( function(){
		taskManager.start();
	}, 0 );

}

function lazyMan ( name ) {
	return new _lazyMan( name );
}

lazyMan("hank").sleep(5).eat("banana");