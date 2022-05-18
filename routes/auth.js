const express = require('express')
const router = express.Router()
const EmpController = require('../controller/Employee')
const AdminControlller = require('../controller/Admin')
const cors = require('cors')

const verify = require('./authVerify')

router.get('/', EmpController.showIndex)
router.post('/employee/signup',  EmpController.signUp)
router.post('/employee/signin',  EmpController.signin)

router.post('/admin/signup',cors(), AdminControlller.adminSignup)
router.post('/admin/signin',cors(), AdminControlller.adminSignin)
router.get('/admin/getemployees',verify,cors(), AdminControlller.getEmployees)
router.delete('/admin/delete/:id', verify, cors(), AdminControlller.deleteEmployee)
router.post("/admin/add", verify, cors(), AdminControlller.addEmployee);
router.put("/admin/edit/:id", verify, cors(), AdminControlller.editEmployee);

// router.get('/getemployees', verify,cors() ,Controller.getEmployees)
// router.get('/getemployee/:id',cors(), Controller.getEmployee)
// router.put('/updataemployee/:id',cors(),Controller.updateEmployee)
// router.delete('/deleteemployee/:id',cors(),Controller.deleteEmployee)

module.exports = router