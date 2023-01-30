var agent;

//*lien vers la fonction Connected
function onAgentConnected(event) {
  console.log(`Agent connected ${agent.id}`);
  let firebutton = document.querySelector("#button_shot");
  firebutton.addEventListener("mousedown", onFireButtonDown);
  firebutton.addEventListener("mouseup", onFireButtonUp);
}
//*lien vers la fonction Agent Connected des deux état du bouton
function onFireButtonDown(event) {
  console.log("fire !");
}
function onFireButtonUp(event) {
  console.log("Stop fire");
}

function onAgentUpdated(event) {
  console.log(`Agent updated ${agent.id}`);
  agent.lookTo((agent.dir + 1) % 4);

  //*Variable random de life, energy , ammo
  
  console.log(`Agent Life Change ${agent.life}`);

  let [value_life, value_ammo] = [
    `${agent.life}`,
    `${agent.ammo}`*10, 
  ];

  //*modification du DOM :root
  var value_root = document.querySelector(":root");
  value_root.style.setProperty("--life", value_life + "%");
  value_root.style.setProperty("--ammo", value_ammo + "%");
}
//*exemple by ID
//* function x () {
//*   var x = document.getElementById("#myId");
//*   x.querySelector(".example").innerHTML = "Hello World!";
//* }
//*---------------------
//*exemple by class
//* function y () {
//*   var x = document.getElementByClass(".myClass");
//*   x.querySelector(".example").innerHTML = "Hello World!";
//* }

//*lien vers la fonction DirChanged
function onAgentDirChanged(event) {
  console.log(`Agent dir changed ${agent.dir}`);
  let img = document.querySelector("img");
  console.log(img);
  img.style.transform = "rotate(" + agent.dir * 90 + "deg)";
}
//!fonction qui charge l'agent au démarrage de la page
function onPageLoaded(event) {
  let image = document.querySelector(".bloc_image_bot");
  let url_string = window.location.href;
  let url = new URL(url_string);
  let readonly = url.searchParams.get("readonly");
  let verbosity = url.searchParams.get("verbosity");

  //*readonly défini automatiquement sur True
  if (readonly == null) readonly = true;
  else readonly = readonly == "true";
  //* expression d'operations ternaire
  //!  readonly = (readonly==null) ?   true : (readonly === 'true');

  //*permet de définir les informations (1 a 4 (debug))
  if (verbosity == null) verbosity = 1;
  else verbosity = parseInt(verbosity);
  //* expression d'operations ternaire
  //!  readonly = (verbosity==null) ?   1 :   parseInt(verbosity);

  console.log(readonly);
  console.log(verbosity);

  //*Crée un nouvel agent iframebattlefx et se connecte
  agent = new Agent(
    "sebastien_duez",
    "demo",
    "demo",
    "demo",
    8080,
    "mqtt.jusdeliens.com",
    verbosity,
    readonly
  );
  agent.connect();

  //*"Connected","Updated","dirChange"
  agent.addEventListener("connected", onAgentConnected);
  agent.addEventListener("updated", onAgentUpdated);
  agent.addEventListener("dirChanged", onAgentDirChanged);
  agent.addEventListener("lifeChanged", onAgentLifeChanged);
}
//*charge le contenu du DOM (defer)
document.addEventListener("DOMContentLoaded", onPageLoaded);
