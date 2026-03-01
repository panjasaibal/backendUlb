const { validationResult } = require("express-validator");
const Adminstration = require("../model/adminstration");
const Worker = require("../model/workers");
const Tracker = require("../model/tracker");
const Duty = require("../model/duty");
const Supervisor = require("../model/supervisor.model");
const ApiResponse = require("../util/ApiResponse");
const { uploadOnCloudinary } = require("../util/cloudinary");
const asyncHandler = require("../util/asyncHandler");
const ApiError = require("../util/ApiError");

exports.adminLogin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let adminUser = await Adminstration.findOne({ email: req.body.email });
  if (adminUser === null || adminUser.passwd !== req.body.passwd) {
    return res
      .status(400)
      .json({ error: "Incorrect email or password", success: false });
  }
  const data = {
    id: adminUser._id.toString(),
    name: adminUser.name,
    access: adminUser.access,
    email: adminUser.email,
  };
  res.json({ result: data });
});

exports.addWorker = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let worker = await Worker.findOne({ phone: req.body.phone });
  if (worker) {
    return res.status(400).json({
      error: "user already exists with this phone number",
      success: false,
    });
  }
  worker = await Worker.create({
    admin: req.body.admin,
    supervisor: req.body.supervisor,
    name: req.body.name,
    phone: req.body.phone,
  });

  const data = { id: worker._id, success: true };
  res.json(data);
});

exports.addSupervisor = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let supervisor = await Supervisor.findOne({ phone: req.body.phone });
  if (supervisor) {
    return res.status(400).json({
      error: "user already exists with this phone number",
      success: false,
    });
  }
  supervisor = await Supervisor.create({
    admin: req.body.admin,
    name: req.body.name,
    phone: req.body.phone,
  });

  const imageLocalPath = req.file.path;
  
  if (imageLocalPath) {
    const supervisorProfileUrl = await uploadOnCloudinary(imageLocalPath);
    await updateProfileImage(supervisor, supervisorProfileUrl);
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        supervisor._id,
        "Supervisor created successfully.",
        true
      )
    );
});

exports.getAllWorker = asyncHandler(async (req, res) => {
  let workers = await Worker.find({ admin: req.params.admin });
  if (!workers) {
    return res.status(204).json({ message: "no wrokers present" });
  }
  return res.status(200).json(new ApiResponse(200, workers, null, true));
});

exports.updateProfileOfSupervisor = asyncHandler(async(req, res)=>{
  const supervisor = await Supervisor.findById(req.params.id);
  if(supervisor == null){
      throw new ApiError(400,"Supervisor does not exist with this id", null, null);
  }

  const imageLocalPath = req.files?.supervisor_image[0].path;
  
  if (!imageLocalPath) {
    throw new ApiError(400, "image required", null, null);
  }
  const supervisorProfileUrl = await uploadOnCloudinary(imageLocalPath);
  await updateProfileImage(supervisor, supervisorProfileUrl);
  return res.status(200).json(new ApiResponse(200,"Updated Successfully", null, null))

});

exports.getAllSuperVisor = asyncHandler(async(req,res)=>{
  let supervisors = await Supervisor.find({ admin: req.params.admin });
  if (!supervisors) {
    throw new ApiResponse(400,"no supervisors present", false);
    
  }if(supervisors.length == 0){
    throw new ApiError(400,"No Supervisor present", null, false);
  }
  
  return res.status(200).json(new ApiResponse(200, supervisors, supervisors.length, true));
});

exports.getWorkerByPhone = asyncHandler(async (req, res) => {
  const phoneNumber = req.params.phone;
  if (phoneNumber.length !== 10) {
    return res
      .status(400)
      .json({ errors: "Phone number should have 10 charecters" });
  }
    const worker = await Worker.findOne({ phone: phoneNumber });
    if (worker === null) {
      return res
        .status(400)
        .json({ errors: "Phone number should have 10 charecters" });
    }
    res.json(worker);
  });

exports.getSupervisorByPhone = asyncHandler(async(req,res)=>{
  const phoneNumber = req.params.phone;
  if (phoneNumber.length !== 10) {
    throw new ApiError(500,"Phone number should be 10 digit");
  }
    const supervisor = await Supervisor.findOne({ phone: phoneNumber });
    if (supervisor === null) {
      throw new ApiError(404,"Not Found!!");
    }
    return res.status(200).json(new ApiResponse(200, supervisor, null,true));
});

exports.getLatestTracksOfWorkerByAdminId = asyncHandler(async (req, res) => {
 
    let admin = await Adminstration.findById(req.params.adminId).select(
      "-superadmin"
    );
    if (!admin) {
      return res.status(500).json({ error: "Bad request" });
    }
    let workers = await Worker.find({ admin: req.params.adminId });
    let tracks = [];
    const date = new Date().toLocaleDateString();
    console.log(date);
    for (let worker of workers) {
      let track = await Tracker.findOne({
        user_id: worker._id.toString(),
        model:'workers',
        date: date,
      }).sort({ _id: -1 });
      if(track){
        tracks.push(track);
      }
    }
    //console.log(workers)
    res.json(tracks);
  });

exports.getDutyBySupervisor = asyncHandler(async (req, res) => {
  const { supervisor, date } = req.body;

    const duty = await Duty.find({ supervisor: supervisor, date: date });
    if (duty == null) {
      return res.status(400).json("No such duties");
    }
    const data = { data: duty, success: true };
    return res.status(200).json(new ApiResponse(200, data, null, true));
  });


  exports.getLatestTracksOfSupervisorByAdminId = asyncHandler(async (req, res) => {
 
    let admin = await Adminstration.findById(req.params.adminId).select(
      "-superadmin"
    );
    if (!admin) {
      return res.status(500).json({ error: "Bad request" });
    }
    let supervisors = await Supervisor.find({ admin: req.params.adminId }).select("-admin");
    let tracks = [];
    const date = new Date().toLocaleDateString();
    console.log(date);
    for (let supervisor of supervisors) {
      let track = await Tracker.findOne({
        user_id: supervisor._id.toString(),
        model:'supervisor',
        date: date,
      }).sort({ _id: -1 });
      if(track){
        tracks.push(track);
      }
    }
    res.status(200).json(new ApiResponse(200,tracks,tracks.length(),true));
  });

exports.deleteWorkerById = asyncHandler(async (req, res) => {

    let worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ mesasge: "Nor Found" });
    }

    if (req.params.adminId !== worker.admin.toString()) {
      return res.status(401).json({ mesasge: "No Access" });
    }
    worker = await Worker.findByIdAndDelete(req.params.id);
    console.log("deleted");
    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Worker has been deleted successfully", true)
      );
  });

exports.deleteSupervisorById = asyncHandler(async (req, res) => {

  let admin = await Adminstration.findById(req.params.adminId).select(
    "-superadmin"
  );

  if (!admin) {
    throw new ApiError(404, "Admin does not exist");
  }

    let supervisor = await Supervisor.findById(req.params.supervisor);
    if (!supervisor) {
      throw new ApiError(404,"Supervisor not found");
    }

    if (req.params.adminId !== supervisor.admin.toString()) {
      throw new ApiError(401,"No Access");
    }
    supervisor = await Supervisor.findByIdAndDelete(req.params.id);
    console.log("deleted");
    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Supervisor has been deleted successfully", true)
      );
  });

const updateProfileImage = async(supervisor, supervisorProfileUrl)=>{
  await Supervisor.findByIdAndUpdate(
    supervisor._id,
    { $set: { profile: supervisorProfileUrl.url } },
    { new: true }
  )};
