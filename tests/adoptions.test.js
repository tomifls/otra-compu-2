import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test Adoptions", () => {
    
    beforeEach(async function () {
        const timestamp = Date.now();
        const email = `test_${timestamp}@mail.com`;
    
        const userResponse = await requester.post("/api/sessions/register").send({
            first_name: "Juan",
            last_name: "Pérez",
            email,
            password: "123456",
        });
        this.userId = userResponse.body.payload;
    
        const petResponse = await requester.post("/api/pets").send({
            name: `max_${timestamp}`,
            specie: "dog",
            birthDate: "2020-01-01",
        });
        this.petId = petResponse.body.payload._id;
    });
    
    afterEach(async function () {
        if (this.userId) {
            await requester.delete(`/api/users/${this.userId}`);
        }
        if (this.petId) {
            await requester.delete(`/api/pets/${this.petId}`);
        }
    });

    it("Debe crear una adopción", async function () {
        const response = await requester.post(`/api/adoptions/${this.userId}/${this.petId}`);
        expect(response.statusCode).to.equal(201);
        expect(response.body.status).to.equal("success");
        expect(response.body.message).to.equal("Pet adopted");
    });

    it("Debe obtener todas las adopciones", async function () {
        await requester.post(`/api/adoptions/${this.userId}/${this.petId}`);
    
        const response = await requester.get("/api/adoptions");
        
        expect(response.statusCode).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.payload).to.be.an("array");
        expect(response.body.payload.length).to.be.greaterThan(0);
    });

    it("Debe obtener una adopción específica por ID", async function () {
        await requester.post(`/api/adoptions/${this.userId}/${this.petId}`);
    
        const allAdoptions = await requester.get("/api/adoptions");
        const adoptionId = allAdoptions.body.payload[0]._id;
    
        const response = await requester.get(`/api/adoptions/${adoptionId}`);
    
        expect(response.statusCode).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.payload).to.be.an("object");
        expect(response.body.payload._id).to.equal(adoptionId);
    });
    
});
