var agent;

//*lien vers la fonction Connected
function onAgentConnected(event) {
  console.log(`Agent connected ${agent.id}`);
}

//*lien vers la fonction Updated
function onAgentUpdated(event) {
  console.log(`Agent updated ${agent.id}`);
  agent.lookTo((agent.dir + 1) % 4);
  let life = document.querySelector(".life_bar_bg");
  console.log(life);
  life.style.width = "1%";
}

//*lien vers la fonction DirChanged
function onAgentDirChanged(event) {
  console.log(`Agent dir changed ${agent.dir}`);
  let img = document.querySelector("img");
  console.log(img);
  img.style.transform = "rotate(" + agent.dir * 90 + "deg)";
}
function onFireButtonDown(event) {
  console.log("fire !");
}
function onFireButtonUp(event) {
  console.log("Stop fire");
}
function onOvaLoaded(event) {
  let firebutton = document.querySelector("#button_shot");
  firebutton.addEventListener("mousedown", onFireButtonDown);
  firebutton.addEventListener("mouseup", onFireButtonUp);
}

//*fonction qui charge l'agent au démarrage de la page
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

  let agent = new Agent(
    "sebastien_duez",
    "demo",
    "demo",
    "iframebattlefx",
    8080,
    "mqtt.jusdeliens.com",
    verbosity,
    readonly
  );
  agent.connect();

  //*Active les agent "Connected","Updated","dirChange"
  agent.addEventListener("connected", onAgentConnected);
  agent.addEventListener("updated", onAgentUpdated);
  agent.addEventListener("dirChanged", onAgentDirChanged);
}
//*charge le dom (defer)
document.addEventListener("DOMContentLoaded", onPageLoaded);
