console.log('loaded app.js')
miro.onReady((async function() {

    // const [o] = await miro.board.widgets.create({
    //     type: "sticker",
    //     text: "Yay!"
    // });
    // await miro.board.viewport.zoomToObject(o);

let allBoardItems

setInterval(function(){
    refreshAllBoardItems()
    console.log("run")
}, 10000)



function refreshAllBoardItems(){
	allBoardItems = await miro.board.widgets.get({type: 'sticker'})
	console.log(allBoardItems)
}


}));




// [Takes a seed sticky note to start]: "To collaborate is to let go."

// - get board items, store + initialize boardItems variable
//		- types of items (6): Text, Shape, Sticker, Frame, Image, Line
// - initialize randomAction array: 
// 	- move action: move item to random x and random y location
//	- bring forward action
// 	- add action (if fewer than 100 boardItems): 
// 		- take phrase, run through unsplash, add image item
// 		- take phrase, split it at whitespace if long
// 			else duplicate it
// 	- remove (if greater than 100 boardItems) random item



// [Every X seconds:]

// - get board items, refresh boardItems variable 
// - randomly select an item
// 	- call randomAction on it
