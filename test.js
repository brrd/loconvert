const test = require("ava");
const fs = require("fs");
const path = require("path");
const convert = require("./index.js");

const emptyDir = (dirpath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirpath, (err, files) => {
      if (err) reject(err);
      for (const file of files) {
        try {
          fs.unlinkSync(path.join(dirpath, file));
        } catch(err) {
          reject(err);
        }
      }
      resolve();
    });
  });
};

const fileExists = (s) => new Promise(r => fs.access(s, fs.F_OK, e => r(!e)));

test.before(() => {
  const outDir = path.join(__dirname, "test/out");
  return emptyDir(outDir);
});

test("Convert a single document", async t => {
  const docPath = "test/src/test.docx";
  const outDirpath = "test/out";
  const outDocPath = path.join(__dirname, outDirpath, "test.html");

  await convert({
    document: docPath,
    format: "\"html:XHTML Writer File:UTF8\"",
    outdir: outDirpath
  });
  const exists = await fileExists(outDocPath);
  t.true(exists);
});