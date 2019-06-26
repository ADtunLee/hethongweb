const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const Comment = require('../models/CommentModel').Comment;
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel').User;
const {isEmpty} = require('../config/customFunctions');
module.exports = {
    
    index: async (req, res) => {
        const categories = await Category.find();
        Post.find()
            .populate({path:'user'})
            .then(posts =>{
            res.render('default/index', {posts: posts, categories: categories, users: posts.user});
        })
        
    },
    loginGet: (req, res) => {
        res.render('default/login', {message: req.flash('error')});
    },
    
    registerGet: (req, res) => {
        res.render('default/register');
    },
    loginPost: (req,res)=>{
       
    },
    registerPost: (req, res) => {
        let filename = '';
        const code = 'admincode123';
        if (!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir + filename, (err) => {
                if (err)
                    throw err;
            });
        }
        let errors = [];

        if (!req.body.firstName) {
            errors.push({message: 'First name is mandatory'});
        }
        if (!req.body.lastName) {
            errors.push({message: 'Last name is mandatory'});
        }
        if (!req.body.email) {
            errors.push({message: 'Email field is mandatory'});
        }
        if (!req.body.phone) {
            errors.push({message: 'Phone is mandatory'});
        }
        if (!req.body.password || !req.body.passwordConfirm) {
            errors.push({message: 'Password field is mandatory'});
        }
        if (req.body.password !== req.body.passwordConfirm) {
            errors.push({message: 'Passwords do not match'});
        }

        if (errors.length > 0) {
            res.render('default/register', {
                errors: errors,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                profesion: req.body.profession,
                avatar: `/uploads/${filename}`
            });
        } else {
            User.findOne({email: req.body.email}).then(user => {
                if (user) {
                    req.flash('error-message', 'Email đã tồn tại, hãy thử đăng nhập.');
                    res.redirect('/login');
                } else {
                    const newUser = new User(req.body);
                    if(req.body.admincode == code){
                        newUser.isAdmin = true;
;                    };
                    newUser.avatar = `/uploads/${filename}`;
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash('success-message', 'Bạn đã đăng ký thành công');
                                res.redirect('/login');
                            });
                        });
                    });
                }
            });
        }
    },
    getSinglePost:  async (req,res) =>{
        const id = req.params.id;
        const categories = await Category.find();
    
        Post.findById(id)
            .populate([{path: 'comments', populate: {path: 'user', model: 'user'}},{path:'user'},{path:'category'}])
            .then(post => {
            if (!post) {
                res.status(404).json({message: 'Không tồn tại bài viết'});
            }
            else {
                res.render('default/singlePost', {post: post, comments: post.comments, categories: categories, users: post.user,category:post.category});
            }
        })
    },
    submitComment: (req, res) => {

        if (req.user) {
            Post.findById(req.body.id).then(post => {
                const newComment = new Comment({
                    user: req.user.id,
                    body: req.body.comment_body
                });

                post.comments.push(newComment);
                post.save().then(savedPost => {
                    newComment.save().then(savedComment => {
                      req.flash('success-message', 'Comment thành công.');
                      res.redirect(`/post/${post._id}`);
                    });
                });


            })
        }

        else {
            req.flash('error-message', 'Đăng nhập để bình luận');
            res.redirect('/login');
        }

    },
    getUserInfo: async(req,res) =>{
        const id = req.params.id;
        User.findById(id)
            .populate({path:'user'})
            .then(user =>{
            if (!user) {
                res.status(404).json({message: 'Không tìm thấy người dùng'});
            }
            else {
                res.render('default/infoUser', {user:user});
            }
        })
    },
};