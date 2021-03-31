# loconvert

Convert office documents in Node.js using LibreOffice (soffice.exe).

LibreOffice must be installed. 

This supports multliple documents conversion on Windows (see issue https://wiki.documentfoundation.org/Faq/General/150).

## Installation

```
npm install loconvert --save
```

## Usage

```javascript
const convert = require("loconvert");

// Convert a single document
convert({
	input: "./test/src/test.docx",
	format: "\"html:XHTML Writer File:UTF8\"",
	outdir: "./test/out",
	customPath: "optional/custom/path/to/libreoffice/directory"
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