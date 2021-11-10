console.log('loaded app.js')
miro.onReady((async function() {



	// Configurations
	const maxItems = 100;
	const moveByMax = 501;
	const destructionAmt = 4;
	const speed = 500;
	const unsplashTimeInt = 90000; // 1.5min. Unsplash Demo max is 50req/hr: once every 1.2min

	// Inits
	let allBoardItems = await miro.board.widgets.get();
	var unsplashLastTime = 0; 
	console.log("allBoardItems.length = " + allBoardItems.length);


	// Read out existing items on the board
	for (var i = allBoardItems.length - 1; i >= 0; i--) {
		console.log(allBoardItems[i].type + " | " + allBoardItems[i].plainText + " | " + allBoardItems[i].id);
	} 


	async function refreshAllBoardItems(){
		allBoardItems = await miro.board.widgets.get()
		console.log("allBoardItems.length = " + allBoardItems.length);
	}

	// Rando functions
	function getRando(mapRange){ return Math.floor(Math.random() * mapRange); }
	function randoMoveVals(){ 
		let negBoolX = getRando(2),
			negBoolY = getRando(2),
			rotBool = getRando(2),
			move = new Object();
			move.x = getRando(moveByMax);
			move.y = getRando(moveByMax);
			move.r = 0;

		if(negBoolX){
			move.x = move.x * -1;
		} if(negBoolY){
			move.y = move.y * -1;
		}

		if(rotBool){
			move.r = getRando(360);
		}

		return move; 
	}



	async function randomAction(item){


		// Leave these alone pls + thank you
		if (item.id == 3074457367383407513 /* Event plaque image from Laura */ || item.id == 3074457367383407515 /* Frame */ || item.id == 3074457367383407514 /* Link */ ) { console.log("nope"); return; }
		
		
		//let action = 0; // For TS
		let action = getRando(4);
		console.log(item.type + " | " + item.plainText + " | " + action);


		// Action 1: Move board item randomly
		if(action == 0){

	    	console.log("move randomly "+item.type);
	    	console.log(item);

	    	var move = randoMoveVals();
	    	
	    	miro.board.widgets.transformDelta(item.id, move.x, move.y, move.r);
			



		// Action 2: Bring board item either forward/back randomly
		} if(action == 1 ){

	    	console.log("bring forward/back "+item.type);

			if(getRando(2)) { 
				miro.board.widgets.bringForward(item.id)
			} else{ miro.board.widgets.sendBackward(item.id) }



		// Action 3: Clean up text, query Unsplash for an image, drop it in, and randomly move it
		} if(action == 2 ){

			let now = new Date().getTime();
			let diff = now - unsplashLastTime;

			if (diff > unsplashTimeInt){
				unsplashLastTime = now;

	    		console.log("unsplash image " + item.type + " | " + diff);

				if(item.plainText){

			    	let url = "https://api.unsplash.com/search/photos/?query=";
				    let move = randoMoveVals();

					item.plainText.split(" ").forEach( function(word){

						if(word.length < 4){ return; }

						url = url + word + "%20";

					});

					url = url + "&per_page=1&client_id=26pZchV3ORWguGwAf7sEdi8Bzd0eUU2qfHzZMAWDTp8";
					console.log(url);


					fetch(url).then( response =>{
						console.log(response);
						if (response.ok) {
							return response.json();
						} else{ console.log("Error: " + response.status); }
					}).then( data =>{
			    		let newImage = miro.board.widgets.create({type: "image", url: data.results[0].urls.raw, scale: (Math.random()+0.1)});
				    	miro.board.widgets.transformDelta( newImage.id, move.x, move.y, move.r );
					});

				}


			}





		// Action 4: Add or split text, move randomly upon placement
		} if(action == 3 ){

	    	console.log("add/split " + item.type);

			if(item.plainText){
				
				item.plainText.split(" ").forEach( async function(word){

					if(word.length < 4){ return; }

			    	let move = randoMoveVals();
		    		
		    		if (getRando(2)){
			    		let [newSticky] = await miro.board.widgets.create({type: "sticker", text: word});
				    	miro.board.widgets.transformDelta( newSticky.id, move.x, move.y, move.r );
				    } else{
				    	let textScale = (getRando(4)+2); console.log(textScale);
			    		let [newText] = await miro.board.widgets.create({type: "text", text: word, scale: textScale});
				    	miro.board.widgets.transformDelta( newText.id, move.x, move.y, move.r );

				    }

					
				})
			}
		}



	}


	// Main loop
	setInterval(function(){
	    refreshAllBoardItems();


		// DES. TRUC. TION. 💣
		if (allBoardItems.length > maxItems) { 
			console.log("DESTRUCTION");

			for (var i = Math.floor(maxItems / destructionAmt) - 1; i >= 0; i--) {

				let item = allBoardItems[getRando(allBoardItems.length)];
				if (item.id == 3074457367235684021 || item.id == 3074457367236289430 || item.id == 3074457367236008061 || item.id == 3074457367236186083 || item.id == 3074457367236111275 || item.id == 3074457367236111356) { console.log("nope"); return; }

				miro.board.widgets.deleteById(item.id);

			}

			return;

		} else{ randomAction(allBoardItems[Math.floor(Math.random() * allBoardItems.length)]); }

		
	}, speed)







}));




// Written Code Guide
// ---------------------
//
// Takes seed content to start: e.g. sticky note with "To collaborate is to let go."
//
// - get board items, store + initialize boardItems variable
//		- types of items (6): Text, Shape, Sticker, Frame, Image, Line
//
// - initialize randomAction (if fewer than 100 boardItems): 
// 		- 1 move action: move item to random x and random y location
//		- 2 bring forward/send back action
// 		- 3 add image action: 
// 			- take phrase, run through unsplash, add image item
//		- 4 add sticky note or text: 
// 			- take phrase, split it at whitespace (duplicates if too short)
//
//
// Every X seconds:
//
// - get all board items, refresh boardItems variable 
// - if more than 100 boardItems, delete a percentage of items
//		- select random items, for loop until percent is gone
// - randomly select an item
// 		- call randomAction on it
