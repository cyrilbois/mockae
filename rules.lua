if request.resource() == "status" then
    response.status(request.id())
    response.send('{"error":"Internal Server Error","message":"Invalid status code","code":' .. request.id() .. '}')
    return response.exit()
end