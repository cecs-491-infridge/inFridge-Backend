/*
Module with helper methods for performing CRUD operations and returning the response to the api caller
*/

module.exports = {
    // For POST requests
    /*
    Saves a document to the database and sends success or error message to api caller

    params: doc to save
    */
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
    /*
    Gets a document from the database and sends it to api caller

    params: model to query, id to search by
    */
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

    /*
    Finds a document from the database by id and populates a property,
    then sends response to api caller

    params: model to query, id to search by, property to populate
    */
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
