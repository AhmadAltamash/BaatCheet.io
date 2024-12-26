import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getContactsForDMList, searchContacts } from "../controllers/ContactController.js";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDMList)
contactsRoutes.get("/get-all-con")

export default contactsRoutes;