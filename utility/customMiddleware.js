const { verifyToken } = require('./jwt');

const multer  = require('multer');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const idConstructor = require('mongoose').Types.ObjectId;

module.exports = {
    // Middleware used for all routes
    // Attempt to login user
    // and call next() regardless of success
	login: async (req, res, next) => {
        const { token } = req.body;

        // No attempt to login
        if(!token) {
            console.log('Did not log in');
            return next();
        }

        try{
            const payload = await verifyToken(token);
            console.log('Login Middleware');
            console.log(payload);

            // Logged in
            if(payload.user) {
                console.log('Successfully logged in');
                req.user = payload.user;
            }else {
            // Invalid attempt to login
                console.log('Could not Log in');
            }
        }catch(err) {
            console.log(err);
        }
        
        // Always call next()
        console.log('Calling next from login middleware');
        next();
	},
    loggedIn: (req, res, next) => {
        if (req.user) {
            next();
        }else {
            console.log('Not logged in')
            res.status(401).send('Please login');
        }
    },
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
    },
    uploadToAws: async(req, res, next) => {
        const bucketName = 'infridge-backend';
        const userId = req.user.id;

        console.log(req.body);

        // Get files
        // File was added by multer middleware
        // Check 'file' or 'files' based on multer option
        let files;
        if(req.file) {
            files = [{
                buffer: req.file.buffer,
                name: req.file.originalname
            }];
        }
        else {
            files = req.files.map(file => ({
                buffer: file.buffer,
                name: file.originalname
            }));
        }

        // Create id for file
        // Upload and save url
        try {
            let awsUrls = [];
            let ids = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const id = idConstructor();

                const uploadParams = {
                    Bucket: bucketName,
                    Key: `users/${userId}/${id}`,
                    Body: file.buffer,
                    ACL: 'public-read'
                };

                await s3.upload(uploadParams).promise();

                const url = `https://${bucketName}.s3.amazonaws.com/${uploadParams.Key}`;
                awsUrls.push(url);
                ids.push(id);
            }
            console.log('uploaded');

            // ATTRIBUTES ADDED TO REQ OBJECT
            req.awsUrls = awsUrls;
            req.ids = ids;

            next();
        }catch(err) {
            console.log(err)
        }
    }
}
