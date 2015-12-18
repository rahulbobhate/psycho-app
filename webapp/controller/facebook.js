var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var request = require('request');
var async = require('async');
var Fb = require('fb');

var FACEBOOK_APP_ID = "518518058323214";
var FACEBOOK_APP_SECRET = "2d09d7a96a0813ffe0fc426ab5cbef46";

var likeWeightage = 0.5;
var postWeightage = 1;

GLOBAL.fetchMoreLikesCount = 1;

passport.serializeUser(function(profile, done) {
	done(null, profile);
});

passport.deserializeUser(function(id, done) {
	done(null, profile)
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: "http://localhost:3000/auth/facebook/callback"
	},
	function(token, tokenSecret, profile, done) {
		exports.fetchLikes(token, profile.id, function(error, value) {
			if(error) {
				done(error, null)
			}
			else {
				var totalScore = value.likesScore + value.postsScore
				var info = {
					id: profile.id,
					fullName: profile.displayName,
					gender: profile.gender,
					cummulativeScore: value,
				}
				info.cummulativeScore.total = totalScore
				done(null, info)
			}
		});
	}
));

exports.fetchLikes = function(token, fbId , callback) {
	// if token expires convert this token long lived token
	Fb.setAccessToken(token);
	Fb.api('', 'post',  { 
    batch: [
        { method: 'get', relative_url: 'me/likes' },
        { method: 'get', relative_url: 'me/feed' }
    ]
	} , function (response) {
		var res1 , res2;
		if(!response || response.error) {
			console.log(!response ? 'error occurred' : response.error);
		}
		else {
			async.parallel({
				likes: function(callback) {
		  		var likeRes = JSON.parse(response[0].body);
		  		likeRes = likeRes.data
		  		var likeString = ""
		  		for(var i=0; i<likeRes.length; i++) {
		  			likeString = likeString + likeRes[i].name + ","
		  		}
		  		var info = {
		  			val: likeString,
		  			fbId: fbId
		  		}

		  		exports.receptivity(info, function(error, value) {
		  			if(error) {
		  				callback(error, null)
		  			}
		  			else {
		  				callback(null, value)
		  			}
		  		})
				},
				posts: function(callback) {
  				var postRes = JSON.parse(response[1].body);
		  		postRes = postRes.data
		  		var postString = ""
		  		for(var i=0; i<postRes.length; i++) {
		  			postString = postString + postRes[i].name + " "
		  			if(postRes[i].description) {
		  				postString = postString + postRes[i].description + ", "
		  			}
		  			else {
		  				postString = postString + ', '
		  			}
		  		}
		  		var info = {
		  			val: postString,
		  			fbId: fbId
		  		}

		  		exports.receptivity(info, function(error, value) {
		  			if(error) {
		  				callback(error, null)
		  			}
		  			else {
		  				callback(null, value)
		  			}
		  		})

				}
			}, function(error, value) {
				if(error) {
					console.log(error)
				}
				else {
					var data = {
						likes: value.likes,
						posts: value.posts
					}
					exports.manupulateReceptivityScore(data, function(error, value) {
						if(error) {
							callback(error, null)
						}
						else {
							callback(null, value)
						}
					})
				}
			})
		}
	});
}

exports.receptivity = function(info, callback) {
	var url = 'https://api.receptiviti.com/api/writing_sample'
	var data = {
		"content" : info.val,
		"client_reference_id" : info.fbId,
		"content_source" : "4" // social data
	}
	var options = {
		url : url,
		method : 'POST',
		json    : true,
	  rejectUnauthorized : false,
	  headers : {
	  	"X-API-KEY" : "5639519856e14443b554dcd9",
			"X-API-SECRET-KEY" : "Y3yfGYd0zJ5wFIeSekHsM8UUlNRMGsJE2LwzWAA6rGw",
	   	"Content-Type": "application/json; charset=utf-8"
	  },
	  body : data
  }
	request(options,function(error,response,body){
		if(error){
			console.log('[!] request from validateToken returned error %j', error);
			callback(error, null)
		}
		else if(body.error) {
			console.log('[!] request from validateToken returned error %j', body.error);
			callback(error, null)
		}
		else if(body && body.receptiviti_scores) {
			callback(null, body.receptiviti_scores.raw_scores)
		}
		else {
			callback(null, {})
		}
	})
}

exports.manupulateReceptivityScore = function(data, callback) {
	var likesScore = data.likes;
	var postsScore = data.posts

	async.parallel({
		likes: function(callback) {
			if(Object.keys(likesScore).length) {
				var cummulativeScore = 0
				for(var key in likesScore) {
					if(key == 'social_skills' || key == 'neuroticism' || key == 'insecure' || key == 'depression' || key == 'brooding' || key =='hostile') {
						cummulativeScore = cummulativeScore + likesScore[key]
					}
				}
				console.log('likes score ' + cummulativeScore)
				cummulativeScore = (cummulativeScore * likeWeightage)/6
				callback(null, cummulativeScore)
			}
			else {
				callback(null, 0)
			}
		},
		posts: function(callback) {
			if(Object.keys(postsScore).length) {
				var cummulativeScore = 0
				for(var key in postsScore) {
					if(key == 'social_skills' || key == 'neuroticism' || key == 'insecure' || key == 'depression' || key == 'brooding' || key =='hostile') {
						cummulativeScore = cummulativeScore + postsScore[key]
					}
				}
				console.log('posts score ' + cummulativeScore)
				cummulativeScore = (cummulativeScore * postWeightage)/6
				callback(null, cummulativeScore)
			}
			else {
				callback(null, 0)
			}
		}
	}, function(error, value) {
		if(error) {
			callback(error, null)
		}
		else{
			var cummulative = {
				likesScore: value.likes,
				postsScore: value.posts
			}
			callback(null, cummulative)
		}
	})
}

// exports.fetchMoreLikes = function(likesPagingInfo, feedsPagingInfo) {
// 	console.log("Inside fetch more likes " + GLOBAL.fetchMoreLikesCount + " times");
// 	if(likesPagingInfo && feedsPagingInfo) {
// 		console.log("inside if of fetchmorelikes before processing" + GLOBAL.fetchMoreLikesCount + "times");
// 		console.log("likesPagingInfo: %j" + likesPagingInfo);
// 		console.log("feedsPagingInfo: %j" + feedsPagingInfo);
// 		Fb.api('', 'post',  { 
// 	    batch: [
// 	        { method: 'get', relative_url: likesPagingInfo },
// 	        { method: 'get', relative_url: feedsPagingInfo }
// 	    ]
// 		} , function (response) {
// 			var res1 , res2;
// 			if(!response || response.error) {
// 				console.log(!response ? 'error occurred' : response.error);
// 				// res.send(response.error)
// 			}
// 			else {
// 				console.log("no error in calling fb api");
// 				if(GLOBAL.fetchMoreLikesCount == 1) {
// 					res1 = JSON.parse(response[0].body);
// 					res2 = JSON.parse(response[1].body);
// 					exports.fetchMoreLikes(res1.paging, res2.paging);
// 				}
// 				else {
// 		    		res1 = JSON.parse(response[0].body);
// 		    		res2 = JSON.parse(response[1].body);
// 					exports.fetchMoreLikes(res1, res2);
// 				}
// 		});
// 	}
// 	console.log("after if of fetchmorelikes " + GLOBAL.fetchMoreLikesCount + "times");
// 	console.log("likesPagingInfo: %j" + likesPagingInfo);
// 	console.log("feedsPagingInfo: %j" + feedsPagingInfo);
// 	GLOBAL.fetchMoreLikesCount += 1;
// }