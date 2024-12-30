import supertest from "supertest";
import { web } from "../src/application/web.js";
import { prismaClient } from "../src/application/database.js";
import { logger } from "../src/application/logging.js";

describe("Test API Login", function () {

    afterEach(async () => {
        await prismaClient.token.deleteMany({
            where: {
                username: "royandhk"
            }
        });
        await prismaClient.user.deleteMany({
            where: {
                username: "royandhk"
            }
        });
    });

    // Test case 1: Berhasil login
    it("Should be able to login user", async () => {
        let result = await supertest(web)
            .post("/api/auth/register")
            .send({
                username: "royandhk",
                password: "ih24IHF-s",
                email: "satriaroy70@gmail.com",
            });
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("royandhk");
        
        result = await supertest(web)
        .post("/api/auth/login")
        .send({
            username: "royandhk",
            password: "ih24IHF-s",
        });
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("royandhk");
        
    });
    
    // Test case 2: Username salah
    it("Should not be able to login", async () => {
        let result = await supertest(web)
            .post("/api/auth/login")
            .send({
                username: "royandhks",
                password: "testwrong1",
            });
        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    
    });

})
