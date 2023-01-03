console.log("Chargement iframebattlefx.js");
/**
 *                           ██╗██████╗ ██╗
 *                           ██║╚════██╗██║
 *                           ██║ █████╔╝██║
 *                      ██   ██║██╔═══╝ ██║
 *                      ╚█████╔╝███████╗███████╗
 *                       ╚════╝ ╚══════╝╚══════╝
 *                       https://jusdeliens.com
 *
 * Designed by Julien Arné - jusdeliens.com
 * Under CC BY-NC-ND 3.0 license
 * https://creativecommons.org/licenses/by-nc-nd/3.0/
 */
/**
 * @typedef 	{Object} 	Agent
 * @property 	{string}	id - The name of the agent
 * @property 	{number}	x			- Abscissa of the agent on the grid. From left (0) to right
 * @property 	{number}	y			- Ordinate of the agent on the grid. From top (0) to bottom
 * @property 	{number}	dir			- The orientation of the agent on the grid. 0: east, 1: north, 2:west, 3:south
 * @property 	{number}	ammo		- The remaining ammunitions
 * @property 	{number}	life		- The remaining life. When 0 is reached, no order can be  send until respawn delay is elapsed
 * @property 	{number}	d			- The front distance to an obstacle. 0 means nothing visible
 * @property 	{number}	verbose		- The verbosity of the logs. 0: None, 1: Error, 2: Warning, 3: Info, 4: Debug
 * @property 	{boolean}	isConnected	- True if connected to the game server. False if disconnected
 *
 */
/**
 * @typedef {Object} AgentEvent
 * @property {Agent} src The agent that triggers the event
 * @property {string} name The name of the event: "connected", "disconnected", "xChanged", "yChanged", "dirChanged", "dChanged", "lifeChanged", "ammoChanged", "updated", "stateChanged",
 * @property {any} before The value of the attribute that changed during the event
 * @property {any} after The value of the attribute that changed during the event
 */
/**
 * Main class to create and handle the behaviour
 * of a virtual robot in an arena
 */
class Agent {
  id;
  x;
  y;
  dir;
  ammo;
  life;
  d;
  verbose;
  isConnected;

  #client;
  #username;
  #password;
  #arena;
  #port;
  #server;
  #eventCallbacks;
  #topicAgentState;
  #topicAgentRequest;
  #topicGameState;
  #topicGamePing;
  #prevPing;
  #prevRx;
  #agentRequest;
  #isServerConnected;
  #readOnly;
  #gamePingEnable;
  #gameDtPing;
  #gameDtDisconnect;
  #gameRequestDt;

