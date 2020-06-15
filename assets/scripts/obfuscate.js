const fs = require("fs");
const path = require("path");
const recursive = require("recursive-readdir");
const javaScriptObfuscator = require("javascript-obfuscator");
const pjson = require("../../package.json");

var resourcesFolder = [
  "out/" + pjson.name + "-win32-ia32/resources",
  "out/" + pjson.name + "-linux-x64/resources",
  "out/" + pjson.name + "-darwin-x64/" + pjson.name + ".app/Contents/Resources"
];

  for (var loop = 0; loop < resourcesFolder.length; loop++) {
    if (fs.existsSync(resourcesFolder[loop])) {
      console.log("Found: " + resourcesFolder[loop]);
      recursive(
        resourcesFolder[loop] + "/app",
        ["node_modules"],
        (error, files) => {
          files.forEach(file => {
            if (path.extname(file) === ".js") {
              let contents = fs.readFileSync(file, "utf8");
              console.log("Protecting " + file);
              let ret = javaScriptObfuscator.obfuscate(contents, {
                compact: true,
                controlFlowFlattening: false,
                controlFlowFlatteningThreshold: 0.75,
                deadCodeInjection: false,
                deadCodeInjectionThreshold: 0.4,
                debugProtection: false,
                debugProtectionInterval: false,
                disableConsoleOutput: false,
                domainLock: [],
                identifierNamesGenerator: "hexadecimal",
                identifiersPrefix: "",
                inputFileName: "",
                log: false,
                renameGlobals: false,
                reservedNames: [],
                reservedStrings: [],
                rotateStringArray: true,
                seed: 0,
                selfDefending: false,
                sourceMap: false,
                sourceMapBaseUrl: "",
                sourceMapFileName: "",
                sourceMapMode: "separate",
                stringArray: true,
                stringArrayEncoding: false,
                stringArrayThreshold: 0.75,
                target: "node",
                transformObjectKeys: false,
                unicodeEscapeSequence: false
              });
              fs.writeFileSync(file, ret);
            }
          });
        }
      );
    } else {
      console.log("NotFound: " + resourcesFolder[loop]);
    }
  }
