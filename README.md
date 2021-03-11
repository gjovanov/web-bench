# Install deps
`npm i`

# Start dotnet core
```bash
cd dotnet
dotnet build
dotnet run -p .\dotnet.csproj --configuration Release
```

# Start uWebSockets.js
```bash
cd uws
npm i
npm run start
```

# Start Fastify.js
```bash
cd fastify
npm i
npm run start
```

# Start Express.js
```bash
cd express
npm i
npm run start
```

<<<<<<< HEAD
# Start Nanoexpress.js
```bash
cd nanoexpress
npm i
npm run start
```

=======
>>>>>>> 5690ea7847285aa3954bc9708258d3caba81d356
# Run benchmark tests
```bash
cd test
npm i
npm run test
```

# Results example
```
TAP version 13
dotnet
{ average: 41338.67, sent: 126535, total: 123975 }
ok 1 - ping-dotnet
uws
ok 2 - ping-uws
{ average: 66842.67, sent: 203008, total: 200448 }
fastify
ok 3 - ping-fastify
{ average: 40720, sent: 124672, total: 122112 }
express
ok 4 - ping-express
{ average: 6731.34, sent: 22752, total: 20192 }
<<<<<<< HEAD
ok 5 - ping-nanoexpress
{ average: 47205.34, sent: 144128, total: 141568 }
=======
>>>>>>> 5690ea7847285aa3954bc9708258d3caba81d356
```
