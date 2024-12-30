import supertest from "supertest";
import { web } from "../src/application/web.js";
import { prismaClient } from "../src/application/database.js";
import { logger } from "../src/application/logging.js";

describe("Test API Register", function () {

    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where: {
                username: "royandhk"
            }
        });
    });

    // Test case 1: Berhasil register
    it("Should be able to register new user", async () => {
        const result = await supertest(web)
            .post("/api/auth/register")
            .send({
                username: "royandhk",
                password: "sungaK22x",
                email: "satriaroy70@gmail.com",
            });
        
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("royandhk");
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.email).toBeUndefined();
        expect(result.body.data.password).toBeUndefined();
    });

    // Test case 2: Salah input
    it("Should not be able to register new user", async () => {
        const result = await supertest(web)
            .post("/api/auth/register")
            .send({
                username: "",
                password: "",
                email: "",
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    // Test case 3: Username sudah ada
    it("Should not be able to register exist username", async () => {
        let result = await supertest(web)
            .post("/api/auth/register")
            .send({
                username: "royandhk",
                password: "sungaK22x",
                email: "satriaroy70@gmail.com",
            });
        
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("royandhk");

        result = await supertest(web)
            .post("/api/auth/register")
            .send({
                username: "royandhk",
                password: "sungaK22s",
                email: "satriaroy75@gmail.com",
            });
        
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

})