const fs = require("fs")
const tsConfig = require("./tsconfig");
tsConfig.include = ["src/**/*.ts"]
tsConfig.compilerOptions.rootDir = "src"
tsConfig.compilerOptions.outDir = "lib"
fs.writeFileSync("tsconfig.production.json", JSON.stringify(tsConfig, null, 2))

