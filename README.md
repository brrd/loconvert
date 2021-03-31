# loconvert

> LibreOffice documents converter in Node.js

## Usage

```javascript
const { convert, convertAll } = require("./index.js");

convert({
	document: "./test/src/test.docx",
	format: "\"html:XHTML Writer File:UTF8\"",
	outdir: "./test/out"
})
.then(() => console.log("done"));

convertAll({
	documents: ["./test/src/test.docx", "./test/src/test2.docx"],
	format: "\"html:XHTML Writer File:UTF8\"",
	outdir: "./test/out"
})
.then(() => console.log("done"));
```