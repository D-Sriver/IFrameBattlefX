import { Agent } from "./iframebattlefx";

function onLoaded(event) {
	// se connecter a pytactx et s'abonner a agent event
	var agent = new Agent(
		"toto",
		"demo",
		"demo",
		8080,
		"mqtt.jusdeliens.com",
		3,
		true
	);
	agent.connect();
}

document.addEventListener("DOMContentLoaded", onLoaded);
