# Importer des Équipes en Masse

## Vue d'ensemble

La fonctionnalité d'import en masse vous permet de créer plusieurs équipes et joueurs à partir d'un fichier Excel en quelques clics.

## Processus d'import

### 1️⃣ **Upload du fichier**
- Accédez à `/admin/teams` ou `/dashboard/org/[slug]/teams`
- Cliquez sur "Importer des équipes"
- Téléchargez un fichier Excel (.xlsx, .xls ou .csv)
- Un modèle est visible pour vous guider

### 2️⃣ **Configuration du mapping**
Le système détecte automatiquement les colonnes, mais vous pouvez les configurer:
- **Colonne nom d'équipe** (obligatoire): "Équipe", "Team", "SOCIETE"
- **Nom du joueur** (optionnel): "Joueur", "Player", "Nom", "Prenom"
- **Numéro** (optionnel): "Numéro", "Numero", "Number", "#"
- **Rôle** (optionnel): "Rôle", "Role", "Poste", "Position"

### 3️⃣ **Préview**
Avant de valider, vous voyez un aperçu:
- Nombre d'équipes qui seront créées
- Nombre de joueurs par équipe
- Détails des joueurs (nom, numéro, rôle)

### 4️⃣ **Validation et création**
Cliquez sur "Importer" pour créer les équipes et joueurs.

---

## Format du fichier Excel

### Structure recommandée

| Équipe | Joueur | Numéro | Rôle |
|--------|--------|--------|------|
| ES Gaming | Jean Dupont | 10 | Attaquant |
| ES Gaming | Paul Martin | 7 | Défenseur |
| ES Gaming | Marie Bernard | 1 | Gardien |
| Team Alpha | Pierre Dubois | 9 | Attaquant |
| Team Alpha | Luc Laurent | 5 | Défenseur |
| FC United | Thomas Petit | 11 | Attaquant |

**Explication:**
- Chaque ligne = un joueur dans une équipe
- **Équipe** = Nom unique de l'équipe (les joueurs avec la même valeur seront groupés)
- **Joueur** = Nom du joueur (crée automatiquement un joueur)
- **Numéro** et **Rôle** sont optionnels

### Colonnes simplement groupées

Si vous ne déclarez que la colonne **Équipe**, chaque valeur unique créera une équipe:

| Équipe | Description |
|--------|-------------|
| ES Gaming | Une équipe sera créée |
| Team Alpha | Une autre équipe |
| FC United | Troisième équipe |

**Résultat:** 3 équipes, 0 joueur

### Avec joueurs uniquement

| Équipe | Joueur |
|--------|--------|
| ES Gaming | Alice Bob Charlie |
| Team Alpha | Diana |

**Résultat:** 2 équipes, joueurs créés

---

## Cas d'usage

### Exemple 1: Équipes avec joueurs complets

```excel
| Équipe | Joueur | Numéro | Rôle |
|--------|--------|--------|------|
| FC Pro | Player 1 | 10 | Attaquant |
| FC Pro | Player 2 | 7 | Défenseur |
| FC Elite | Player 3 | 1 | Gardien |
```

**Résultat:** 
- ✅ FC Pro créée avec 2 joueurs
- ✅ FC Elite créée avec 1 joueur

### Exemple 2: Juste les équipes

```excel
| Équipe |
|--------|
| Team A |
| Team B |
| Team C |
```

**Résultat:** 3 équipes créées sans joueurs

---

## Fonctionnalités

✨ **Détection automatique:** Le système détecte les colonnes standards  
🔄 **Configuration flexible:** Mappez les colonnes comme vous le souhaitez  
👁️ **Préview:** Voyez exactement ce qui sera créé avant de valider  
⚡ **Création en masse:** Créez 100+ équipes en une seule opération  
✓ **Gestion des doublons:** Les équipes existantes ne seront pas recréées  
📊 **Rapport détaillé:** Voyez le nombre d'équipes et joueurs créés  

---

## Limites et règles

- ⚠️ La colonne **nom d'équipe** est obligatoire
- ⚠️ Les joueurs groupent par équipe (même nom = même équipe)
- ⚠️ Les slugs d'équipes sont générés automatiquement à partir du nom
- ⚠️ Les équipes avec le même slug ne seront pas recréées
- ⚠️ Maximum 10 000 lignes par fichier

---

## Troubleshooting

### Erreur: "Colonne non trouvée"
→ Vérifiez que vous avez bien sélectionné la colonne correcte

### Erreur: "Slug déjà utilisé"
→ Une équipe avec ce nom existe déjà

### Aucun joueur créé
→ Vérifiez que la colonne "Joueur" est correctement mappée

### Import incomplet avec erreurs
→ Les équipes valides seront créées même s'il y a des erreurs partielles

---

**Besoin d'aide?** Consultez le modèle dans l'interface ou contactez l'équipe support.
