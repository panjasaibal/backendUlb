import { Tracker } from "@admin/model/tracker";
import { ISupervisor, ITracker, IWorker, NotAuthorizedError } from "@panjasaibal/backend_ulb_shared";
import { Worker } from '@admin/model/workers';
import { findSupervisorById } from "./supervisor.service";
import { findWorkerById } from "./worker.service";


async function createTracker(trackerBody:ITracker):Promise<String>{
   
    const {user_id, role} = trackerBody;
    if(!(role === "Supervisor" || role === "Worker")) throw new NotAuthorizedError("Tracker cannot be created dur to unasigned role","tracker service createTracker() method");
    let user: ISupervisor | IWorker = role === "Supervisor"?await findSupervisorById(user_id):await findWorkerById(user_id);
    
    //validation

    const newTracker = await Tracker.create(trackerBody);
    return newTracker._id.toString();
}






export { createTracker };