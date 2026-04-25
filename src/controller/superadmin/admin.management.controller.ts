
import { ApiResponse } from "@panjasaibal/backend_ulb_shared";
import { Request, Response } from "express";

type AdminParams = {
  id: string;
};

// export async function revokeAdminAccess(
//   req: Request<AdminParams>,
//   res: Response,
// ) {
//   const admin = await revokeAdminAccessById(req.params.id);

//   return res.status(200).json(
//     new ApiResponse(200, admin, "Admin access revoked successfully", true),
//   );
// }

// export async function deleteAdmin(
//   req: Request<AdminParams>,
//   res: Response,
// ) {
//   const admin = await deleteAdminById(req.params.id);

//   return res.status(200).json(
//     new ApiResponse(200, admin, "Admin deleted successfully", true),
//   );
// }

// export async function getAdminSubscriptionStatus(
//   req: Request<AdminParams>,
//   res: Response,
// ) {
//   const subscriptionStatus = await getAdminSubscriptionStatusById(req.params.id);

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       subscriptionStatus,
//       "Admin subscription status fetched successfully",
//       true,
//     ),
//   );
// }
