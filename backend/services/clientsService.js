import { AppDataSource } from "../config/data-source.js";
import Client from "../models/clientModels.js";

export async function createClientService(clientData) {
    const { name, email, phoneNumber } = clientData;
    try {
        const clientRepository = AppDataSource.getRepository(Client);

        const nonUniqueEmailQuery = `SELECT * FROM public.client
                WHERE "email" = '${email}'`;

        const uniqueEmailCheck = await clientRepository.query(nonUniqueEmailQuery);
        if (uniqueEmailCheck.length > 0) {
            return { status: 400, message: "Client already exists" };
        }

        const newClient = clientRepository.create({
            name,
            email,
            phoneNumber,
        });

        await clientRepository.save(newClient);

        return { status: 201, message: "Client created successfully", client: newClient };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}


export async function getAllClientsService() {
    try {
        const clientRepository = AppDataSource.getRepository(Client);
        const clients = await clientRepository.find();
        return { status: 200, message: "Clients retrieved successfully", clients };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}