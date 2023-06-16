import * as path from "path";
import * as fs from "fs";

// modules are hoisted but pkg not reading that so not included
// will be ok if read inside packages/dcdk-adapters/node_modules

// pkg used esm to find files to pick while at run its using require
// if included in scripts it fails to parse too

// transitive deps not being cath
// hack soln 1 / force include all deps
// hack soln 2/  copy code here via symlink
// hack soln 3/  copy code here
// hack soln 4 force copy inside pkg

// https://www.npmjs.com/package/fs-readdir-recursive
function readdirRecursive(
  root: string,
  filter?: any,
  files?: string[],
  prefix: string = ""
) {
  prefix = prefix || "";
  files = files || [];
  filter = filter || noDotFiles;

  var dir = path.join(root, prefix);
  if (!fs.existsSync(dir)) return files;
  if (fs.statSync(dir).isDirectory())
    fs.readdirSync(dir)
      .filter(function (name, index) {
        return filter(name, index, dir);
      })
      .forEach(function (name) {
        readdirRecursive(root, filter, files, path.join(prefix, name));
      });
  else files.push(prefix);

  return files;
}

function noDotFiles(x: any) {
  return x[0] !== ".";
}

// for debug
export const printSnapshotSystem = () => {
  // root hositted modules
  console.log("printSnapshotSystem");
  const level1 = fs.readdirSync(path.resolve(__dirname, "../../../../../../"));
  console.log("level1", level1);
  const packages = fs.readdirSync(
    path.resolve(__dirname, "../../../../../../packages")
  );
  console.log("packages", packages);
  const node_modules = fs.readdirSync(
    path.resolve(__dirname, "../../../../../../node_modules")
  );
  console.log("node_modules/axios", node_modules);
  const results = readdirRecursive(
    path.resolve(__dirname, "../../../../../../node_modules/axios")
  );

  console.log("node_modules axios", node_modules);
  const axios = readdirRecursive(path.resolve(__dirname, "../axios"));
  console.log("node_modules recursive", axios);

  const currentDir = fs.readdirSync(path.resolve(__dirname, "../node_modules"));
  console.log("current dir node_modules", currentDir);
};
