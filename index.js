const util = require("util");
const exec = util.promisify(require("child_process").exec);
const path = require("path");
const locatePath = require("locate-path");
const pLimit = require("p-limit");

const cwd = process.cwd();

const getAbsolutePath = (p) => path.isAbsolute(p) ? p : path.join(cwd, p);

let exePath;

// FIXME: what if customPath changes between 2 executions?
const getExePath = (customPath) => { 
  if (exePath) {
    return Promise.resolve(exePath);
  }

  const loPaths = {
    darwin: ["/Applications/LibreOffice.app/Contents/MacOS/soffice"],
    linux: ["/usr/bin/libreoffice", "/usr/bin/soffice"],
    win32: [
      path.join(process.env["PROGRAMFILES(X86)"], "LIBREO~1/program/soffice.exe"),
      path.join(process.env["PROGRAMFILES(X86)"], "LibreOffice/program/soffice.exe"),
      path.join(process.env.PROGRAMFILES, "LibreOffice/program/soffice.exe"),
    ]
  };
  const loPath = customPath ? [customPath] : loPaths[process.platform];

  return locatePath(loPath).then((locatedPath) => {
    exePath = locatedPath;
    return locatedPath;
  });
};

function convert({document, format = "html", outdir, customPath}) {
  return new Promise((resolve, reject) => {
    if (document == null) {
      reject("document is null");
    }
  
    const documentPath = getAbsolutePath(document);
    const outdirArg = outdir ? `--outdir "${getAbsolutePath(outdir)}"` : "";
    const args = ["--headless", `--convert-to ${format}`, outdirArg, `"${documentPath}"`];

    getExePath(customPath).then((exePath) => {
      const command = `"${exePath}" ${args.join(" ")}`;
      return exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        resolve(stdout? stdout : stderr);
      });
    });
  });
}

function convertAll({documents, format, outdir, customPath}) {
  const limit = pLimit(1);
  const proms = documents.map((document) => {
    return limit(() => convert({document, format, outdir, customPath}));
  });
  return Promise.all(proms);
}

module.exports = { convert, convertAll };