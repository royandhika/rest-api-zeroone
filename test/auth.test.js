import supertest from "supertest";
import { web } from "../src/application/web.js";
import { prismaClient } from "../src/application/database.js";

describe("Test API Register", function () {

    afterAll(async () => {
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


    // Test case 1: Berhasil register
    it("Should be able to register new user", async () => {
        const response = await supertest(web)
            .post("/api/auth/register")
            .send({
                username: "royandhk",
                password: "sungaK22x",
                email: "satriaroy70@gmail.com",
            });
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("royandhk");
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.email).toBeUndefined();
        expect(response.body.data.password).toBeUndefined();
    });


    // Test case 2: Salah input
    it("Should not be able to register; wrong input", async () => {
        const response = await supertest(web)
            .post("/api/auth/register")
            .send({
                username: "",
                password: "",
                email: "",
            });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });


    // Test case 3: Username sudah ada
    it("Should not be able to register; username already exists", async () => {
        let response = await supertest(web)
            .post("/api/auth/register")
            .send({
                username: "royandhk",
                password: "sungaK22x",
                email: "satriaroy75@gmail.com",
            });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });


    // Test case 4: Email sudah ada
    it("Should not be able to register; email already exists", async () => {
        let response = await supertest(web)
            .post("/api/auth/register")
            .send({
                username: "royandhiko",
                password: "sungaK22x",
                email: "satriaroy70@gmail.com",
            });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });


    // Test case 5: Berhasil login
    it("Should be able to login user", async () => {
        const response = await supertest(web)
            .post("/api/auth/login")
            .send({
                username: "royandhk",
                password: "sungaK22x",
            });
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("royandhk");
        expect(response.headers['set-cookie'][0]).toContain('refreshToken='); 
    });


    // Test case 6: Password salah
    it("Should not be able to login; wrong password", async () => {
        const response = await supertest(web)
            .post("/api/auth/login")
            .send({
                username: "royandhk",
                password: "testwrong1",
            });
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });


    // Test case 7: Username salah
    it("Should not be able to login; wrong username", async () => {
        const response = await supertest(web)
            .post("/api/auth/login")
            .send({
                username: "royandhiko",
                password: "sungaK22x",
            });
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });


    // Test case 8: Berhasil refresh access token
    it("Should be able to refresh token", async () => {
        let response = await supertest(web)
            .post("/api/auth/login")
            .send({
                username: "royandhk",
                password: "sungaK22x",
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
    
    
    // Test case 9: Berhasil login dan logout
    it("Should be able to logout", async () => {
        let response = await supertest(web)
            .post("/api/auth/login")
            .send({
                username: "royandhk",
                password: "sungaK22x",
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
