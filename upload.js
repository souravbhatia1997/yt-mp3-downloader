const fs = require('fs');
const path = require("path");
const { google } = require('googleapis');
const drive = google.drive({ version: 'v3' });

let getFolderId = async () => {
    let folderName = "YT-TO-MP3";
    let result = await google.drive({ version: 'v3' }).files.list({
        q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
    }).catch(e => console.log("eeee", e));
    console.log("result:  ", result);
    // let folder = result.data.files.filter(x => x.name === folderName);
    // let folderId = folder.length?folder[0].id:0;
    // return folderId;
}

const uploadSingleFile = async (fileName, filePath) => {
  const folderId = "15YECFhzN0MoqVasqlGefW8qITYFgiCtk";
  const { data: { id, name } = {} } = await drive.files.create({
    resource: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType: 'audio/mpeg',
      body: fs.createReadStream(filePath),
    },
    fields: 'id,name',
  });
  console.log('File Uploaded', name, id);
};

const scanFolderForFiles = async (folderPath) => {
  const folder = await fs.promises.opendir(folderPath);
//   console.log("folder:  ", folder);
  for await (const dirent of folder) {
    console.log("\ndirent:   ", dirent);
    if (dirent.isFile() && dirent.name.endsWith('.mp3')) {
      await uploadSingleFile(dirent.name, path.join(folderPath, dirent.name));
      await fs.promises.rm(filePath);
    }
  }
};

module.exports = scanFolderForFiles;