# Album Photo Numérique

Un site web statique pour visualiser un album photo numérique avec des animations de pages qui se tournent.

## 🎯 Fonctionnalités

- **Page de garde** : La première image (1.png) s'affiche seule au démarrage
- **Animations fluides** : Effet de tournage de pages réaliste
- **Navigation multiple** :
  - Boutons Précédent/Suivant
  - Flèches du clavier (← →)
  - Swipe tactile sur mobile
- **Mode plein écran** : Pour une immersion totale
- **Interface responsive** : S'adapte à tous les écrans
- **Design moderne** : Interface élégante avec effets de transparence

## 📁 Structure des fichiers

```
Kdo Lilo/
├── index.html          # Page principale
├── styles.css          # Styles et animations
├── script.js           # Logique de navigation
├── README.md           # Ce fichier
└── images/             # Dossier des images
    ├── 1.png           # Page de garde
    ├── 2.png           # Page 2
    ├── 3.png           # Page 3
    └── ...             # Pages suivantes
```

## 🚀 Utilisation

1. **Ouvrir le site** : Double-cliquez sur `index.html` ou ouvrez-le dans votre navigateur
2. **Navigation** :
   - Cliquez sur les boutons "Précédent" et "Suivant"
   - Utilisez les flèches du clavier (← →)
   - Sur mobile : glissez horizontalement pour changer de page
3. **Plein écran** : Cliquez sur le bouton "Plein écran" ou appuyez sur F11
4. **Sortie** : Appuyez sur Échap pour quitter le plein écran

## 🎨 Personnalisation

### Ajouter des images
1. Placez vos images dans le dossier `images/`
2. Nommez-les numériquement (1.png, 2.png, 3.png, etc.)
3. Modifiez le nombre total de pages dans `script.js` (ligne 3)

### Modifier le style
- **Couleurs** : Modifiez les variables CSS dans `styles.css`
- **Animations** : Ajustez les durées dans `styles.css` et `script.js`
- **Layout** : Modifiez les dimensions dans `styles.css`

## 🔧 Compatibilité

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile (iOS Safari, Chrome Mobile)

## 📱 Fonctionnalités mobiles

- **Swipe** : Glissez horizontalement pour naviguer
- **Interface adaptée** : Boutons et texte optimisés pour le tactile
- **Performance** : Optimisé pour les appareils mobiles

## 🎭 Animations

- **Tournage de page** : Animation 3D réaliste
- **Transitions fluides** : Effets de fondu et de rotation
- **Feedback visuel** : Boutons avec effets hover
- **Chargement** : Indicateurs de chargement des images

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes avec animations
- **JavaScript ES6+** : Logique interactive
- **Responsive Design** : Adaptation automatique
- **Accessibilité** : Navigation au clavier et lecteurs d'écran

## 📝 Notes techniques

- **Images** : Format PNG recommandé pour la qualité
- **Taille** : Les images sont redimensionnées automatiquement
- **Performance** : Préchargement des images pour une navigation fluide
- **Sécurité** : Aucune dépendance externe, site 100% statique

---

*Créé avec ❤️ pour visualiser vos souvenirs numériques* 