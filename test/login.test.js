import supertest from "supertest";
import { web } from "../src/application/web.js";
import { prismaClient } from "../src/application/database.js";

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
        let response = await supertest(web)
            .post("/api/auth/register")
            .send({
                username: "royandhk",
                password: "ih24IHF-s",
                email: "satriaroy70@gmail.com",
            });
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("royandhk");
        
        response = await supertest(web)
            .post("/api/auth/login")
            .send({
                username: "royandhk",
                password: "ih24IHF-s",
            });
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("royandhk");
        // Verifikasi bahwa cookie dikirim kembali oleh server  
        expect(response.headers['set-cookie'][0]).toContain('refreshToken='); 
    });
    
    // Test case 2: Username salah
    it("Should not be able to login", async () => {
        let response = await supertest(web)
            .post("/api/auth/login")
            .send({
                username: "royandhks",
                password: "testwrong1",
            });
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

})
