To get this backend framework up and running, complete the following instructions:

1. Git clone this repository:

```
git clone https://github.com/fkigawa/app-backend.git
```

2. Create .env file in root directory. Initialize two variables in the .env file:

```
MONGODB_URI="<URI>" 
TOKEN_SECRET="<TOKEN>"
```

3. Run the following commands:

```
cd app-backend
rm -rf ./node_modules 
npm install --save 
npm run dev
```

The backend should now be up and running.
