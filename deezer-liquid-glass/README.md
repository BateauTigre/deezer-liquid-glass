# Deezer Liquid Glass

Thème perso pour **Deezer web** (dans Brave, et dans l'appli Deezer installée depuis Brave).
Version **1.9.0**.

## Ce que fait le thème

- Deux thèmes : **Verre noir** et **Verre blanc**, avec la pochette du titre en cours floutée en fond.
- Barre latérale, lecteur et recherche en verre, avec une lumière qui suit la souris et des reflets sur les bords.
- Clic sur la petite pochette du lecteur : **plein écran** avec la pochette en grand et les commandes de lecture (aléatoire, précédent, lecture/pause, suivant, répéter).
- Bouton **palette** dans la barre du haut : choix du thème, du fond (pochette floutée, fonds prêts ou couleur perso), de l'intensité du verre et de l'**accueil épuré** (moins de recos).
- Icônes redessinées, menus « … » plus lisibles, bouton **Tout marquer comme lu** dans les notifications.
- Barre latérale réduite = un simple bouton rond pour la rouvrir.

Raccourcis : **Échap** ferme le plein écran ou le menu Apparence, **Espace** met en pause dans le plein écran.

## Installation sur Brave

1. Décompresse le zip. Tu obtiens un dossier `deezer-liquid-glass` qui contient `manifest.json`, `deezer-liquid-glass.js` et ce `README.md`.
2. Range ce dossier quelque part où il ne bougera plus (par exemple `Documents\Extensions\deezer-liquid-glass`). Brave le lit à chaque démarrage : si tu le supprimes ou le déplaces, l'extension s'arrête.
3. Dans Brave, va sur `brave://extensions`.
4. Active **Mode développeur** (interrupteur en haut à droite).
5. Clique sur **Charger l'extension non empaquetée** et choisis le dossier `deezer-liquid-glass` (celui qui contient directement `manifest.json`).
6. Ouvre ou recharge **www.deezer.com**. Le thème s'applique tout seul.

Si tu avais l'ancienne version dans **Tampermonkey**, désactive-la pour éviter que le thème se charge deux fois.

### Utiliser Deezer comme une appli

Sur deezer.com dans Brave, ouvre le menu de Brave puis **Installer la page en tant qu'application** (selon ta version de Brave, c'est dans le menu principal ou dans « Enregistrer et partager »). L'extension marche aussi dans cette fenêtre.

## Mettre à jour

1. Remplace les fichiers du dossier par ceux de la nouvelle version (garde le même dossier).
2. Sur `brave://extensions`, clique sur la flèche ronde **Actualiser** de la carte « Deezer Liquid Glass ».
3. Ferme et rouvre l'onglet Deezer.

Tes réglages (thème, fond, intensité…) sont gardés.

## Désinstaller

Sur `brave://extensions`, clique sur **Supprimer** sur la carte « Deezer Liquid Glass », puis supprime le dossier.

## Si ça ne marche pas

- **Rien ne change sur Deezer** : vérifie que l'extension est activée dans `brave://extensions`, que tu es bien sur `www.deezer.com`, puis ferme et rouvre l'onglet.
- **Un bouton « Erreurs » apparaît sur la carte de l'extension** : clique dessus et note le message.
- **Deezer a changé son interface** : le thème s'accroche à des repères internes de Deezer. Après une grosse mise à jour de leur côté, certaines parties peuvent perdre leur style jusqu'à une mise à jour du thème.
- **C'est lent** : baisse **Intensité du verre** dans le menu palette. Pour savoir si la lenteur vient du thème ou de Deezer, désactive l'extension un moment et compare.

## Confidentialité

L'extension tourne uniquement sur `www.deezer.com`. Elle n'envoie rien ailleurs. Les réglages sont stockés dans ton navigateur. Le bouton « Tout marquer comme lu » utilise la fonction interne de Deezer, avec ta propre session.

## Crédits

- **Idée, direction artistique et tests** : BateauTigre (Arthur Goubill) — https://github.com/BateauTigre
- **Design et code** : réalisés avec l'aide de Claude (Anthropic).
- **Police** : [Geist](https://vercel.com/font) par Vercel, sous licence SIL Open Font License, chargée depuis Google Fonts.
- **Deezer** est une marque de Deezer SA. Ce thème est un projet personnel, non officiel et non affilié à Deezer. Il ne modifie que l'affichage de la page dans ton navigateur.
