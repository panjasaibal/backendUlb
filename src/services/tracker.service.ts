import { Tracker } from "@admin/model/tracker";
import { BadRequestError, ISupervisor, ITracker, IWorker, NotAuthorizedError, NotFoundError } from "@panjasaibal/backend_ulb_shared";
import { findSupervisorById } from "./supervisor.service";
import { findWorkerById } from "./worker.service";


type TrackerDoc = InstanceType<typeof Tracker>;


function toItracker(tracker:TrackerDoc):ITracker{ 
  return {
    _id: tracker._id.toString(),
    user_id: tracker.user_id.toString(),
    role: tracker.role,
    latitude: tracker!.latitude!,
    longitude: tracker!.longitude!,
    createdAt: tracker.createdAt,
  };
}


async function findTrackerById(track_id:string):Promise<ITracker> {
    const tracker = await Tracker.findById(track_id);
    if (!tracker) throw new NotFoundError("Tracker does not exists", "Tracker service findTrackerById() method");
    return toItracker(tracker);
}


type LocationOnly = Pick<ITracker, 'latitude'| 'longitude'>;


async function findCurrentTrackerByUser_id(u_id:string):Promise<ITracker> {
    const track = await Tracker.findOne({user_id: u_id}).sort({createdAt:-1});

    if(!track){
        throw new BadRequestError("dont have any cuurent tracking","tracker service findCurrentTrackerByUser_id()");
    }

    return toItracker(track);
}

// async function findTrackerByUser_idAndDateRange(u_id:string):Promise<Array[ITracker]> {
    
// }

async function updateLocationOnTracker(track_id:string,location:LocationOnly ):Promise<ITracker> {

    const updatedTrack = await Tracker.findByIdAndUpdate( track_id,{ $set: location} );
    if (!updatedTrack) throw new NotFoundError("Tracker does not exists", "Tracker service updateLocationOnTracker() method");
    return toItracker(updatedTrack!);
}



export { findCurrentTrackerByUser_id, findTrackerById, updateLocationOnTracker };