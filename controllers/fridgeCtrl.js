const util = require('../utility/responses');
const User = require('../models/User');
const Fridge = require('../models/Fridge');
const UserFood = require('../models/UserFood');

module.exports = {
    getUserFood: async (req, res) => {
        try {
            const userId = req.params.id;
            
            const foodList = await User.findById(userId)
                .select('foodList')
                .populate('foodList', ((err, user) => {
                    if(err) throw new Error("Cannot populate User.foodList");

                    return user.foodList;
                }));
                
            console.log(foodList);

            res.status(201).send({
                response: 'Successfully got food!',
                data: foodList
            });
        }catch(err) {
            res.status(409).send({
                error: err.name,
                message: err.message
            });
        }
    },
    createFood: async (req, res) => {
        try {
            const { userId, name, expirationDate } = req.body;

            // Save Food
            const food = new UserFood({
                name,
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
    deleteFood: async(req, res) => {
        try{
            const { userId, foodId } = req.body;

            const foodRm = await Food.remove({ _id: foodId });

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
    // createFridge: async(req, res) => {
    //     try{
    //         const { owner, name, public } = req.body;

    //         // Validate owner exists
    //         const exists = !!await User.count({_id: owner});
    //         if(!exists) throw new Error('Owner does not exist');

    //         const fridge = new Fridge({
    //             owners: [owner],
    //             name,
    //             public
    //         });
    
    //         const newFridge = await fridge.save();

    //         res.status(201).send({
    //             response: 'Fridge successfully Saved!',
    //             data: newFridge
    //         });
    //     }catch(err) {
    //         res.status(409).send({
    //             error: err.name,
    //             message: err.message
    //         });
    //     }
    // },
    // getUserFridge: async (req, res) => {
    //     try{
    //         const userId = req.params.id;

    //         const fridge = await User.findById(userId)
    //         .select("foodList")
    //         .populate("foodList")
    //         .exec((err, user) => {
    //             if(err) throw new Error("Cannot populate User.foodList");
                
    //             console.log(user);
    //             return user.foodList;
    //         });
            
    //         console.log(fridge);
    //         res.status(201).send({
    //             data: fridge
    //         });
    //     }catch(err) {
    //         res.status(404).send({
    //             response: err.name,
    //             message: err.message
    //         });
    //     }
    // },
    // getAllFridges: async (req, res) => {
    //     try{
    //         const fridges = await Fridge.find({});
    //         res.status(201).send({
    //             data: fridges
    //         });
    //     }catch(err) {
    //         res.status(404).send({
    //             response: err.name,
    //             message: err.message
    //         });
    //     }
    // },
    // deleteFridge: async(req, res) => {
    //     try{
    //         const { userId, fridgeId } = req.body;

    //         const fridgeRm = await Fridge.remove({ _id: fridgeId });

    //         const query = { _id: userId };
    //         const update = { $pull: { fridges: fridgeId }};
    //         const userFridgeRm = await User.updateOne(
    //             query,
    //             update
    //         );

    //         res.status(200).send({
    //             response: 'Fridge successfully Deleted!',
    //             data: {
    //                 ...fridgeRm,
    //                 ...userFridgeRm
    //             }
    //         });
    //     }catch(err) {
    //         res.status(409).send({
    //             error: err.name,
    //             message: err.message
    //         });
    //     }
    // }
}

// curl -d '{"owner":"5c5cafc9739fa4962c0308fd","name": "New Fridge", "public": "false"}' -H "Content-Type: application/json" -X POST http://localhost:3000/create-fridge