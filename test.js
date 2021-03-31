const test = require("ava");
const fs = require("fs");
const path = require("path");
const { convert, convertAll } = require("./index.js");

const emptyDir = (dirpath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirpath, (err, files) => {
      if (err) reject(err);
      for (const file of files) {
        try {
          if (file === ".keep") continue;
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

test.beforeEach(() => {
  const outDir = path.join(__dirname, "test/out");
  return emptyDir(outDir);
});

test.serial("Convert a single document (relative path)", async t => {
  const docPath = "test/src/test.docx";
  const outDirpath = "test/out";
  const outDocPath = path.join(outDirpath, "test.html");

  await convert({
    document: docPath,
    format: "\"html:XHTML Writer File:UTF8\"",
    outdir: outDirpath
  });
  const exists = await fileExists(outDocPath);
  t.true(exists);
});

test.serial("Convert a single document (absolute path)", async t => {
  const docPath = path.join(__dirname, "test/src/test.docx");
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

test.serial("Convert multiple documents", async t => {
  const docPaths = ["test/src/test.docx", "test/src/test2.docx"];
  const outDirpath = "test/out";
  const outDocPath = path.join(outDirpath, "test.html");

  await convertAll({
    documents: docPaths,
    format: "\"html:XHTML Writer File:UTF8\"",
    outdir: outDirpath
  });
  const exists = await fileExists(outDocPath);
  t.true(exists);
});