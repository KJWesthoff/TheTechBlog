const sequelize = require('../config/connection');

const {Post, User, Comment} = require('../models');

const router = require('express').Router();


router.get('/', (req, res) => {
    console.log(req.session);
  
    Post.findAll({
      attributes: [
        'id',
        'title',
        'created_at',
      
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        // pass a single post object into the homepage template
        // console.log(dbPostData[0]);
        const posts = dbPostData.map(post => post.get({plain:true}));
        console.log(posts)
        res.render('startpage', {
          posts,
          loggedIn: req.session.loggedIn
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

router.get('/signin', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('signin');
  });
  


  router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('signup');
  });


  module.exports = router;