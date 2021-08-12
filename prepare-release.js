import fs from "fs";
import { minify } from "terser";

cleanupDistFolder();
const files = getJSFiles("./src");
files.map(minifyJSFile).forEach(saveFileToDist);

function getJSFiles(path) {
  const files = [];
  const dirents = fs.readdirSync(path, { withFileTypes: true });
  dirents.forEach((dirent) => {
    if (dirent.isDirectory()) {
      files.push(...getJSFiles(`${path}/${dirent.name}`));
    } else {
      files.push(`${path}/${dirent.name}`);
    }
  });
  return files;
}

async function minifyJSFile(path) {
  const jsContents = fs.readFileSync(path, "utf8");
  const { code } = await minify(jsContents, {
    ecma: 2021,
    compress: true,
    mangle: true,
    module: true,
    toplevel: true,
  });
  return { path, code };
}

async function saveFileToDist(data) {
  const { path, code } = await data;
  const distPath = path.replace("./src", "./dist");
  console.log(distPath);
  try {
    fs.writeFileSync(distPath, code);
  } catch (error) {
    if (error.code === "ENOENT") {
      fs.mkdirSync(distPath.split("/").slice(0, -1).join("/"));
      fs.writeFileSync(distPath, code);
    }
  }
}

function cleanupDistFolder() {
  fs.rmdirSync("./dist/", { recursive: true });
  fs.mkdirSync("./dist");
}
