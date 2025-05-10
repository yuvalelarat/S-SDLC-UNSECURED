import { EntitySchema } from "typeorm";

const Client = new EntitySchema({
    name: "Client",
    tableName: "client",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            length: 255,
        },
        email: {
            type: "varchar",
            length: 255,
            unique: true,
        },
        phoneNumber: {
            type: "varchar",
            length: 255,
        },
    },
});

export default Client;
