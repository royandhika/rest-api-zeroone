import supertest from "supertest";
import { web } from "../src/application/web.js";
import { prismaClient } from "../src/application/database.js";

describe("Test API Refresh & Logout", function () {

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

    // Test case 1: Berhasil refresh access token
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

        // Ambil token dari cookie
        const refreshToken = response.headers["set-cookie"]
            .map(cookie => cookie.split(';')) 
            .flat() 
            .find(cookie => cookie.trim().startsWith('refreshToken=')) 
        
        response = await supertest(web)
            .post("/api/auth/refresh")
            .set("Cookie", refreshToken);
        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        
    });
    
    
    // Test case 2: Berhasil login dan logout
    it("Should be able to login and logout", async () => {
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

        // Ambil token dari cookie dan body
        const refreshToken = response.headers["set-cookie"]
            .map(cookie => cookie.split(';')) 
            .flat() 
            .find(cookie => cookie.trim().startsWith('refreshToken=')) 
        const accessToken = `Bearer ${response.body.data.accessToken}`
        
        response = await supertest(web)
            .post("/api/auth/logout")
            .set("Cookie", refreshToken)
            .set("Authorization", accessToken);
        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined;
    });

})
