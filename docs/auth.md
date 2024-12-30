# API Auth Documentation

## Base URL

```
http://masih-di-localhost.com
```

## Endpoints
### **1. Register User**

- **Endpoint** 
    ```
    POST /api/auth/register
    ``` 

- **Description**   
    Mendaftarkan username baru ke sistem

- **Request Body** 
    ```json
    {
        "username": "string",
        "email": "string",
        "password": "string"
    }
    ```

- **Response** 
    - Success **(200 OK)** 
        ```json
        {
            "data": {
                "id": "string",
                "username": "string"
            }
        }
        ```

    - Error **(400 Bad Request)**  
        ```json
        {
            "error": "Username already exist",
        }
        ```
        ```json
        {
            "error": "Account with the same email already registered"
        }
        ```

### **2. Login User**

- **Endpoint** 
    ```
    POST /api/auth/login
    ``` 

- **Description**   
    Login dengan username dan password

- **Request Body**  
    ```json
    {
        "username": "string",
        "password": "string"
    }
    ```

- **Response** 
    - Success **(200 OK)** 
        ```json
        {
            "data": {
                "username": "string"
            },
            "accessToken": "string"
        }
        ```
    
    - Error **(401 Unauthorized)** 
        ```json
        {
            "error": "Username or password wrong"
        }
        ```

### **3. Refresh Token**

- **Endpoint** 
    ```
    POST /api/auth/refresh
    ``` 

- **Description**   
    Pembaharuan access token

- **Cookies**    
    **refreshToken :** dibutuhkan untuk refresh access token (string) 

- **Response** 
    - Success **(200 OK)** 
        ```json
        {
            "data" {
                "username": "string"
            },
            "accessToken": "string"
        }
        ```

    - Error **(401 Unauthorized)** 
        ```json
        {
            "error": "Refresh token is not valid"
        }
        ```

### **4. Logout User**

- **Endpoint** 
    ```
    POST /api/auth/logout
    ```

- **Description**   
    Logout user dari sistem

- **Cookies**   
    **refreshToken :** dibutuhkan untuk logout (string) 

- **Authorization**   
    **accessToken :** dibutuhkan untuk logout (string)

- **Response** 
    - Success **(200 OK)** 
        ```json
        {
            "message": "Logout success" 
        }
        ```
    
    - Error **(401 Unauthorized)** 
        ```json
        {
            "error": "Unauthorized"
        }
        ```