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
}

function convert({document, format = "html", outdir, customPath}) {
	if (document == null) {
		throw Error("document is null");
	}

	const cwd = process.cwd();
	const documentPath = path.join(cwd, document);
	const outdirArg = outdir ? `--outdir "${path.join(cwd, outdir)}"` : "";
	const args = [`--headless`, `--convert-to ${format}`, outdirArg, `"${documentPath}"`];
	const loPath = customPath ? [customPath] : loPaths[process.platform];
	return locatePath(loPath).then((exePath) => {
		const command = `"${exePath}" ${args.join(" ")}`;
		return exec(command);
	});
}

module.exports = convert;