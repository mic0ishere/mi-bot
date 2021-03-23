const child_process = require("child_process")
const child = child_process.exec("cd ./lavalink && java -jar Lavalink.jar");

child.stdout.setEncoding("utf8");
child.stderr.setEncoding("utf8");

child.stdout.on("data", (data) => {
  console.log(data);
});

child.stderr.on("data", (data) => {
  console.error(data);
});

child.on("error", (error) => {
  console.error(error);
});

child.on("close", (code) => {
  console.log(`Lavalink exited with code ${code}`);
});