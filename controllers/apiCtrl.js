const unirest = require('unirest');
const spoonURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/';

module.exports = {
	/* Get recipe from given ingredients */
	getRecipe: async(req, res) => {
		try{
			/* List of ingredients in an array */
            let ingredients = ["apples","flour","sugar"];
			/* Number of results to return */
			let num = 5;
			/* Ranking...? not sure, default is 1 */
			let ranking = 1;

			unirest.get(`${spoonURL}/recipes/findByIngredients?number=${num}&ranking=${ranking}&fillIngredients=true&ingredients=${ingredients}`)
				.header("X-RapidAPI-Key", process.env.SPOON_TOKEN)
				.end(function (result) {
					/* Make sure we fetched results correctly */
					if(result.status==200)
						res.send(result.body);
					else
						res.send(result.status);

					/* Lets print out remaining api requests for today */
					console.log(`Remaining Spoon Requests: ${result.headers['x-ratelimit-requests-remaining']}\nRemaining Spoon Results: ${result.headers['x-ratelimit-results-remaining']}`);
			});
		}catch(err){
			res.status(404).send({
				response: err.name,
				message: err.message
			});
		}
	},
    
    searchRecipe: async(req, res) => {
        try{
            let { search } = req.query;
            if(!search||search=="")
                throw "Invalid search parameters"
            search = search.split(" ").join("+");

            unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?number=10&query="+search)
                .header("X-RapidAPI-Key", process.env.SPOON_TOKEN)
                .end(function (result) {
                    console.log(result);

					if(result.status==200)
						res.send(result.body);
					else
						res.send(result.status);

					/* Lets print out remaining api requests for today */
					console.log(`Remaining Spoon Requests: ${result.headers['x-ratelimit-requests-remaining']}\nRemaining Spoon Results: ${result.headers['x-ratelimit-results-remaining']}`);
                });


        }catch(err){
            console.log(err);
            err = err.name ? {response: err.name,message: err.message} : {err}
			res.status(404).send(err);
        }
    }

}

