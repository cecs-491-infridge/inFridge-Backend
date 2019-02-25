//const transaction = require('../models/Transaction');
module.exports = {
    // For POST requests
    saveDocAndRespond: async(res, doc) => {
        try{
            const newDoc = await doc.save();

            res.status(201).send({
                response: 'Document successfully Saved!',
                data: newDoc
            });
        }catch(err) {
            console.log(err.name+'\n');
            console.log(err.code+'\n');
            console.log(err.message);

            res.status(409).send({
                error: err.name,
                message: err.message
            });
        }
    },

    // For GET requests
    getDocByIdAndRespond: async(res, model, id) => {
        try{
            const doc = await model.findById(id);
            res.status(200).send({
                data: doc
            });
        }catch(err) {
            console.log(err);
            res.status(404).send({
                response: err.name,
                message: err.message
            });
        }
    },

    populateAndRespond: async(res, model, id, property) => {
        try {
            await model.findOne({ _id: id })
            .populate(property)
            .exec(function(err, doc) {
                if(err) throw new Error();

                res.status(200).send({
                    data: doc[property]
                });
            });

        }catch(err) {
            console.log(err);
            res.status(404).send({
                response: err.name,
                message: err.message
            });
        }
    }
}
