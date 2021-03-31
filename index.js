const util = require("util");
const exec = util.promisify(require("child_process").exec);
const path = require("path");
const locatePath = require("locate-path");

const loPaths = {
  darwin: ["/Applications/LibreOffice.app/Contents/MacOS/soffice"],
  linux: ["/usr/bin/libreoffice", "/usr/bin/soffice"],
  win32: [
    path.join(process.env["PROGRAMFILES(X86)"], "LIBREO~1/program/soffice.exe"),
    path.join(process.env["PROGRAMFILES(X86)"], "LibreOffice/program/soffice.exe"),
    path.join(process.env.PROGRAMFILES, "LibreOffice/program/soffice.exe"),
  ]
};

const cwd = process.cwd();
const getAbsolutePath = (p) => path.isAbsolute(p) ? p : path.join(cwd, p);

function convert({document, format = "html", outdir, customPath}) {
  return new Promise((resolve, reject) => {
    if (document == null) {
      reject("document is null");
    }
  
    const documentPath = getAbsolutePath(document);
    const outdirArg = outdir ? `--outdir "${getAbsolutePath(outdir)}"` : "";
    const args = ["--headless", `--convert-to ${format}`, outdirArg, `"${documentPath}"`];
    const loPath = customPath ? [customPath] : loPaths[process.platform];

    locatePath(loPath).then((exePath) => {
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

module.exports = convert;