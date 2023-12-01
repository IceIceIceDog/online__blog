const path = require('path');
const uuid = require('uuid');
const fs = require('fs');
const APIError = require('../errors/APIError');
const { error } = require('console');

class FileService{
   uploadPostImage(image){

    const filename = uuid.v4() + '.jpg';
 
    image.mv(path.resolve(__dirname, '../..', 'userfiles', filename));
    return filename;
   }

   deleteUploadedImage(filename){
       fs.unlink(path.resolve(__dirname, '../..', 'userfiles', filename), (error) => {
        console.log(error);
       });
   }

   uploadBlobData(blobfile){
    const base64Data = blobfile.replace(/^data:([A-Za-z-+/]+);base64,/, '');

    const filename = uuid.v4() + '.jpg';

    const filepath = path.resolve(__dirname, '../..', 'userfiles', filename);

    fs.writeFileSync(filepath, base64Data, {encoding: 'base64'});

    return filename;
   }
}

module.exports = new FileService();