import type { NextApiRequest, NextApiResponse } from "next";

import itemTypeModel from "@/models/item-type.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      getItemTypes(req, res);
      break;
    default:
      return res.status(405).json({
        error: { message: `Method ${req.method} not allowed` }
      });
  }
}

const getItemTypes = async (req: NextApiRequest, res: NextApiResponse) => {
  const itemtypes = await itemTypeModel.getAll();
  return res.status(200).json(itemtypes);
};

export const config = {};