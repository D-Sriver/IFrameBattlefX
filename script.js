//*lien vers la fonction Connected
function onAgentConnected(event) {
  let agent = event.src;
  console.log(`Agent connected ${agent.id}`);
}
//*lien vers la fonction Updated
function onAgentUpdated(event) {
  let agent = event.src;
  console.log(`Agent updated ${agent.id}`);
  agent.lookTo((agent.dir + 1) % 4);
}
//*lien vers la fonction DirChanged
function onAgentDirChanged(event) {
  let agent = event.src;
  console.log(`Agent dir changed ${agent.dir}`);
  let img = document.querySelector("img");
  console.log(img);
  img.style.transform = "rotate(" + agent.dir * 90 + "deg)";
}
//*fonction qui charge l'agent au démarrage de la page
function onPageLoaded(event) {
  let url_string = window.location.href;
  let url = new URL(url_string);
  let readonly = url.searchParams.get("readonly");
  let verbosity = url.searchParams.get("verbosity");

//*readonly défini automatiquement sur True 
  if ((readonly = null)) readonly = true;
  else readonly = readonly == "true";
  //* expression d'operations ternaire
  //!  readonly = (readonly==null) ?   true : (readonly === 'true');

//*permet de définir les informations (1 a 4 (debug))
  if ((verbosity = null)) verbosity = 1;
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
    443,
    "mqtt.jusdeliens.com",
    2,
    false
  );
  agent.connect();

  //*Active les agent "Connected","Updated","dirChange"
  agent.addEventListener("connected", onAgentConnected);
  agent.addEventListener("updated", onAgentUpdated);
  agent.addEventListener("dirChanged", onAgentDirChanged);
}
//*charge le dom (defer)
document.addEventListener("DOMContentLoaded", onPageLoaded);
