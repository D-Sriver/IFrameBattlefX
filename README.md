# IframeBattleFX Readme

Programmer une IA Iframe en HTML/CSS/JS de combat dans un combat à mort dans une arène virtuelle.

## Pour commencer

Il est demandé de faire une interface pour mobile, tablette et pc de manière responsive.

### Prérequis

[![Made with Python](https://img.shields.io/badge/Python-yellow?logo=python&logoColor=white)](https://python.org "Go to Python homepage") [![Made with Docker](https://img.shields.io/badge/Docker-blue?logo=docker&logoColor=white)](https://www.docker.com/ "Go to Docker homepage") [![Made with Docker](https://img.shields.io/badge/FileZilla-red?logo=filezilla&logoColor=white)](https://filezilla-project.org/ "Go to Filezilla homepage")
## En tant qu'utilisateur

- Une couleur qui se démarque

- Un thème unique [Duck Tales]

- Une mélodie simple pour chaque action

  - Mort
  - Victoire
  - Tir
  - Taunt

- Une interface de déplacement manuelle
  
  - Déplacement à gauche
  - Déplacement à droite
  - Déplacement en haut
  - Déplacement en bas

- Une possibilité de tir manuel

- Une possibilité de mode Autonome

## En tant qu’Administrateur

- permettre l’affichage simplifié de tous les utilisateurs

- Vie affichée par des pastille de couleur 

  - 3 état 
    - Vert > bon
    - jaune > moyen 
    -  rouge > mauvais

- bot simplifié (couleur maitre)

- Nom user dans une boite sous le cadre actif

## User Story

Utilisateur

- Être capable de se déplacer avec les boutons de gauche de l'interface.

- Être capable de faire des rotations avec le bouton à droite de l'interface.

- Être capable de voir le nom du robot .

- Être capable de voir la vie, les munitions et la batterie du robot.

- Être capable de lancer un mode automatique.

- Être capable de voir la camera embarquée du Bot.

- Être capable de tirer manuellement.

- Être capable de lancer un petit son.

Admin

- Afficher les données de vie , d’énergie et de batterie.

- Afficher une image simplifiée du bot.

- Avoir L’ascendant sur le contrôle du bot.

## Démarrage

Créer un docker "ubuntu" avec une redirection de port sur :2530 

```
docker pull ubuntu
docker run --name testdocker -p 0000:2500 -p 0000:2530 -dit ubuntu
apt update
apt upgrade
apt install apache2
apt install flask
apt install OpenSSH
```
Une fois fait vous devriez être en mesure de vous connecter depuis fileZilla a votre docker.

il vous suffira de placer le contenu du fichier "docker" a l’intérieur de votre docker pour lancer les script depuis une page localhost


## Fabriqué avec
<a href='https://github.com/shivamkapasia0' target="_blank"><img alt='Visual-studio' src='https://img.shields.io/badge/VS code-100000?style=flat&logo=Visual-studio&logoColor=0099FF&labelColor=FFFFFF&color=007BFF'/></a> <a href='https://github.com/shivamkapasia0' target="_blank"><img alt='flask' src='https://img.shields.io/badge/Flask-100000?style=flat&logo=flask&logoColor=010100&labelColor=FFFFFF&color=E1E1E0'/></a> <a href='https://github.com/shivamkapasia0' target="_blank"><img alt='docker' src='https://img.shields.io/badge/Docker-100000?style=flat&logo=docker&logoColor=0099FF&labelColor=FFFFFF&color=007BFF'/></a>

## Versions

**Dernière version stable :** 0.5

**Dernière version :** 0.6

## Auteurs

- **Sébastien Duez** _alias_ [@sriver-D](https://github.com/D-Sriver)

## License

Ce projet est sous licence LLD

---

# IframeBattleFX Readme

Program an Iframe AI in HTML/CSS/JS combat in a fight to the death in a virtual arena.

## Getting Started

It is requested to make an interface for mobile, tablet and pc in a responsive way.

### Prerequisites

[![Made with Docker](https://img.shields.io/badge/Python-yellow?logo=python&logoColor=white)](https://python.org "Go to Python homepage") [![Made with Docker](https://img.shields.io/badge/Docker-blue?logo=docker&logoColor=white)](https://www.docker.com/ "Go to Docker homepage")
## As a user

- A color that stands out

- A single theme

- A simple melody for each action

  - Dead

  - Victoire

  - Shooting
  
  - Taunt

- A manual movement interface

  - Moving to the left
  - Moving to the right
  - Moving up
  - Moving down

- A possibility of manual firing

- A possibility of autonomous mode

## As Administrator

- Enable simplified display of all users

- Life displayed by color tablets =>

  - 3 status 
    - Green > good 
    - yellow > medium 
    - red > bad

- simplified bot (master color)

- User name in a box under the current frame

## User Story

--User-

- Ability to move with left interface buttons.
- Ability to rotate with the button to the right of the interface.
- Be able to see the name of the robot.
- Be able to see the life, ammunition and battery of the robot.
- Be able to launch an automatic mode.
- Be able to see the bot’s onboard camera.
- Ability to fire manually.
- Being able to make a small sound.

--Admin-

- View Life, Energy and Ship data.
- Display a simplified bot image.
- Having the ability to control the bot.

## Start

Go to https://jusdeliens.com/play/pytactx-viewer/

## Manufactured with

<a href='https://github.com/shivamkapasia0' target="_blank"><img alt='Visual-studio' src='https://img.shields.io/badge/VS code-100000?style=flat&logo=Visual-studio&logoColor=0099FF&labelColor=FFFFFF&color=007BFF'/></a> <a href='https://github.com/shivamkapasia0' target="_blank"><img alt='flask' src='https://img.shields.io/badge/Flask-100000?style=flat&logo=flask&logoColor=010100&labelColor=FFFFFF&color=E1E1E0'/></a> <a href='https://github.com/shivamkapasia0' target="_blank"><img alt='docker' src='https://img.shields.io/badge/Docker-100000?style=flat&logo=docker&logoColor=0099FF&labelColor=FFFFFF&color=007BFF'/></a>

## Versions

**Latest stable release:** 0.5

**Latest version:** 0.6

## Authors

- **Sébastien Duez** _alias_ [@sriver-D](https://github.com/D-Sriver)

## License

This project is licensed under LLD
