const { ObjectId } = require('mongodb');
const fs = require('fs');
const dbClient = require('../utils/db');

class FilesController {
  constructor() {
    const { client } = dbClient;
    this.database = client.db(dbClient.database);
    this.collection = this.database.collection('files');
  }

  /* async getSubPath(fileData, parents = ['test']) {
    const checkFile = {
      name: fileData.name,
      userId: fileData.userId,
      parentId: fileData.parentId,
    };
    const paths = await this.collection.findOne(checkFile).then((foundFile) => {
      if (foundFile && foundFile.type === 'folder') {
        parents.unshift(foundFile.name);
        if (foundFile.parentId) {
          return this.getSubPath(foundFile, parents);
        }
      }
      console.log(parents);
      parents = parents.join('/');
      return parents;
    });
    return paths;
  } */

  postUpload(fileDetails, userId, responseObject) {
    const required = ['name', 'type', 'data'];
    const fileDetailKeys = Object.keys(fileDetails);
    required.forEach((entry) => {
      if (fileDetailKeys.indexOf(entry) === -1) {
        return responseObject.status(400).send({ error: `Missing ${entry}` });
      }
      return '';
    });

    if (fileDetails.parentId) {
      // check if the there is file with this parent id
      this.collection.findOne({ _id: ObjectId(fileDetails.parentId) }).then((result) => {
        if (!result) {
          return responseObject.status(400).send({ error: 'Parent not found' });
        } if (result.type !== 'folder') {
          return responseObject.status(400).send({ error: 'Parent is not a folder' });
        }
        // save the document with the user id
        const fileData = {
          name: fileDetails.name,
          type: fileDetails.type,
          parentId: fileDetails.parentId,
          isPublic: fileDetails.isPublic ? fileDetails.isPublics : false,
          userId,
        };
        // insert the file to db
        return this.collection.insertOne(fileData).then((response) => {
          // save the file in the disk
          const basePath = process.env.FOLDER_PATH ? process.env.FOLDER_PATH : '/tmp/files_manager';
          const content = Buffer.from(fileData.data, 'base64').toString('utf-8');
          let fullPath;
          if (fileData.parentId === 0) {
            // save it at the root
            fullPath = `${basePath}/${fileData.name}`;
            fs.writeFileSync(fullPath, content, { encoding: 'utf-8' });
          } else {
            // find all the relevant parents and have them joined
          }
          responseObject.status(201).send(response);
        });
      });
    } else {
      // store the file in db with parent id 0
      const fileData = {
        name: fileDetails.name,
        type: fileDetails.type,
        parentId: 0,
        isPublic: fileDetails.isPublic ? fileDetails.isPublic : false,
        userId,
      };
      const basePath = process.env.FOLDER_PATH ? process.env.FOLDER_PATH : 'C:\\Users\\user\\Desktop\\python\\request';
      const content = Buffer.from(fileDetails.data, 'base64').toString('utf-8');
      const fullPath = `${basePath}/${fileData.name}`;
      // check if the file already exist
      const checkFile = {
        name: fileData.name,
        userId,
        parentId: fileData.parentId,
      };
      return this.collection.findOne(checkFile).then((foundFile) => {
        if (!foundFile) {
          return this.collection.insertOne(fileData).then((inserted) => {
            if (inserted) {
              // save it at the root
              fs.writeFile(fullPath, content, { encoding: 'utf-8' }, () => responseObject.status(200).send(inserted));
            }
          });
        }
        return responseObject.status(200).send({ error: 'file already exists' });
      });
    }
    const validation = 'Files is validated';
    return responseObject.status(200).send({ validation });
  }
}

module.exports = FilesController;
