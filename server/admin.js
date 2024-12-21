const express = require('express');
const router = express.Router();
const post = require('./models/post');
const adminlayout = '../views/layouts/admin';
const user = require('./models/user');
const bcrypt = require('bcrypt'); // for password encryption.
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.Jwt_Secret;

// authorization or login check;

const authmiddleware = (req, res, next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: 'unauthorized'});
    }
 
      try{
     const decoded = jwt.verify(token, jwtSecret);
     req.userid = decoded.userid;
     next();
      
  } catch (error) {
    res.status(401).json({message: 'unauthorizes'});
  }
}

// get roter;
router.get('/admin', async(req, res)=>{
    try {
        const aj ={
            title : "admin",
            description : "second node js project"
        }
        res.render('admin/index',{aj, layout: adminlayout})
    } catch (error) {
        console.log(error)
    }
});

//post router for the username and password page;

/* router.post('/admin', async(req, res)=>{
    try {
        const {username, password} = req.body;
        console.log(req.body);
        res.redirect('/admin');
    } catch (error) {
        
    }
}) */
// username and password login or checking if they exist.
router.post('/admin', async(req, res)=>{
try {
    const {username, password} = req.body;
    const User = await user.findOne( { username } );
    if(!User){
        return res.status(401).json( {message: 'invalid credentials'} );
    }
    const ispassvalid = await bcrypt.compare(password, User.password);
    if (!ispassvalid){
        return res.status(401).json( {message: 'invalid credentials'} );
    }
   const token = jwt.sign({userid:User._id}, jwtSecret);
   res.cookie('token', token, {httpOnly: true});
   res.redirect('/dashboard');
} catch (error) {
    console.log(error);
}
});

// going to dashboard
router.get('/dashboard',authmiddleware, async (req, res) => {
   try {
     const aj ={
         title : "dashboard",
         description : "second node js project"
     }
     const data = await post.find();
     res.render('admin/dashboard', {aj, data, layout: adminlayout});
   } catch (error) {
    console.log(error)
   }
});

// get route admin create new post

router.get('/add-post',authmiddleware, async(req, res)=>{
    try {
        const aj = {
            title: "add new post",
            description:"second node project"
        }
        const data = await post.find();
        res.render('admin/add-post', {aj, layout: adminlayout})
    } catch (error) {
        console.log(error);
    }
})

//post for the add-post page

router.post('/add-post',authmiddleware, async(req, res)=>{
   try {
    
    try {
        const newpost = new post({
          title: req.body.title,
          body: req.body.body
        });
        await post.create(newpost);
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
    }
} catch (error) {
    console.log(error)
}
})
//get data for edit-post 
router.get('/edit-post/:id', async(req, res) =>{
    try {
        const aj={
            title: "Edit Post",
            description: "first edit post i have done"
        }
 const data = await post.findOne({_id: req.params.id});
 res.render('admin/edit-post',{aj, data, layout:adminlayout});
    } catch (error) {
        console.log(error);
    }
})
// updating data for blogs using put router
router.put('/edit-post/:id',authmiddleware, async(req, res)=>{
    try {
        await post.findByIdAndUpdate(req.params.id,{
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}`);

    } catch (error) {
        console.log(error);
    }
})
// delete fields 

router.delete('/delete-post/:id',authmiddleware, async(req, res)=>{
    try {
        await post.deleteOne({_id: req.params.id});
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
    }
});

// logout 
router.get('/logout', (req, res) =>{
    res.clearCookie('token');
    res.json({message: 'logout sucessfull'})
})






// username and password registeration;
/* 
router.post('/register', async(req, res) =>{
    try {
        const {username, password} = req.body;
        const hashpass = await bcrypt.hash(password, 10);
        try {
            const User = await user.create({username, password: hashpass});
            res.status(201).json({message: 'user created', User});
        } catch (error) {
            if(error.code === 11000){
                res.status(409).json({message: 'user already in use'});
            }
            res.status(500).json({message:'internal server error'});
        }
    } catch (error) {
        
    }
}) */








module.exports=router;