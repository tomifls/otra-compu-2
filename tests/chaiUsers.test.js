import mongoose from "mongoose";
import Users from "../src/dao/Users.dao.js";
import chai from "chai";

mongoose.connect("mongodb+srv://tomas:pino2@backend2.zjror.mongodb.net/backend3?retryWrites=true&w=majority&appName=backend2")

const expect = chai.expect;

describe("Chai Test", () => {
    before(function () {
        this.users = new Users()
    })

    beforeEach(function () {
        mongoose.connection.collections.users.drop()
        this.timeout(5000)
    })

    it("El DAO debe poder obtener los usuarios en formato de arreglo", async function () {
        const users = await this.users.get();
        expect(users).to.be.an('array')
    })

    it("El DAO debe agregar correctamente un elemento a la base de datos", async function () {
        const user = {
            first_name: "Test",
            last_name: "User",
            email: "test@gmail.com",
            password: "test123",
        }
        const result = await this.users.save(user)
        expect(result._id).to.have.property('_id')
        expect(result.first_name).to.equal(user.first_name)
        expect(result.last_name).to.equal(user.last_name)
        expect(result.email).to.equal(user.email)
    })

    it("El DAO debe poder actualizar un usuario correctamente", async function () {
        const user = {
            first_name: "Test",
            last_name: "User",
            email: "test2@gmail.com",
            password: "test123",
        }
        const userSaved = await this.users.save(user)
        const updatedUser = {
            first_name: "Updated"
        }
        const result = await this.users.update(userSaved._id, updatedUser);
        expect(result).to.have.property('_id')
        expect(result.first_name).to.equal(updatedUser.first_name)
    })
});