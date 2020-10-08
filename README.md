# INSTALL PROJECT

```javascript
git clone git@github.com:jedusor/zombie-game.git
cd zombie-game
yarn || npm install
npm run dev
```

## Theme du jeu

theme futuriste et spacial avec personnage encore à definir 
Le hero se retrouve face à des personnages qui veulent le tuer. Ils sont encore à défnir
La map pour le moment est des plus simple, il s'agit d'un vaisseau spacial pour le niveau 1

## Comment jouer 

Pour se déplacer il faut utiliser les touches directionnelles du pavé numérique

## Objectif 

L'objectif sera d'anéantir tous les ennemies qui apparaitront sur la carte aléatoirement. (à valider)


# DEVELOPPEMENT

## Point de la semaine

On a validé le thème futuriste spacial.
Le repo à été cleaner avec un nouveau dossier pour les ressources qui portent le nom *resources*.
Les stores ont été déplacé dans des fichiers qui seront propres à chaque components *Options, Characters, Table*.

#### Mehmet
je ne savais pas quoi faire avec les SVG qui sont dans *img* je te les ai laissé pour qu'on voit ensemble ce qu'on en fera.

J'ai avancé comme j'ai pu sur le la partie plateau avec le personnage en mouvement. Je galère a intégrer les éléments pour (texture obstacle etc). le probleme vient des tailles des cellules. Je suis chaud qu'on face un point ce vendredi sur ça. 
Du coup le personnage est beaucoup moins fluide mais on a par contre une petite idée de map. 


#DEPENDENCIES 

##ROLLUP 
###Rollup <span style="color:green;font-style:italic; font-size:15px">up to date
<span style="color:green;">
Current : ^2.3.4 <br>
Last : 2.29.0

###Rollup-plugin-terser  <span style="color:green;font-style:italic;font-size:15px">2 bugs
<span style="color:green;">
Current : ^7.0.0 <br>
Last : 7.0.2 

###Rollup-plugin svelte <span style="color:green;font-style:italic;font-size:15px">1 bug
<span style="color:green;">
Current : ^6.0.0 <br>
Last : 6.0.1
###Rollup-plugin livereload <span style="color:green;font-style:italic;font-size:15px">up to date
<span style="color:green;">
Current : ^2.0.0 <br>
Last : 2.0.0
###Rollup/plugin-commonjs  <span style="color:red;font-style:italic;font-size:15px">break
<span style="color:red;">
Current : ^14.0.0 <br>
Last : ^15.1.0
###Rollup/plugin-node-resolve <span style="color:red;font-style:italic;font-size:15px"> break
<span style="color:red;">
Current : ^8.0.0 <br>
Last : 9.0.0 


##POSTCSS
###Fullhuman/postcss-purgecss <span style="color:red;font-style:italic;font-size:15px">break
<span style="color:red;">
Current ^2.3.0 <br>
Last ^3.0.0 (3weeks)
###Postcss <span style="color:red;font-style:italic;font-size:15px"> break
<span style="color:red;">
Current ^7.0.32 <br>
Last 8.1.1 
###Postcss-load-config <span style="color:red;font-style:italic;font-size:15px">break
<span style="color:red;">
Current ^2.1.0 <br>
Last 3.0.0 

##SVELTE
###Svelte <span style="color:orange;font-style:italic;font-size:15px"> 29 new features
<span style="color:orange;">
Current ^3.0.0 <br>
Last 3.29.0 
###Svelte-preprocess <span style="color:orange;font-style:italic;font-size:15px"> 3 new features
<span style="color:orange;">
Current ^4.2.1 <br>
Last ^4.5.1 

##TAILWINDCSS
###Tailwindcss <span style="color:green;font-style:italic;font-size:15px">2 bugs
<span style="color:green;">
Current ^1.8.10 <br>
Last 1.8.12

##SIRV-CLI
###Sirv-cli <span style="color:green;font-style:italic;font-size:15px">6 bugs
<span style="color:green;">
Current ^1.0.0 <br>
Last 1.0.6 


















