# loconvert

> LibreOffice documents converter in Node.js

## Usage

```javascript
const convert = require("loconvert");

// Convert a single document
convert({
	input: "./test/src/test.docx",
	format: "\"html:XHTML Writer File:UTF8\"",
	outdir: "./test/out"
})
.then(() => console.log("done"));

// Convert multiple documents
convert({
	input: ["./test/src/test.docx", "./test/src/test2.docx"],
	format: "\"html:XHTML Writer File:UTF8\"",
	outdir: "./test/out"
})
.then(() => console.log("done"));
```