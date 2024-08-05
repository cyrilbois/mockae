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

## Test

Launch test

```shell
$ npm test
```
