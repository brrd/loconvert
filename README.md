# loconvert

> LibreOffice documents converter in Node.js

## Usage

```javascript
const convert = require("loconvert");

convert({
	document: "./test/src/test.docx",
	format: "\"html:XHTML Writer File:UTF8\"",
	outdir: "./test/out"
})
.then(() => console.log("done"));
```