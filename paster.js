var ncp = require("copy-paste");
const fs = require('fs');
const config = require('./config.json')
const fileName = config.textFileName
setInterval(checkPaste, 500)
let pasteString = "";
function checkPaste() {
	let temp = ncp.paste()
	if (temp !== pasteString) {
		pasteString = temp
		fs.appendFileSync(fileName, pasteString + '\n', 'utf8')
		console.log(`Wrote ${temp} in ${fileName}`)
	}
}