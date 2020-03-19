var express = require('express');
const router = express.Router();
const knex = require('../db/knex');


/* GET todo listing. */
router.get('/', (req, res) => {
  knex('todo')
  .select()
  .then(todos => {
    res.render('all', { todos: todos });
  }); 
});


function respondAndRenderTodo(id, res, viewName){
    if(typeof id != 'undefined'){
      knex('todo')
          .select()
          .where('id', id)
          .first()
          .then(todo => {
            res.render(viewName, todo);
          });
    } else {
        res.status(500);
        res.render('error', {
          message: 'Invalid id'
        });
      }
};


router.get('/:id', (req, res) => {
  const id = req.params.id;
  respondAndRenderTodo(id, res, 'single');
});

router.get('/:id/edit', (req, res) => {
  // get todo with the id in the url  
  const id = req.params.id;
  respondAndRenderTodo(id, res, 'edit');
});


router.get('/new', (req, res) => {
  res.render('new');
});


function validTodo(todo) {
  return typeof todo.title == 'string' && 
         todo.title.trim() != '' && 
         typeof todo.priority != 'undefined' &&
         !isNaN(Number(todo.priority));
};

router.post('/', (req, res) => {
  console.log(req.body);
  if(validTodo(req.body)) {
  const todo = {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    date: new Date()
};
// insert into the database 
  knex('todo')
    .insert(todo, 'id')
    .then(ids => {
      const id = ids[0];
      res.redirect(`/todo/${id}`);
    });
} else {
  //response with a error
  res.status(500);
  res.render('error', {
    message: 'Invalid todo'
  });
  }
});

router.put('/:id', (req, res) => {

});


module.exports = router;
 