const fs = require("fs")
const tsConfig = require("./tsconfig");
tsConfig.include = ["src"]
fs.writeFileSync("tsconfig.production.json", JSON.stringify(tsConfig, null, 2))

