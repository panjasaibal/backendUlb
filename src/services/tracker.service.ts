import { Tracker } from "@admin/model/tracker";
import { ISupervisor, ITracker, IWorker, NotAuthorizedError, NotFoundError } from "@panjasaibal/backend_ulb_shared";
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


async function createTracker(trackerBody:ITracker):Promise<String>{
   
    const {user_id, role} = trackerBody;
    if(!(role === "Supervisor" || role === "Worker")) throw new NotAuthorizedError("Tracker cannot be created dur to unasigned role","tracker service createTracker() method");
    let user: ISupervisor | IWorker = role === "Supervisor"?await findSupervisorById(user_id):await findWorkerById(user_id);
    if(!user){
        throw new NotAuthorizedError("Unauthorized", "tracker service createTracker() method");
    }
    //validation

    const newTracker = await Tracker.create(trackerBody);
    return newTracker._id.toString();
}


async function findTrackerById(track_id:string):Promise<ITracker> {
    const tracker = await Tracker.findById(track_id);
    if (!tracker) throw new NotFoundError("Tracker does not exists", "Tracker service findTrackerById() method");
    return toItracker(tracker);
}


type LocationOnly = Pick<ITracker, 'latitude'| 'longitude'>;


async function updateLocationOnTracker(track_id:string,location:LocationOnly ):Promise<ITracker> {

    const updatedTrack = await Tracker.findByIdAndUpdate( track_id,{ $set: location} );
    if (!updatedTrack) throw new NotFoundError("Tracker does not exists", "Tracker service updateLocationOnTracker() method");
    return toItracker(updatedTrack!);
}



export { createTracker, findTrackerById, updateLocationOnTracker };