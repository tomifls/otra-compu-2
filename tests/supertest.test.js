import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test adoptme", () => {
    describe("Test pets", () => {
        it("Debe crear un nuevo pet", async () => {
            const response = await requester.post("/api/pets").send({
                name: "Firulais",
                specie: "Perro",
                birthDate: "2020-01-01"
            });
            expect(response.statusCode).to.equal(201);
            expect(response.ok).to.equal(true);
            expect(response.body.payload).to.have.property("_id");
            expect(response.body.payload.name).to.equal("Firulais");
            expect(response.body.payload.specie).to.equal("Perro");
            expect(response.body.payload.adopted).to.equal(false);  
        });
        
        it("Una mascota sin el campo nombre, el modulo debe responder con un status 400", async () => {
            const response = await requester.post("/api/pets").send({
                specie: "Perro",
                birthDate: "2020-01-01"
            });
            expect(response.statusCode).to.equal(400);
            expect(response.ok).to.equal(false);
        })

        it("Debe obtener todas las mascotas", async () => {
            const response = await requester.get("/api/pets");
            expect(response.statusCode).to.equal(200);
            expect(response.ok).to.equal(true);
            expect(response.body).to.have.property("status");
            expect(response.body).to.have.property("payload");
        });

        it("Debe actualizar una mascota", async () => {
            const response = await requester.post("/api/pets").send({
                name: "Max",
                specie: "Perro",
                birthDate: "2020-01-01"
            });
            const petId = response.body.payload._id;
            const responseUpdate = await requester.patch(`/api/pets/${petId}`).send({
                name: "Maximo",
            });
            expect(responseUpdate.statusCode).to.equal(200);
            expect(responseUpdate.ok).to.equal(true);
            expect(responseUpdate.body.payload.name).to.equal("Maximo");
        });

        it("Debe eliminar una mascota", async () => {
            const response = await requester.post("/api/pets").send({
                name: "Rocco",
                specie: "Perro",
                birthDate: "2020-01-01"
            });
            const petId = response.body.payload._id;
            const responseDelete = await requester.delete(`/api/pets/${petId}`);
            expect(responseDelete.statusCode).to.equal(200);
            expect(responseDelete.ok).to.equal(true);
            expect(responseDelete.body.message).to.equal("pet deleted");
            const responseGet = await requester.get(`/api/pets/${petId}`);
            expect(responseGet.statusCode).to.equal(404);
            expect(responseGet.ok).to.equal(false);
        });

        it("Debe creaer una mascota con imagen", async () => {
            const response = await requester.post("/api/pets/withimage")
            .field("name", "Firulais")
            .field("specie", "Perro")
            .field("birthDate", "2020-01-01")
            .attach("image", "./tests/assets/pic.jpg");

            expect(response.statusCode).to.equal(201);
            expect(response.ok).to.equal(true);
            expect(response.body.payload).to.have.property("_id");
        })
    });
})