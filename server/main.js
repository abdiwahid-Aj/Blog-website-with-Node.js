const express = require('express');
const router = express.Router();
const post = require('./models/post')

/* GET/ HOME */
router.get('/', async (req, res) =>{
  
   try {
    const aj = {
        title: "aj-web2",
        description: "hello aj  welcome to your second node.js and express tutorial"
    }
    let perpage = 50;
    let page = req.query.page || 1;

    const data = await post.aggregate([{$sort: {createdAt: -1}}])
    .skip(perpage * page - perpage)
    .limit(perpage)
    .exec();

    const count = await post.countDocuments();
    const nextpage = parseInt(page) + 1;
    const hasnextpage = nextpage <= Math.ceil(count / perpage);

    data.forEach(post => {
        post.createdAt = new Date(post.createdAt);
    });

    res.render('index', {
        aj,
        data,
    current: page,
    nextpage: hasnextpage ? nextpage : null
});
   } catch (error) {
    console.log(error)
   }
   
});

 function insertPostData(){
   post.insertMany([
    {
    title: "building blog3",
    body: "building another blog with node js"
   },
   {
    title: "building another node.js",
    body: "this is the second nodejs project and its going good"
   },
])
} 
insertPostData();

/* GET/ HOME */

/* router.get('/', async (req, res) =>{
    try {
     const data = await post.find();
 
     res.render('index', {aj,data});
    } catch (error) {
     console.log(error)
    }
    
 });
 
  function insertPostData(){
    post.insertMany([
     {
     title: "building blog3",
     body: "building another blog with node js"
    },
    {
     title: "building another node.js",
     body: "this is the second nodejs project and its going good"
    },
 ])
 } 
 insertPostData();
 
 */


 // redirecting to another when we click the homepage links.

router.get('/post/:id', async(req, res) =>{
    try {
        let slug = req.params.id.trim();
        const data = await post.findById({_id: slug});
        const aj = {
            title: data.title,
            description: "hello aj  welcome to your second node.js and express tutorial"
        }

       
        res.render('post', {aj, data});
    } catch (error) {
        console.log(error);
    }
})
// end of using id to go throught pages

// post search term basically we are search through the web

router.post('/search', async (req, res)=>{
    
 
    try {
        const aj = {
            title: "search",
            description: "hello aj  welcome to your second node.js and express tutorial"
        }
        
        let searchTerm = req.body.searchTerm;
        const spchar = searchTerm.replace(/ [^a-zA-Z0-9 ]/g, "");

   
       const data = await post.find({
        $or:
       [
        {title: {$regex: new RegExp(spchar, 'i')} },
        {body: {$regex: new RegExp(spchar, 'i')}}
       ]
       });
        res.render("search", {data, aj});
    } 
  
    catch (error) {
        console.log(error);
    }
})







//end of search pots
router.get('/about', (req, res) =>{
    res.render('about',{aj});
});


module.exports = router;