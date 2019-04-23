const multer  = require('multer');

module.exports = {
    getMulterMultiple: (maxMegabytes, maxFiles, maxFields) => {
        const MB_SIZE = 1000000;
    
        const storage = multer.memoryStorage();
        const limits = {
            fileSize: maxMegabytes * MB_SIZE,
            files: maxFiles,
            fields: maxFields,
    
        }
        const multipleUpload = multer({
                storage,
                limits
            }).array('file');
    
        return multipleUpload;
    },
    getMulterSingle: (maxMegabytes, maxFields) => {
        const MB_SIZE = 1000000;
    
        const storage = multer.memoryStorage();
        const limits = {
            fileSize: maxMegabytes * MB_SIZE,
            fields: maxFields,
    
        }
        const singleUpload = multer({
                storage,
                limits
            }).single('file');
    
        return singleUpload;
    }
}