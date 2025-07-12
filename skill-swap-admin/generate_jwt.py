import jwt
token = jwt.encode({"role": "admin"}, "ulala", algorithm="HS256")
print(token)
