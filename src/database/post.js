const UserModel = require("../models/user");
const PostModel = require("../models/post");


// return and add a post to the db
async function createPost(title, price, state, description, userID, userName) {
  const post = new PostModel({
    title: title,
    price: price,
    state: state,
    description: description,
    refUser: userID,
    seller: userName,
    ban: {
      reason: '',
      at: new Date(),
      banned: false
    },
  });

  await post.save();

  return post;
}

// Utils : get the mean value of a list of integer (used for ratings of sellers)
function getMean(lst) {
  if (lst.length == 0) {return 0;}
  let mean = 0;
  for(i = 0; i < lst.length; i++) {
    mean += lst[i];
  }
  return mean / lst.length;
}

// get the posts with the according seller's informations to display on main page
async function getAllPosts(){
  
  const postsFromDB = await PostModel.find();
  let postsResult = [];
  
  for(i = 0; i < postsFromDB.length; i++) {
    let seller = await UserModel.findById(postsFromDB[i].refUser)  
    let post = {
      title: postsFromDB[i].title,
      price: postsFromDB[i].price,
      state: postsFromDB[i].state,
      seller: seller.name,
      sellerRating: getMean(seller.ranking)
    }
    postsResult.push(post);
  }
  
  // reverse the posts list to have the last ones displayed first on the index page
  postsResult.reverse();
  return postsResult;
}


module.exports = {
  createPost,
  getAllPosts
};