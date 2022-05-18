const bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

const adminModel = require("../model/Admin");
const employeeModel = require("../model/Employee");

exports.adminSignup = async (req, res) => {
  const emailExist = await adminModel.findOne({ email: req.body.email });
  if (emailExist) {
    res.send("Email Already Exist");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  try {
    const signupSchema = Joi.object({
      name: Joi.string().min(3).required(),
      address: Joi.string().min(3).required(),
      email: Joi.string().min(6).required().email(),
      password: Joi.string().min(4).required(),
    });

    const { error } = await signupSchema.validateAsync(req.body);

    if (error) {
      res.send(error.details[0].message);
    } else {
      const admin = new adminModel({
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        password: hashedPassword,
      });

      const saveAdmin = await admin.save();
      res.send("Admin Signup Successfully.");
    }
  } catch (error) {
    res.send(error);
  }
};

exports.adminSignin = async (req, res) => {
  const admin = await adminModel.findOne({ email: req.body.email });

  if (!admin) return res.send("Incorrect email.");

  const validatePassword = await bcrypt.compare(
    req.body.password,
    admin.password
  );

  if (!validatePassword) return res.send("Incorrect password");

  try {
    const signinSchema = Joi.object({
      email: Joi.string().min(6).required().email(),
      password: Joi.string().min(4).required(),
    });

    const { error } = await signinSchema.validateAsync(req.body);

    if (error) return res.send(error.details[0].message);
    else {
      const token = jwt.sign({ _id: admin._id }, process.env.TOKEN_SECRET);
      res.send({ token: token, admin: admin });
    }
  } catch (error) {
    res.send(error);
  }
};

exports.getEmployees = async(req,res) =>{
    const allEmp= await employeeModel.find()
    try{
        res.status(200).send(allEmp)
    }
    catch(error){
        res.status(500).send(error)
    }
}

exports.deleteEmployee = (req, res) => {
  employeeModel.deleteOne({ _id: req.params.id }, (error) => {
    if (error) {
      res.send(error);
    } else {
      res.send("Deleted successfully.");
    }
  });
};

exports.editEmployee = (req, res) => {
  employeeModel.findOne({ _id: req.params.id }, (error, employee) => {
    if (error) {
      res.send(error);
    } else {
      employee.name = req.body.name? req.body.name: employee.name;
      employee.address = req.body.address? req.body.address: employee.address;
      employee.save((error) => {
        if (error) {
          res.send(error);
        } else {
          res.send("Edited successfully.");
        }
      });
    }
  });
};

exports.addEmployee = async (req, res) => {
  const emailExist = await employeeModel.findOne({ email: req.body.email });
  if (emailExist) {
    res.send("Email Already Exist");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  try {
    const signupSchema = Joi.object({
      name: Joi.string().min(3).required(),
      address: Joi.string().min(3).required(),
      email: Joi.string().min(4).required().email(),
      password: Joi.string().min(4).required(),
    });

    const { error } = await signupSchema.validateAsync(req.body);

    if (error) {
      res.send(error.details[0].message);
    } else {
      const employee = new employeeModel({
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        password: hashedPassword,
      });

      const saveEmployee = await employee.save();
      res.send("Employee Signup Completed");
    }
  } catch (error) {
    res.send(error);
  }
};