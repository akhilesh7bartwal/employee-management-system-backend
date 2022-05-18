const bcrypt = require('bcryptjs/dist/bcrypt')
//const jwt = require('jsonwebtoken')
const employeeModel = require('../model/Employee')

const Joi = require('@hapi/joi');

exports.showIndex = (req,res) =>{
    res.send("Running Node API")
}

exports.signUp =async (req,res) =>{

    const emailExist = await employeeModel.findOne({email:req.body.email})
    if(emailExist){
        res.status(400).send("Email exist");
        return;
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password,salt)

    const employee = new employeeModel({
        name:req.body.name,
        email:req.body.email,
        address:req.body.address,
        password:hashedPassword
    })
    try{
        const registrationSchema = Joi.object({
            name:Joi.string().min(3).required(),
            email: Joi.string().min(5).required().email(),
            address:Joi.string().min(3).required(),
            password: Joi.string().min(6).required()
        })
        const {error} =await registrationSchema.validateAsync(req.body)

        if(error){
            res.status(200).send(error.details[0].message)
            return;
        }
        else{
            const saveUser = await employee.save()
            res.send(saveUser)
            res.status(200).send("Employee created successfully.")
        }
    }
    catch(error){
        res.status(500).send(error)
    }

}

exports.signin = async (req,res) =>{
    const employee = await employeeModel.findOne({email:req.body.email})
    if(!employee){
        return res.status(400).send("Incorrect email.")
    }
    const validatePassword = await bcrypt.compare(req.body.password,employee.password)
    if(!validatePassword) {
        return res.status(400).send("INCOREECT password.")
    }
    try{
        const loginSchema = Joi.object({
            email:Joi.string().min(4).required().email(),
            password:Joi.string().min(5).required()
        })
        const {error} = await loginSchema.validateAsync(req.body)
        if(error) {
            return res.status(400).send(error.details[0].message)
        }
        else{
            res.send(employee);
             //   res.send("loggin successfully")
            //  const token = jwt.sign({_id:employee._id},process.env.TOKEN_SECRET)
            // //res.send(token)
            // res.header("auth-token",token).send(token)
        }
    }catch(error){
        res.status(500).send(error)
    }
}


// exports.getEmployees = async(req,res) =>{
//     const allEmp= await employeeModel.find()
//     try{
//         res.status(200).send(allEmp)
//     }
//     catch(error){
//         res.status(500).send(error)
//     }
// }



// exports.getEmployee = async (req,res) =>{
//     const getEmployee = await employeeModel.findOne({_id:req.params.id})
//     try {
//         res.status(200).send(getEmployee)
//     } catch (error) {
//         res.status(500).send(getEmployee)
//     }
// }


// exports.updateEmployee = async (req,res) =>{
//     await employeeModel.findById(req.params.id, (error, employee) =>{
//         if(error)
//             res.send(error)
//         employee.name = req.body.name ? req.body.name : employee.name
//         employee.email = req.body.email ? req.body.email : employee.email
//         employee.address = req.body.address ? req.body.address : employee.address
//         employee.save((error) =>{
//             if(error)
//                 res.send(error)
//             res.json({
//                 message: "employee item updated.",
//                 data: employee
//             })
//         })
//     })
// }

// exports.deleteEmployee =  (req,res) =>{
//      employeeModel.deleteOne({
//         _id:req.params.id
//     },(error) =>{
//         if(error)
//             res.send(error)

//     })
//     res.json({
//         status: "Success",
//         message: "Successfully deleted."
//     })

// }
