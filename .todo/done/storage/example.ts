import { Storage } from "./mod.ts";

const file = "eibens.lambda-ui.storage.example.txt";

const data = `Timestamp: ${Date.now()}`;
const blob = new Blob([data], { type: "text/plain" });

console.group("Upload");
console.log(`Uploading to ${file}`);
console.log(data);
console.time("Upload");
await Storage.upload(file, blob);
console.timeEnd("Upload");
console.groupEnd();

console.group("Download");
const url = Storage.getUrl(file);
console.log(`Downloading ${url}`);
console.time("Download");
const buffer = await Storage.download(url);
console.timeEnd("Download");
console.log(`Downloaded ${new TextDecoder().decode(buffer)}`);
console.groupEnd();
