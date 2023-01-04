//lien vers la fonction Connected
function onAgentConnected(event) {
  let agent = event.src;
  console.log(`Agent connected ${agent.id}`);
}
//lien vers la fonction DirChanged
function onAgentUpdated(event) {
  let agent = event.src;
  console.log(`Agent updated ${agent.id}`);
  agent.lookTo((agent.dir + 1) % 4);
}
//lien vers la fonction DirChanged
function onAgentDirChanged(event) {
  let agent = event.src;
  console.log(`Agent dir changed ${agent.dir}`);
  //!-------------------------------------------------
  let img = document.querySelector(".bot_img");
  console.log(img);
  img.style.transform = "rotate(" + agent.dir * 90 + "deg)";
}
//fonction qui permet de se connecter à l'agent(iframebattlefx)
function onPageLoaded(event) {
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

  //Active les agent "Connected","Updated","dirChange"
  agent.addEventListener("connected", onAgentConnected);
  agent.addEventListener("updated", onAgentUpdated);
  agent.addEventListener("dirChanged", onAgentDirChanged);
}
//charge le dom (defer)
document.addEventListener("DOMContentLoaded", onPageLoaded);
