console.log("Chargement script.js");
var agent;

function onDirChanged(event) {
	console.log(`Dir changed ${agent.dir}`);
	console.log(event);
	document.querySelector("body").innerHTML = `Dir changed ${agent.dir}`;
}

function onLoaded(event) {
	console.log("script chargé");

	// Connecting to pytactx and subscribe to agent events
	agent = new Agent("HappyNewYear","demo","demo", "demo", 8080, "mqtt.jusdeliens.com", 3, true);
	agent.connect();

	agent.addEventListener("dirChanged", onDirChanged);
}

document.addEventListener("DOMContentLoaded", onLoaded);

