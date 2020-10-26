# node-api-server-base
This repository contains a base implementation for a node api server with jwt authorization and local user database. It can be used as a framework for a fast project bootstrap as boilerplate code framework.  

Requests are handled by express. Register and Login routes handled by the passport middleware use the local sqlite database as store for the user data. 
On login, a JWT token is generated and provided in the response. 
Subsequent requests on protected API routes have to set the `Authorization` header with the JWT as **bearer**.

A logged in user can change his profile (mail and display_name) and change his password.

## Configuration
Configuration options can be provided through a `.env` in the project root:
```
JWT_ISSUER=api-server
JWT_KEY=SuperSecretJWTSigningKey1337!!
PORT=4000
```

## Start Scripts
* `npm start` starts the application for regular usage.
* `npm run debug` starts a nodemon instance of the application, which can come in handy while developing

## Routes

##### Authorization
* Routes marked with visibility **Private** can only be called with a valid Authorization header. 
Example: `Authorization: Bearer <jwt-token>`. A valid token can be aquired on the login route.

##### Parameters
* provided in body of http request with content-type `application/json` or `application/x-www-form-urlencoded`

##### Visibility / protection: 
* **Open**: No Authorization required to used the route
* **Optional**: will provide more information, if valid Auth Token is provided, but not required
* **Private**: Valid Auth Token required (login)

### Registration and Login

| Route               | parameters                  | response                           | *          |
|---------------------|-----------------------------|------------------------------------|------------|
| `POST /`            | username, password          | `{success: true, user: <user-id>}` | open       |
| `POST /login`       | username, password          | `{token: <auth-token>}`            | open       |
| `POST /renew_login` | --                          | `{token: <auth-token>}`            | private    |

The provided authorization token expires in 1 hour from the point of the signing.

`POST /renew_login` can be used to get a new token, if the current one is near its expiration date. 
No password but the current token has to be provided and it must not be expired. 
Once the token is expired, a normal login has to be done again to obtain a valid token.
 
### Test Routes for Login
| Route               | parameters | response                                     | *        |
|---------------------|------------|----------------------------------------------|----------|
| `GET /`             | --         | `{logged_in: <bool> [, user_id: <user-id>]}` | optional |
| `GET /list`         | --         | `{users: <user-count>}`                      | private  |

`GET /` will only contain the attribute `user_id`, if a valid token is provided in the request.

`GET /list` is only accessible with a valid jwt token in the http request authorization header.

### User   
| Route               | parameters                 | response                             | *       |
|---------------------|----------------------------|--------------------------------------|---------|
| `GET /user`         | --                         | `{id, username, display_name, mail}` | private |
| `PUT /user`         | display_name, mail         | --                                   | private |
| `PUT /user/password`| old_password, new_password | --                                   | private |

`GET /user` returns the current user profile data, where as `PUT /user` can be used to update user's display name and mail address.

`PUT /user/password` can be used to changed the user password of the logged in user. 
`old_password` has to match with the stored password hash. 


