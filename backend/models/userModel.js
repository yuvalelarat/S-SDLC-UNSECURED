import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    userName: {
      type: "varchar",
      length: 255,
    },
    email: {
      type: "varchar",
      length: 255,
    },
    password: {
      type: "varchar",
      length: 255,
    },
    tempPass: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    passwordList: {
      type: "jsonb",
      nullable: true,
    },
    loginAttempts: {
      type: "int",
      default: 0,
    },
    loginTimeOut: {
      type: "timestamp",
      nullable: true,
    }
  },
});

export default User;
