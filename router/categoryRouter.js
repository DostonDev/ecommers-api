const router = require('express').Router()
const authAdmin = require('../middleware/authAdmin')
const auth = require('../middleware/auth')
const categoryCtrl = require('../controllers/categoryCtrl')






router.route('/category')
    .get(categoryCtrl.getCategories)
    .post(auth,authAdmin,categoryCtrl.createCategory)


router.route('/category/:id')
    .delete(auth,authAdmin,categoryCtrl.deleteCategory)
    .put(auth,authAdmin,categoryCtrl.updateCategory)











module.exports = router