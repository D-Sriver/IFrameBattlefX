"""
Librairie developpee par Julien ARNE - jusdeliens.com
sous licence CC BY-NC-ND 3.0 (plus d'informations sur https://creativecommons.org/licenses/by-nc-nd/3.0/)
Elle permet de programmer une platine connectee jusdeliens, equipee d'un microcontroleur, d'un bouton poussoir d'une led RGB et d'un buzzer
Une fois votre variable wemos creer a partir de la fonction pyiotx.Wemos("IdDeLeCarteAuDos"), vous pouvez :
- recuperer l'etat du bouton de 2 façons :
    1) En verifiant la valeur de la variable wemos.boutonAppuye : True = bouton appuye, False = bouton relache
    2) En attachant une fonction callback en appelant executerQuandBoutonAppuye(), executerQuandBoutonRelache() ou executerQuandBoutonChange()
- jouer un son d'une certaine frequence pendant un certain temps avec la fonction jouerSon()
- jouer une lumiere d'une certaine couleur (de composante rouge, vert, bleu) pendant un certain temps
N'oubliez pas d'appeler la fonction wemos.actualiser() apres un ou plusieurs jouerSon() et/ou jouerLumiere() pour envoyer vos sons et lumieres a la carte
Attention, privilegiez des sons et lumieres courtes et peu nombreux avant d'appeler actualiser() pour ne pas saturer la bande passante
"""

__version__ = '0.9.4'

import paho.mqtt.client as mqtt
import json
import time

def _onConnect(client, wemos, flags, rc):
    print("Connexion a " + wemos.id + " retourne code", str(rc))
    if ( rc == 0 ):
        wemos.estConnecte = True
        wemos._mqtt.subscribe(wemos._topicr)

def _onDisconnect(client, wemos, rc):
    print("Deconnexion de " + wemos.id)
    wemos.estConnecte = False

def _onSubscribe(client, wemos, mid, granted_qos):
    print("Connexion a " + wemos.id + " valide")
    
def _onUnsubscribe(client, wemos, mid):
    print("Deconnexion de " + wemos.id)

def _onMessage(client, wemos, msg):
    payload=str(msg.payload.decode())
    if Wemos.verbose==True:
        print("Reception sur", msg.topic, "de", payload)
    state = json.loads(payload)
    if ( 'button' in state ):
        nouvelEtatBoutonAppuye = bool(state['button'])
        if ( nouvelEtatBoutonAppuye != wemos.boutonAppuye ):
            wemos.quandBoutonChange(wemos.boutonAppuye, nouvelEtatBoutonAppuye)
            if ( wemos._quandBoutonChange != None ):
                wemos._quandBoutonChange(wemos, wemos.boutonAppuye, nouvelEtatBoutonAppuye)
            if( nouvelEtatBoutonAppuye == True ):
                wemos.quandBoutonAppuye()
                if ( wemos._quandBoutonAppuye != None ):
                    wemos._quandBoutonAppuye(wemos)
            if( nouvelEtatBoutonAppuye == False ):
                wemos.quandBoutonRelache()
                if ( wemos._quandBoutonRelache != None ):
                    wemos._quandBoutonRelache(wemos)
            wemos.boutonAppuye = nouvelEtatBoutonAppuye

