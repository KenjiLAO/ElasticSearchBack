# Contexte
Nous devons créer un projet comprennant une partie web app et une partie API avec ElasticSearch.
Cette api a pour but d'alimenter le front Angular https://github.com/RemiLecas/ELK/tree/main
# Projet
## Description
Cette Api permet de faire des recherches ElasticSearch sur le cloud d'ElasticSearch

Lien du repository git : https://github.com/KenjiLAO/ElasticSearchBack

### Prérequis
Avoir Node.js d'installé
https://nodejs.org/en

Installer les modules swaggers :
npm install swagger-jsdoc swagger-ui-express

Les dépendances s'installent localement automatiquement

### Lancement
npm start pour lancer l'application

## Documentation

Après avoir lancé l'application, vous avez accès à cette endpoint :
http://localhost:3000/api-docs

Ce swagger montre tous les endpoints utilisés dans l'api

## Explication des différents données présentes dans le dashboard
Le dashboard présente une analyse des données relatives aux datasets de pokemon présent dans ElasticSearch. Voici une vue d'ensemble des différents éléments présents :

Répartition des Types de pokemons : Ce donut chart permet de visualiser la répartition des pokemons par type (Eau, Feu, ect..). De plus, il affiche les seconds types des pokémons qui sont associée à chaque premier type.
Top 5 des pokemons avec la plus grosse attaque : Ce graphique montre les pokemons avec la plus statistique grosse attaque présent dans les jeux
Nombre de Pokemon : Ce compteur indique le nombre total de pokemon présents dans le dataset.
Top 10 des pokemons avec la meilleur moyenne de statistique : Ce graphique montre les pokemons avec les meilleurs moyenne de statistique des pokemons présent dans les jeux tout en affichant leur statistiques dans chaque domaine (comme l'attaque, la défense, les points de vie, ect....)