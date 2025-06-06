# API
### Usuarios (users, clients y profesionals)
- Get Users (GET)
	- Endpoint: `/api/users`
- Get One User (GET)
	- Endpoint: `/api/users/(id)`
- Signup User (POST)
	- Endpoint: `/api/signup`
	<details>
	<summary style="color: green;">Ejemplo body POST registro</summary>

	```python
	{
		"email": "prueba@prueba.com",
		"password": "1234",
		"username": "pruebapruebita",
		"name": "prueba",
		"surname": "pérez",
		"NID": "08080808Z",
		"telephone": "666666666",
		"avatar_url": "https://cdn-icons-png.flaticon.com/512/6326/6326055.png",
		"city": "madrid",
		"address": "calle falsa 123",
		"birthdate": "1997/01/01",
		"gender": "MALE",
		"is_profesional": "true",
		"bio": "Me gustan los limones",
		"type": "FREELANCE",
		"business_name": "disney",
		"tax_address": "calle la piruleta",
		"nuss": "medaigual"
	}
	```

	</details>
- Login User: (POST)
	- Endpoint: `/api/login`