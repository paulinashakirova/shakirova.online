const http = require('http');
http.createServer(function (req, res) {
res.write("I wonder what my CI does");
	res.end();
}
).listen(3000);

console.log("server started on port 3000");
