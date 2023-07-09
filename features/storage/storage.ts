/** MAIN **/

export function getUrl(name: string): URL {
  // name is a list of at least one token
  // token is at least one char
  // char is letter, number, hyphen, underscore, or dot
  const pattern = /^([-a-z0-9_.]+\.)*[-a-z0-9_.]+$/i;
  if (!pattern.test(name)) {
    throw new Error(`Invalid name: ${name}`);
  }
  const base = "https://storage.googleapis.com/experimental-storage/";
  return new URL(name, base);
}

export async function download(location: string | URL) {
  const url = location instanceof URL ? location : getUrl(location);
  const response = await fetch(url);
  // error is returned as XML
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const buffer = await response.arrayBuffer();
  return buffer;
}

export async function upload(path: string, data: Blob) {
  const file = new File([data], path, { type: "text/plain" });
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "https://europe-west6-eibens-m23-storage.cloudfunctions.net/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  if (response.ok) {
    console.log("File uploaded successfully");
  } else {
    const error = await response.text();
    console.error("An error occurred:", error);
  }
}
