// demo purpose
let scriptStdout = "";

import { spawn } from "child_process";
import path from "path";

const jobPath = path.resolve(__dirname, "../../../job.json");
const python = spawn("bacalhau", ["create", jobPath]);

python.stdout.on("data", function (data) {
  console.log("Pipe data from python script ...");
  scriptStdout += data.toString();
});
python.stderr.on("data", function (data) {
  console.error("error data from python script ...");
  console.error("err", data.toString());
});
python.on("close", (code) => {
  console.log(`child process close all stdio with code ${code}`);
  console.log("data", scriptStdout);
});
