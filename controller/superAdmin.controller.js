
const {validationResult } = require("express-validator");
const SuperAdmin = require("../model/superadmin.model");
const Adminstration = require("../model/adminstration");

const createSuperAdmin = async(req,res)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let superAdminUser = await SuperAdmin.findOne({
        name: req.body.username,
      });
      if (superAdminUser) {
        return res.status(400).json({ error: "admin already exists" });
      }
      superAdminUser = await SuperAdmin.create({
        username: req.body.username,
        password: req.body.password,
      });

      const data = { superAdminUser: { id: superAdminUser._id } };
      res.json(data);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
}




module.exports = {createSuperAdmin}