  /**
   * Creates and connects the agent in the arena
   * @param {string} 	id 			The wanted name of the agent
   * @param {string} 	username 	Username to connect to the server
   * @param {string} 	password 	User password coming with the username to connect to the server
   * @param {string}	arena 		The name of the arena to join
   * @param {number} 	port 		The server port number
   * @param {string} 	server 		The server url
   * @param {number} 	verbose 	The wanted verbosity of the logs. 0: None, 1: Error, 2: Warning, 3: Info, 4: Debug
   * @param {Boolean} readonly 	Set to true to only read agent state (default). False to be able to control agent.
   */
  constructor(
    id = null,
    username = null,
    password = null,
    arena = null,
    port = 443,
    server = "mqtt.jusdeliens.com",
    verbose = 3,
    readonly = true
  ) {
    if (id === null)
      id = window.prompt(
        "Entrer le nom de votre agent (15 caractères max)",
        ""
      );
    if (id === null || id === "")
      id = "Agent" + Math.random().toString(36).substr(2, 4);
    if (id.length > 30) id = id.substr(0, 30);

    if (username === null)
      username = window.prompt("Entrer le username", "demo");
    if (username === null || username === "") username = "demo";
    if (password === null) password = window.prompt("Entrer le password", "");
    if (password === null || password === "") password = "demo";
    if (arena === null)
      arena = window.prompt("Entrer le nom de l'arène", "demo");
    if (arena === null || arena === "") arena = "demo";

    this.x = 0;
    this.y = 0;
    this.dir = 0;
    this.ammo = 10;
    this.life = 100;
    this.isConnected = false;
    this.verbose = verbose;
    this.#gamePingEnable = false;
    this.#gameDtPing = 3000;
    this.#gameDtDisconnect = 10000;
    this.#gameRequestDt = 100;
    this.#isServerConnected = false;
    this.#prevPing = new Date().getTime() - this.#gameDtPing;
    this.#prevRx = new Date().getTime() - this.#gameDtDisconnect;
    this.#agentRequest = {};
    this.#username = username;
    this.#password = password;
    this.#topicAgentState = "pytactx/agents/state/" + arena + "/" + id;
    this.#topicAgentRequest = "pytactx/agents/request/" + arena + "/" + id;
    this.#arena = arena;
    this.#port = port;
    this.#server = server;
    this.#topicGameState = "pytactx/game/state/" + this.#arena;
    this.#topicGamePing = "pytactx/game/ping/" + this.#arena;
    this.id = id;
    this.#eventCallbacks = {
      connected: [],
      disconnected: [],
      xChanged: [],
      yChanged: [],
      dirChanged: [],
      dChanged: [],
      lifeChanged: [],
      ammoChanged: [],
      updated: [],
      stateChanged: [],
    };
    this.#readOnly = readonly;
    if (readonly === true)
      this.id += "-readonly" + Math.random().toString(36).substr(2, 4);
  }

  /**
   * Function to be overriden
   * @returns {void}
   */
  onUpdate() {}
  /**
   * Function to be overriden
   * @returns {void}
   */
  onConnected() {}
  /**
   * Function to be overriden
   * @returns {void}
   */
  onDisconnected() {}

  /**
   * Try to connect the agent to the server
   * @returns {void}
   */
  connect() {
    if (this.#isServerConnected === true) return;

    this.__info(
      "Connecting to server " +
        this.#server +
        ":" +
        Number(this.#port) +
        " as " +
        this.id
    );
    try {
      this.#client = new Paho.MQTT.Client(
        this.#server,
        Number(this.#port),
        this.id
      );
    } catch (error) {
      alert(error);
    }
    this.#client.onMessageArrived = (msg) => {
      this.__onMessage(msg);
    };
    this.#client.onConnectionLost = (msg) => {
      this.__onDisconnect(msg);
    };

    if (this.#port == 443)
      this.#client.connect({
        timeout: 3,
        onSuccess: (msg) => {
          this.__onConnect(msg);
        },
        onFailure: (msg) => {
          this.__onFailure(msg);
        },
        userName: this.#username,
        password: this.#password,
        mqttVersion: 3,
        useSSL: true,
      });
    else
      this.#client.connect({
        timeout: 3,
        onSuccess: (msg) => {
          this.__onConnect(msg);
        },
        onFailure: (msg) => {
          this.__onFailure(msg);
        },
        userName: this.#username,
        password: this.#password,
        mqttVersion: 3,
      });

    window.setInterval(() => {
      if (this.#isServerConnected) this.__update();
    }, this.#gameRequestDt);
  }

  /**
   * Disconnects the agent from the server
   * @returns {void}
   */
  disconnect() {
    if (this.#isServerConnected === false) return;
    this.#client.disconnect();
    window.clearInterval();
    this.__info("Disconnecting from server ...");
  }

  /**
   * Fires in the direction of the agent
   * @param {Boolean} readonly 	Set to true to lock fire. It will fire until False is passed or if agent gun chamber is empty.
   * @returns {void}
   */
  fire(enable = true) {
    if (this.#readOnly === true) return;
    this.#agentRequest["fire"] = enable;
  }

  /**
   * Move the agent by specifying x and y step to move
   * @param {number} 	dx 			x steps to move. Positive to right, negative to left
   * @param {number} 	dy 			y steps to move. Positive to bottom, negative to top
   * @returns {void}
   */
  move(dx, dy) {
    if (this.#readOnly === true) return;
    this.#agentRequest["x"] = this.x + dx;
    this.#agentRequest["y"] = this.y + dy;
  }

  /**
   * Move the agent to the specified position
   * @param {number} 	x 			Abscissa on the grid where to move
   * @param {number} 	y 			Ordinate on the grid where to move
   * @param {number} 	dir 		Orientation where to look. 0: east, 1: north, 2:west, 3:south
   * @returns {void}
   */
  moveTo(x, y, dir) {
    if (this.#readOnly === true) return;
    this.#agentRequest["x"] = x;
    this.#agentRequest["y"] = y;
    this.#agentRequest["dir"] = dir;
  }

  /**
   * Set the orientation where to look
   * @param {number} 	dir 		0: east, 1: north, 2:west, 3:south
   * @returns {void}
   */
  lookTo(dir) {
    if (this.#readOnly === true) return;
    this.#agentRequest["dir"] = dir;
  }

  /**
   * Set the function to be called when the event with the specified name occurs
   * @param {(AgentEvent) => void} callback Passes the agent object each time the callback is called
   * @returns {void}
   */
  addEventListener(eventName, callback) {
    if (!(eventName in this.#eventCallbacks)) return;
    this.#eventCallbacks[eventName].push(callback);
  }

  /**
   * Function call periodically for synchronising request with the server
   * @returns {void}
   */
  __update() {
    let agentBefore = JSON.parse(JSON.stringify(this));
    if (Object.keys(this.#agentRequest).length > 0) {
      var payload = JSON.stringify(this.#agentRequest);
      this.__debug("Sending to " + this.#topicAgentRequest + " : " + payload);
      this.#agentRequest = {};
      const message = new Paho.MQTT.Message(payload);
      message.destinationName = this.#topicAgentRequest;
      this.#client.send(message);
    }
    const now = new Date().getTime();
    const dtPing = now - this.#prevPing;
    if (dtPing >= this.#gameDtPing) {
      this.#prevPing = now;
      if (this.#gamePingEnable) {
        const payload = '{"ping":true}';
        this.__debug("Sending to " + this.#topicGamePing + " : " + payload);
        const message = new Paho.MQTT.Message(payload);
        message.destinationName = this.#topicGamePing;
        this.#client.send(message);
      }
    }
    const dtRx = now - this.#prevRx;
    if (dtRx >= this.#gameDtDisconnect) {
      if (this.isConnected === true) {
        this.isConnected = false;
        this.onDisconnected();
        this.__notify("disconnected", agentBefore, this);
      }
    }
    if (this.isConnected === true) {
      this.onUpdate();
      this.__notify("updated", agentBefore, this);
    }
  }

  /**
   * Function to notify each listener when a event occurs
   * @param {string} eventName The name of the event that must be in this.#eventCallbacks keys
   * @param {any} before The value of the agent attribute before the event occurs
   * @param {any} after The value of the agent attribute after the event occurs
   * @returns {void}
   */
  __notify(eventName, before = null, after = null) {
    this.#eventCallbacks[eventName].forEach((callback) => {
      callback({ src: this, name: eventName, before: before, after: after });
    });
  }

  /**
   * Function to write console log according to the actual agent's verbosity
   * @returns {void}
   */
  __debug(message) {
    if (this.verbose >= 4) console.log(message);
  }
  /**
   * Function to write console log according to the actual agent's verbosity
   * @returns {void}
   */
  __info(message) {
    if (this.verbose >= 3) console.log(message);
  }
  /**
   * Function to write console log according to the actual agent's verbosity
   * @returns {void}
   */
  __warn(message) {
    if (this.verbose >= 2) console.log(message);
  }
  /**
   * Function to write console log according to the actual agent's verbosity
   * @returns {void}
   */
  __error(message) {
    if (this.verbose >= 1) console.log(message);
  }

  __onConnect(msg) {
    this.__info(
      "Connected to broker " +
        this.#server +
        ":" +
        Number(this.#port) +
        " as " +
        this.id
    );
    this.#client.subscribe(this.#topicAgentState);
    this.#client.subscribe(this.#topicGameState);
    this.#isServerConnected = true;
    if (this.#readOnly === false) {
      const payload = '{"orientation:0"}';
      this.__debug("Sending to " + this.#topicAgentRequest + " : " + payload);
      const message = new Paho.MQTT.Message(payload);
      message.destinationName = this.#topicAgentRequest;
      this.#client.send(message);
    }
  }
  __onDisconnect(responseObject) {
    const alertMsg =
      "Disconnected from server : " + responseObject.errorMessage;
    this.__warn(alertMsg);
    if (this.isConnected === true) {
      this.isConnected = false;
      this.onDisconnected();
    }
    this.#isServerConnected = false;
  }
  __onFailure(msg) {
    const alertMsg =
      "Fail to connect to server." +
      "\nError " +
      msg.errorCode +
      " : " +
      msg.errorMessage;
    this.__error(alertMsg);
  }
  __onMessage(msg) {
    let agentBefore = JSON.parse(JSON.stringify(this));
    const now = new Date().getTime();
    this.#prevRx = now;
    if (this.isConnected === false) {
      this.isConnected = true;
      this.onConnected();
      this.__notify("connected", agentBefore, this);
    }
    if (msg.destinationName == this.#topicAgentState) {
      this.__debug(
        "Rx from " + msg.destinationName + " : " + msg.payloadString
      );
      const state = JSON.parse(msg.payloadString);
      let stateChanged = false;
      if ("x" in state && this.x != state["x"]) {
        stateChanged = true;
        this.x = state["x"];
        this.__notify("xChanged", agentBefore.x, this.x);
      }
      if ("y" in state && this.y != state["y"]) {
        stateChanged = true;
        this.y = state["y"];
        this.__notify("yChanged", agentBefore.y, this.y);
      }
      if ("dir" in state && this.dir != state["dir"]) {
        stateChanged = true;
        this.dir = state["dir"];
        this.__notify("dirChanged", agentBefore.dir, this.dir);
      }
      if ("ammo" in state && this.ammo != state["ammo"]) {
        stateChanged = true;
        this.ammo = state["ammo"];
        this.__notify("ammoChanged", agentBefore.ammo, this.ammo);
      }
      if ("life" in state && this.life != state["life"]) {
        stateChanged = true;
        this.life = state["life"];
        this.__notify("lifeChanged", agentBefore.life, this.life);
      }
      if ("d" in state && this.d != state["d"]) {
        stateChanged = true;
        this.d = state["d"];
        this.__notify("dChanged", agentBefore.d, this.d);
      }

      if (stateChanged) this.__notify("stateChanged", agentBefore, this);
    }
  }
}
