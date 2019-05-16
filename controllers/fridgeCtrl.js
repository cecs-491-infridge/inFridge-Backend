// Module to that handles reading and writing user food items
// via the User and UserFood models
// Can getAll, create, delete, and deleteMultiple

const util = require('../utility/responses');
const User = require('../models/User');
const Fridge = require('../models/Fridge');
const UserFood = require('../models/UserFood');

module.exports = {
    /*
        Get a User's food list

        params: userId
        return: Array of foodList objects
    */
    getUserFood: async (req, res) => {
        try {
            const userId = req.params.id;
console.log('In Get User Food');            
            await User.findById(userId)
                .populate('foodList', ((err, foodList) => {
                    if(err) throw new Error("Cannot populate User.foodList");

                    res.status(201).send({
                        response: 'Successfully got food!',
                        data: foodList
                    });
                }));
        }catch(err) {
            res.status(409).send({
                error: err.name,
                message: err.message
            });
        }
    },
    /*
        Create a new UserFood and add to a User's food list

        params required: userId, foodName
        params optional: purchaseDate, expirationDate
        return: Success or error message
    */
    createFood: async (req, res) => {
        try {
            const { userId, name, purchaseDate, expirationDate } = req.body;

            // Save Food
            const food = new UserFood({
                name,
                purchaseDate,
                expirationDate
            });
            const newFood = await food.save();

            // Add to User foodlist
            const query = { _id: userId };
            const update = { $push: { foodList: newFood._id } };
            const pushToFoodList = await User.updateOne(
                query,
                update
            );

            res.status(201).send({
                response: 'Food successfully Saved!',
                data: {
                    ...newFood,
                    ...pushToFoodList
                }
            });        
        }catch(err) {
            res.status(409).send({
                error: err.name,
                message: err.message
            });
        }
    },
    /*
        Delete multiple UserFoods from a User's food list

        params: userId, Array of food ids to delete
        return: Success or error message
    */
    deleteMultipleFood: async(req, res) => {
        try{
            const { userId, foodIdList } = req.body;

            const query = { _id: userId };
            for(let i = 0; i < foodIdList.length; i++){
                const foodId = foodIdList[i];
                const foodRm = await UserFood.remove({ _id: foodId });

                const update = { $pull: { foodList: foodId }};
                const userFoodRm = await User.updateOne(
                    query,
                    update
                );
            }

            res.status(200).send({
                response: 'Food successfully Deleted!'
            });
        }catch(err) {
            res.status(409).send({
                error: err.name,
                message: err.message
            });
        }
    },
    /*
        Delete a UserFood from a User's food list

        params: userId, foodId to delete
        return: Success or error message
    */
    deleteFood: async(req, res) => {
        try{
            const { userId, foodId } = req.body;

            const foodRm = await UserFood.remove({ _id: foodId });

            const query = { _id: userId };
            const update = { $pull: { foodList: foodId }};
            const userFoodRm = await User.updateOne(
                query,
                update
            );

            res.status(200).send({
                response: 'Food successfully Deleted!',
                data: {
                    ...foodRm,
                    ...userFoodRm
                }
            });
        }catch(err) {
            res.status(409).send({
                error: err.name,
                message: err.message
            });
        }
    },
    /*
        Test method to get all UserFoods in the database

        params: none
        return: Array of UserFood objects
    */
    getAllFood: async (req, res) => {
        try{
            const food = await UserFood.find({});
            res.status(201).send({
                data: food
            });
        }catch(err) {
            res.status(404).send({
                response: err.name,
                message: err.message
            });
        }
    },
}
