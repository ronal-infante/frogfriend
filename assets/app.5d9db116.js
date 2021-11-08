/* empty css              */
console.log('loaded app.js');
miro.onReady((async function() {
    const [o] = await miro.board.widgets.create({
        type: "sticker",
        text: "Yay!"
    });
    await miro.board.viewport.zoomToObject(o)
}));