const { validationResult } = require("express-validator");
const Supervisor = require("../model/supervisor.model");
const Duty = require("../model/duty");
const asyncHandler = require("../util/asyncHandler");
const ApiError = require("../util/ApiError");
const Worker = require("../model/workers");
const { uploadOnCloudinary } = require("../util/cloudinary");
const ApiResponse = require("../util/ApiResponse");

exports.loginSupervisor = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400,"Validation failed",errors.array);
  }

    let supervisor = await Supervisor.findOne({ phone: req.body.phone }).select(
      "-admin"
    );
    if (supervisor === null) {
        throw new ApiError(400,"Supervisor not found");
     // return res.status(400).json({ error: "Supervisor not found" });
    }
  
    return res.status(200).json(new ApiResponse(200, supervisor,"Login sucessfull", true));

});

exports.getDuty = asyncHandler(async (req, res) => {
  const duty = await Duty.findById(req.params.id);
  if (!duty) {
    throw new ApiError(404, "Not Found");
    //return res.status(404).json({message:"Not Found", success:"false"});
  }
  return res.status(200).json(new ApiResponse(200, duty, true));
});

//http://localhost:5000/search?q=$searchTerm
exports.getAllWorkersForSupervisor = asyncHandler(async (req, res) => {
    //fetch supervisor through middlerware
    const workers = await Worker.find({ supervisor: req.params.supervisor });
    if (workers.length === 0) {
      return res.status(404).json({ message: "No Workers assigned to you!!" });
    }
    return res
      .status(200)
      .json(new ApiResponse(200, workers, `${workers.length}`, true));
});

// returns last 7 records
exports.getDutyBySupervisor = asyncHandler(async (req, res) => {
  //fetch supervisor through middlerware

  const duties = await Duty.find({ supervisor: req.body.supervisor })
    .sort({ _id: -1 })
    .limit(7);
  if (duties.length === 0) {
    throw new ApiError(404,"No records !!");
    //return res.status(404).json({ message: "No records !!" });
  }
  return res
    .status(200)
    .json(new ApiResponse(200, duties, `${duties.length}`, true));
});

exports.genarateDuty = async(req,res)=>{
  try{
   const { duty_name, description, place, supervisor, workers } = req.body;
   
    const existedSupervisor = await Supervisor.findById(supervisor);
    if(!existedSupervisor){
      throw new ApiError(404,"Supervisor does not exist");
    }
      const imageLocalPath = req.file.path;
      if(!imageLocalPath){
        throw new ApiError(400,"Image is required")
      }
     const dutyImage = await uploadOnCloudinary(imageLocalPath);

      const newDuty = await Duty.create({
        duty_name,description,place,supervisor,workers,image:dutyImage.url
      });

      console.log(imageLocalPath)
      return res.status(200).json(new ApiResponse(200, newDuty, `Duty created with id:${newDuty._id}`, true));
 
  }catch(e){
    console.log(e)
  }
}
