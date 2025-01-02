# API Auth Documentation

## Base URL

```
http://masih-di-localhost.com
```

## Endpoints
### **1. Register User**

- **Endpoint** 
    ```js
    POST /api/users
    ``` 

- **Request Body** 
    ```json
    {
        "username": "string",
        "email": "string",
        "password": "string",
        "phone": "string" // optional
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
            "errors": "Username or email already exist",
        }
        ```

### **2. Login User**

- **Endpoint** 
    ```js
    POST /api/sessions
    ``` 

- **Request Header**
    - **user-agent**  
    - **ip-address**

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
                "user_id": "string",
                "accessToken": "string"
            }
        }
        ```
    
    - Error **(401 Unauthorized)** 
        ```json
        {
            "errors": "Username or password wrong"
        }
        ```

### **3. Refresh Token**

- **Endpoint** 
    ```js
    POST /api/sessions/refresh
    ``` 

- **Cookies**    
    - **refreshToken**

- **Response** 
    - Success **(200 OK)** 
        ```json
        {
            "data": {
                "user_id": "string",
                "accessToken": "string"
            }
        }
        ```

    - Error **(401 Unauthorized)** 
        ```json
        {
            "errors": "Unauthorized"
        }
        ```

### **4. Logout User**

- **Endpoint** 
    ```js
    DELETE /api/sessions
    ```

- **Authorization**  
    ```
    Bearer <accessToken>
    ```

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
            "errors": "Unauthorized"
        }
        ```

### **5. Get User**

- **Endpoint**
    ```js
    GET /api/users/:userId
    ```

- **Authorization**  
    ```
    Bearer <accessToken>
    ```

- **Response** 
    - Success **(200 OK)** 
        ```json
        {
            "data": {
                "id": "string",
                "username": "string",
                "email": "string"
            }
        }
        ```
    
    - Error **(401 Unauthorized)** 
        ```json
        {
            "errors": "Unauthorized"
        }
        ```