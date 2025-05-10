import { validateEmail } from "../utils/validateEmail.js";
import { decodeToken } from "../utils/JWTutils.js";
import { createClientService, getAllClientsService } from "../services/clientsService.js";
export async function getAllClients(req, res) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const decodedToken = decodeToken(token);

        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        const result = await getAllClientsService();
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

export async function createClient(req, res) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const decodedToken = decodeToken(token);

        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        const { name, email, phoneNumber } = req.body;

        if (!name || !email || !phoneNumber) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const isEmailOk = validateEmail(email);
        if (!isEmailOk) {
            return res.status(400).json({ message: "Email is not valid." });
        }

        const result = await createClientService(req.body);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}