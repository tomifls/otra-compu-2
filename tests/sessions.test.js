import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de sessions", () => {
    const cookie = {
        name: "",
        value: ""
    }

    it("Debe registrar correctamente un usuario", async () => {
        const response = await requester.post("/api/sessions/register").send({
            first_name: "Juan",
            last_name: "Pérez",
            email: "juanperez7@gmail.com",
            password: "123456",
        });
        expect(response.statusCode).to.equal(201);
        expect(response.ok).to.equal(true);
        expect(response.body.status).to.equal("success");
    })

    it("Debe iniciar sesión correctamente", async () => {
        const response = await requester.post("/api/sessions/login").send({
            email: "juanperez7@gmail.com",
            password: "123456",
        })

        const resultCookie = response.headers["set-cookie"][0];
        cookie.name = resultCookie.split("=")[0];
        cookie.value = resultCookie.split("=")[1];

        expect(response.statusCode).to.equal(200);
        expect(response.ok).to.equal(true);
        expect(response.body.status).to.equal("success");
        expect(cookie.name).to.equal("coderCookie");
    })

    it("Debe obtener el usuario actual", async () => {
        const response = await requester.get("/api/sessions/current").set("Cookie", [cookie.name + "=" + cookie.value]);
        expect(response.statusCode).to.equal(200);
        expect(response.ok).to.equal(true);
        expect(response.body.status).to.equal("success");
    })

});