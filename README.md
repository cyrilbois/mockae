# mockae

## Usage

Create a `db.json` file

```json
{
  {
    "products": [
      {
        "id": 1, "name": "T-shirt", "price": 19.99
      },
      {
        "id": 2, "name": "Jeans", "price": 49.99
      }
    ],
    "users": [
      {
        "id": 1, "username": "johndoe", "email": "johndoe@example.com"
      },
      {
        "id": 2, "username": "janedoe", "email": "janedoe@example.com"
      }
    ]
}
}
```

Create a `rules.lua` file

```lua
if request.method() == "POST" and request.pathname() == "/users" then
    response.status(400)
    response.send('{' .. 
                  '"error":"Bad Request",\n' ..
                  '"message":"Missing required field: email"' ..
                '}')
    return response.exit()
end
```

Start the REST API service

```shell
$ npm start
```

Get a REST API

```shell
$ curl http://localhost:3000/products/1
{
    "id": 1,
    "name": "T-shirt",
    "price": 19.99
}
```

## Routes

The REST API handles different HTTP methods for creating, retrieving, updating, and deleting resources


```
GET     /products	    Returns all products
GET     /products/2 	Returns the product with ID 2
POST    /products	    Create a new product
GET     /products/2	    Returns the product with ID 2
PUT     /products/2	    Update the product with ID 2
PATCH   /products/2	    Update partially the product with ID 2
DELETE  /products/2 	Delete the product with ID 2
```

## Custom rules

Custom rules are Lua code that allow you to modify the behavior of the fake REST API. With custom rules, you can set conditions based on the request (such as HTTP method, headers, and payload) and define the response (including HTTP status code and payload). This enables you to tailor the API's behavior to suit specific testing and development scenarios.

The Request and Response objects are provided to define the rules.

### Request

The Request object is used to represent the request data.

Sure, here is the table without quotes in the methods:

```md
| Method                  | Description                                                                        |
|-------------------------|------------------------------------------------------------------------------------|
| request.header(name)    | Returns the header `name`                                                          |
| request.method()        | Returns the HTTP method ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')                  |
| request.url()           | Returns the pathname of the URL (e.g., /users/23).                                 |
| request.id()            | Returns the resource ID                                                            |
| request.resource()      | Returns the resource                                                               |
| request.payload(name)   | Returns the attribute of the payload object with the name specified in `name`      |
```

###  Response

The Response object is used to update the response, including the HTTP status, headers, and payload.

Here is the information in a Markdown table:

```md
| Method                     | Description                                                                                     |
|----------------------------|-------------------------------------------------------------------------------------------------|
| response.status(status)    | Sets the HTTP status (e.g., 200, 404, etc.)                                                     |
| response.send(payload)     | Sets the response payload                                                                       |
| response.header(name, value) | Sets the header name to value                                                                  |
| response.exit()            | Stops the standard execution of the API (No action or resource loading will be performed)       |
```

## Test

Launch test

```shell
$ npm test
```
