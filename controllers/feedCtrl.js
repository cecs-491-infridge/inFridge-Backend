// Module to that handles reading and writing user posts
// via the User and Post models

const User = require('../models/User');
const { Post } = require('../models/Post');
const feedLimit = 5;
const feedRadius = 5; // in km
const R = 6371; // Earth's radius

module.exports = {

	/* Grab feed of friends */
	getUserFeed: async(req, res) => {
		try{

            /* params */
			let id = req.params.id;
            let { page=0, limit=feedLimit } = req.body;

			/* Get post from user's friends*/
			let friends = (await User.findById(id)).friends;
            let posts = await Post.find({
                    'author':{$in:friends}
                })
                .sort({createdAt:'desc'})
                .skip(page*limit)
                .limit(limit)
                .populate('author');

            /* send reply */
			res.status(200).send({
				data:posts
			});

		}catch(err) {
            err = err.name ? {response: err.name,message: err.message} : {err}
			res.status(404).send(err);
		}
	},

	getNearbyFeed: async(req, res) => {
        try{

            /* params */
			let id = req.params.id;
            let { longitude, latitude, radius=feedRadius, page=0, limit=feedLimit } = req.body;
            if(!longitude||!latitude) throw 'longitude and latitude cannot be null';

            /* Get bounds for lon, lat */
            let bounds = getBounds(longitude,latitude,radius);

            /* Query posts within the bounds */
            let posts = await Post.find({
                    "location.latitude": {$gte:bounds.minLat, $lte:bounds.maxLat},
                    "location.longitude": {$gte:bounds.minLon, $lte:bounds.maxLon}
                })
                .sort({createdAt:'desc'})
                .skip(page*limit)
                .limit(limit)
                .populate('author');

            /* send reply */
            res.status(200).send({
                data:posts
            });

		}catch(err) {
            err = err.name ? {response: err.name,message: err.message} : {err}
			res.status(404).send(err);
        }
	}
}

/* get bounds according to longitude, latitude, and radius */
function getBounds(lon,lat,radi){
    let maxLat = lat + toDeg(radi/R);
    let minLat = lat - toDeg(radi/R);
    if(minLat>maxLat) [minLat, maxLat] = [maxLat, minLat];

    let maxLon = lon + toDeg(Math.asin(radi/R) / Math.cos(toRad(lat)));
    let minLon = lon - toDeg(Math.asin(radi/R) / Math.cos(toRad(lat)));
    if(minLon>maxLon) [minLon, maxLon] = [maxLon, minLon];

    return {maxLat,minLat,maxLon,minLon}
}

function toDeg(rad){return rad*180/Math.PI;}
function toRad(deg){return deg*Math.PI/180;}
