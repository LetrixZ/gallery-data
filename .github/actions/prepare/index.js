const core = require("@actions/core");
const { readFileSync, writeFileSync } = require("fs");

const readJSONFile = (path) => JSON.parse(readFileSync(path));
const prettyJSON = (data) => JSON.stringify(data, null, 2);
const minifyJSON = (data) => JSON.stringify(data);

try {
  const galleries = readJSONFile("galleries.json");

  writeFileSync("galleries.min.json", minifyJSON(galleries));

  console.log(`Found ${galleries.length} galleries`);

  const keys = galleries
    .filter((gallery) => (!!gallery.data_key && !!gallery.hash) || !!gallery.url)
    .map((gallery) => ({
      id: gallery.gid,
      key: gallery.data_key,
      hash: gallery.hash,
      url: gallery.url,
      names: !!gallery.data_key && !!gallery.hash ? gallery.images.map((image) => image.name) : undefined,
    }));

  writeFileSync("keys.json", prettyJSON(keys));
  writeFileSync("keys.min.json", minifyJSON(keys));

  const extensionData = keys.map((data) => ({ id: data.id, key: data.key, hash: data.hash, url: data.url }));

  writeFileSync("extension_data.json", prettyJSON(extensionData));
  writeFileSync("extension_data.min.json", minifyJSON(extensionData));
} catch (error) {
  core.setFailed(error.message);
}