class Wemos:     
    """Classe permettant de programmer les capteurs et actionneurs d'une platine connectee jusdeliens"""
    verbose = False
    topicr = "pyiotx/state"
    topicw = "pyiotx/request"
    dureeMaxJeu = 5000
    nombreMaxJeu = 50
    
    def __init__(self, id="", username="", password="", server="", verbose=False, prompt=True):   
        """Valeurs possibles pour username, password et server : chaines de caracteres communiquees par l'administrateur jusdeliens
        L'id de la carte est inscrit au dos de la platine"""
        print("Bonjour a tous les jusdeliens ! Pour simuler votre objet connecte, rendez-vous sur https://jusdeliens.com/play/pyiotx-viewer")
        if ( type(id) is not str or type(username) is not str or type(password) is not str or type(server) is not str ):
            print("ATTENTION: utiliser des texte entre guillement (str) pour les parametres id,username,password,server pour construire un objet Wemos")
            id = str(id)
            username = str(username)
            password = str(password)
            server = str(server)
        if ( type(verbose) is not bool ):
            print("ATTENTION: utiliser un booleen (bool) pour le parametre verbose pour construire un objet Wemos")
            verbose = False

        # Prompt console si constructeur sans parametres
        if (id == "" or id == "wemosXXXX"):
            id = input("Entrer l'identifiant de votre wemos (inscrit au dos de la carte): ")
        if ( username == "" and prompt):
            username = input("Entrer le username : ")
        if (password == "" and prompt):
            password = input("Entrer le password : ")
        if ( server == "" and prompt):
            server = input("Entrer le chemin vers le serveur (defaut='mqtt.jusdeliens.com'): ")
        if ( server == "" ):
            server = "mqtt.jusdeliens.com";  

        Wemos.verbose = verbose
        self.id = id
        self.boutonAppuye = False
        self.lumieres = []
        self.lumieresDuree = 0
        self.sons = []
        self.sonsDuree = 0
        self.estConnecte = False
        self._quandActualiser = None
        self._quandBoutonChange = None
        self._quandBoutonAppuye = None
        self._quandBoutonRelache = None
        self._prevSonsRequest = ""
        self._prevLumieresRequest = ""
        self._topicr = Wemos.topicr + "/" + self.id
        self._topicw = Wemos.topicw + "/" + self.id
        self._qos = 0
        self._mqtt = mqtt.Client(client_id = self.id, userdata=self)
        self._mqtt.on_connect = _onConnect
        self._mqtt.on_disconnect = _onDisconnect
        self._mqtt.on_subscribe = _onSubscribe
        self._mqtt.on_unsubscribe = _onUnsubscribe
        self._mqtt.on_message = _onMessage
        self._mqtt.username_pw_set(username, password)
        print("Connexion a la wemos " + self.id + " en cours ...")
        self._mqtt.connect(server)
        self._mqtt.loop_start()
        time.sleep(1)
        
    def actualiser(self):
        """Fonction a appeler a la fin de chaque bloc de jouerSon ou jouerLumiere"""
        if len(self.sons) == 0 and len(self.lumieres) == 0:
          return
        request = {}
        request["buzzer"] = []
        for son in self.sons:
            request["buzzer"].append(son)
        request["led"] = []
        for lumiere in self.lumieres:
            request["led"].append(lumiere)
        request = json.dumps(request)
        if Wemos.verbose==True:
            print("Envoi sur", self._topicw, "de", request)
        self._mqtt.publish(self._topicw, request, self._qos)
        if ( self.sonsDuree > self.lumieresDuree ):
          time.sleep(self.sonsDuree/1000)
        else:
          time.sleep(self.lumieresDuree/1000)
        self.sonsDuree = 0
        self.lumieresDuree = 0
        self.lumieres.clear()
        self.sons.clear()
        
    def jouerSon(self, frequenceEnHertz, dureeEnMilliSecondes):
        """Jouer un son avec une frequence en Hertz entiere positive (0=silence), et une duree en millisecondes"""
        if ( type(frequenceEnHertz) is not int ):
            print("ATTENTION: utiliser une frequence entiere (int) pour appeler la fonction jouerSon !!")
            frequenceEnHertz = int(frequenceEnHertz)
        if ( type(dureeEnMilliSecondes) is not int ):
            print("ATTENTION: utiliser une duree entiere (int) pour appeler la fonction jouerSon !!")
            dureeEnMilliSecondes = int(dureeEnMilliSecondes)
        if ( frequenceEnHertz < 0 ):
            print("ATTENTION: utiliser une frequence positive pour appeler la fonction jouerSon !!")
            return False
        if ( dureeEnMilliSecondes <= 0 ):
            print("ATTENTION: utiliser une duree positive pour appeler la fonction jouerSon !!")
            return False
        if ( self.sonsDuree + dureeEnMilliSecondes > Wemos.dureeMaxJeu ):
            print("ATTENTION: duree maximale des sons atteinte pour jouerSon. Maximum autorise:", Wemos.dureeMaxJeu, "msecs")
            return False
        if ( len(self.sons) >= Wemos.nombreMaxJeu ):
            print("ATTENTION: nombre maximal de sons atteint pour jouerSon. Maximum autorise:", Wemos.nombreMaxJeu)
            return False
        son = (frequenceEnHertz, dureeEnMilliSecondes)
        self.sonsDuree += dureeEnMilliSecondes
        self.sons.append(son)
        return True
        
    def jouerLumiere(self, rouge, vert, bleu, dureeEnMilliSecondes):
        """Jouer la couleur avec les composantes RVB de type int de 0 a 255 pendant une duree en millisecondes"""
        if ( type(rouge) is not int or type(vert) is not int or type(bleu) is not int ):
            print("ATTENTION: utiliser des rouge,vert,bleu entiers (int) pour appeler la fonction changerCouleur !!")
            rouge = int(rouge)
            vert = int(vert)
            bleu = int(bleu)
        if ( rouge < 0 or rouge > 255 or vert < 0 or vert > 255 or bleu < 0 or bleu > 255 ):
            print("ATTENTION: rouge,vert,bleu doivent être compris entre 0 et 255 pour appeler la fonction changerCouleur !!")
            return False
        if ( self.lumieresDuree + dureeEnMilliSecondes > Wemos.dureeMaxJeu ):
            print("ATTENTION: duree maximale des lumieres atteinte pour jouerLumiere. Maximum autorise:", Wemos.dureeMaxJeu, "msecs")
            return False
        if ( len(self.lumieres) >= Wemos.nombreMaxJeu ):
            print("ATTENTION: nombre maximal de lumieres atteint pour jouerLumiere. Maximum autorise:", Wemos.nombreMaxJeu)
            return False
        lumiere = (rouge, vert, bleu, dureeEnMilliSecondes)
        self.lumieresDuree += dureeEnMilliSecondes
        self.lumieres.append(lumiere)
        return True
        
    def quandBoutonChange(self, ancienEtat, nouvelEtat):
        """Methode a surcharger dans la classe enfante"""
        pass
    def executerQuandBoutonChange(self, callback):
        """Valeur possible pour callback : une fonction de la forme nomDeLaFonction(wemos, ancienEtatBoutonAppuye, nouvelEtatBoutonAppuye)"""
        self._quandBoutonChange = callback
    def quandBoutonAppuye(self):
        """Methode a surcharger dans la classe enfante"""
        pass
    def executerQuandBoutonAppuye(self, callback):
        """Valeur possible pour callback : une fonction de la forme nomDeLaFonction(wemos)"""
        self._quandBoutonAppuye = callback
    def quandBoutonRelache(self):
        """Methode a surcharger dans la classe enfante"""
        pass
    def executerQuandBoutonRelache(self, callback):
        """Valeur possible pour callback : une fonction de la forme nomDeLaFonction(wemos)"""
        self._quandBoutonRelache = callback
