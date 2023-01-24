from flask import Flask
import pyiotx

app = Flask(__name__)

wemos = pyiotx.Wemos

@app.route('/')
def index():
            return  '<a href="/tir">Tir</a></br><a href="/mort">Mort</a></br><a href="/hit">Hit</a></br><a href="/start">Start</a></br>' 

@app.route('/tir')
def tir():
    
            wemos.jouerSon(1093, 20)
            wemos.jouerSon(1092, 20)
            wemos.jouerSon(1091, 20)
            wemos.jouerSon(1090, 20)
            wemos.jouerSon(3093, 20)
            wemos.jouerSon(3092, 20)
            wemos.jouerSon(3091, 20)
            wemos.jouerSon(3090, 20)
            
            wemos.jouerLumiere(255, 4, 15, 20)
            wemos.jouerLumiere(220, 75, 15, 20)
            wemos.jouerLumiere(210, 135, 15, 20)
            wemos.jouerLumiere(180, 218, 15, 20)
            wemos.jouerLumiere(255, 4, 15, 20)
            wemos.jouerLumiere(220, 75, 15, 20)
            wemos.jouerLumiere(210, 135, 15, 20)
            wemos.jouerLumiere(180, 218, 15, 20)
            wemos.actualiser()

            return '<p>Page de tir de flask</p></br><a href="/">Retour a index</a>'
        
@app.route('/mort')
def mort():

            wemos.jouerSon(262, 350)
            wemos.jouerSon(1250, 200)
            wemos.jouerSon(250, 250)
            wemos.jouerSon(250, 350)
            
            wemos.jouerLumiere(255, 000, 000, 400)
            wemos.jouerLumiere(255, 000, 255, 300)
            wemos.jouerLumiere(255, 000, 000, 200)
            wemos.jouerLumiere(255, 255, 000, 100)
            wemos.actualiser()        

            return '<p>Page de mort de flask</p></br><a href="/">Retour a index</a>'

@app.route('/hit')
def hit():

            wemos.jouerSon(440, 300)
            wemos.jouerSon(240, 100)
            wemos.jouerSon(440, 300)
            
            wemos.jouerLumiere(255, 000, 000, 300)
            wemos.jouerLumiere(255, 255, 255, 400)
            wemos.jouerLumiere(255, 000, 000, 300)
            wemos.actualiser()

            return '<p>Page de hit de flask</p></br><a href="/">Retour a index</a>'

@app.route('/start')
def start():
    
            wemos.jouerSon(470, 500)
            wemos.jouerSon(587, 200)
            wemos.jouerSon(659, 500)
            wemos.jouerSon(698, 500)
            wemos.jouerSon(880, 600)
            wemos.jouerSon(988, 400)
            wemos.jouerSon(698, 500)
            wemos.jouerSon(878, 400)
    
            wemos.jouerLumiere(255, 4, 15, 500)
            wemos.jouerLumiere(220, 75, 15, 200)
            wemos.jouerLumiere(210, 135, 15, 500)
            wemos.jouerLumiere(180, 218, 15, 500)
            wemos.jouerLumiere(255, 4, 15, 600)
            wemos.jouerLumiere(220, 75, 15, 400)
            wemos.jouerLumiere(210, 135, 15, 500)
            wemos.jouerLumiere(180, 218, 15, 400)
            wemos.actualiser()

            return '<p>Page de start de flask</p></br><a href="/">Retour a index</a>'
    
app.run(host='0.0.0.0', port=80)
