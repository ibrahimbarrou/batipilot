# PILOTIS — Construction OS

> Le système d'exploitation des entreprises de BTP : une seule plateforme qui relie le terrain,
> le bureau et le client, de la prospection à la réception des travaux.

**Version web frontend uniquement.** Aucun backend : toutes les données sont simulées et servies
depuis `src/data`, avec des agrégats calculés à la volée.

---

## 1. La marque

| Élément | Choix |
|---|---|
| **Nom** | **PILOTIS** |
| **Pourquoi** | Les *pilotis* sont les pieux de fondation qui portent l'ouvrage — la structure invisible sans laquelle rien ne tient. Le mot contient *pilot* : piloter, diriger, garder le cap. Il est court, prononçable en français comme en anglais, disponible visuellement et immédiatement crédible dans le BTP. |
| **Signature** | *Construction OS* |
| **Promesse** | « Le terrain, le bureau et le client sur une seule plateforme. » |
| **Symbole** | Trois pilotis de hauteur croissante montant d'une semelle commune. Le plus haut est en orange chantier : le signal, l'action, le pilotage. |

Le logo vit dans [`src/components/brand/logo.tsx`](src/components/brand/logo.tsx) (`LogoMark`,
`Wordmark`), l'icône de navigateur dans [`src/app/icon.svg`](src/app/icon.svg).

---

## 2. Design system

Tout est déclaré en tokens dans [`src/app/globals.css`](src/app/globals.css) (Tailwind v4, `@theme`).
Aucune couleur n'est écrite en dur dans un composant.

### Palette

| Rôle | Échelle | Usage |
|---|---|---|
| **Marque** | `brand-50 → brand-950` (bleu profond, `#14428e` pivot) | actions principales, navigation active, séries de données |
| **Accent** | `signal-50 → signal-900` (orange chantier, `#ff6f1a`) | signal, ligne « aujourd'hui », éléments à remarquer |
| **Neutres** | `ink-50 → ink-950` | texte, bordures, surfaces |
| **Statuts** | `ok` (vert), `warn` (ambre), `risk` (rouge), `info` (bleu) | santé de chantier, validation, alertes — **jamais réutilisés comme couleur de série** |
| **Sémantique** | `canvas`, `surface`, `surface-2`, `line`, `line-strong` | fond d'application, cartes, séparateurs |

### Fondations

- **Typographie** : Inter (via `next/font`), chiffres tabulaires (`.tnum`) sur toute donnée financière.
- **Espacements** : base 4 px. **Rayons** : `xs 4` → `2xl 20`. **Ombres** : 5 niveaux, jamais lourdes.
- **Mouvement** : `--ease-out-quint`, `--ease-spring`, animations `fade-up` / `shimmer` / `pulse-ring`,
  neutralisées sous `prefers-reduced-motion`.
- **Utilitaires maison** : `surface-card`, `grid-blueprint` (trame de calque technique), `scrollbar-slim`,
  `stagger` (révélation progressive d'une grille), `skeleton`.

### Composants

`src/components/ui/` — boutons (9 variantes × 7 tailles), cartes, badges et badges métier
(`HealthBadge`, statuts facture / devis / commande / matériel), champs (input, textarea, select,
switch, checkbox, `Field`), onglets (pill et souligné), surcouches (dialog, dropdown, tooltip,
popover), tableaux, avatars et piles d'avatars, jauges linéaires et circulaires, séparateurs,
squelettes, états vides.

`src/components/shared/` — `KpiCard` / `HeroKpi`, `PageHeader` / `Toolbar`, vues projet
(carte, tableau, kanban, timeline, **Gantt**, **carte du portefeuille**), `PhotoScene`.

`src/components/charts/` — kit de visualisation : palette catégorielle **validée pour la vision
des couleurs** (écart CVD suffisant sur chaque paire adjacente), tooltip, légende, cadre de
graphique ; puis les graphiques eux-mêmes (tendance, trésorerie, marge, répartition, budget par
chantier, sparkline, entonnoir, jauge).

**Règles de dataviz appliquées** : un seul axe par graphique (jamais de double échelle), légende
dès deux séries, barres ≤ 24 px à extrémité arrondie, traits de 2 px, grille discrète horizontale
uniquement, texte toujours en encre (jamais en couleur de série), couleurs de statut réservées.

---

## 3. Architecture

```
src/
├── app/
│   ├── (auth)/                 connexion, mot de passe oublié, vérification OTP, choix du rôle
│   ├── (app)/                  console interne (barre latérale + barre supérieure)
│   │   ├── dashboard/          tableau de bord exécutif
│   │   ├── projets/            portefeuille + [id] fiche projet (7 onglets)
│   │   ├── chantiers/          journal, photos, incidents, géolocalisation
│   │   ├── finance/            pilotage, budgets, dépenses, factures, trésorerie
│   │   ├── devis/              liste + [id] devis imprimable et signature
│   │   ├── fournisseurs/       répertoire, bons de commande, évaluations
│   │   ├── materiel/           parc, stocks, maintenance, mouvements
│   │   ├── crm/                pipeline, opportunités, clients
│   │   ├── equipes/            effectif, présences, affectations
│   │   ├── messages/           messagerie, notifications, journal d'audit
│   │   ├── documents/          GED, échéances administratives
│   │   ├── reporting/          BI et exports
│   │   └── parametres/         entreprise, rôles, modules, intégrations, abonnement
│   ├── (client)/portail/       espace client en marque blanche (5 pages)
│   ├── icon.svg · not-found.tsx · layout.tsx
├── components/  brand · ui · layout · charts · shared
├── data/        org · clients · projects · finance · site · commerce · assets · feed · index (agrégats)
├── lib/         utils (formatage FCFA, dates FR) · nav · store (Zustand) · providers (React Query)
└── types/       modèle de domaine complet
```

**Conventions**

- Chaque route est un *server component* (`page.tsx`) qui exporte ses `metadata` et rend une vue
  cliente (`*-view.tsx`) quand il y a de l'interactivité. Les routes dynamiques (`projets/[id]`,
  `devis/[id]`) sont pré-générées via `generateStaticParams`.
- Les montants sont stockés en entier dans la plus petite unité de la devise et formatés par
  `formatMoney` / `formatMoneyCompact`. La date de référence du jeu de démonstration est figée
  (`TODAY = 2026-09-21`) pour que les écarts de planning restent stables.
- Aucun agrégat codé en dur : `portfolio`, `projectMarginRanking`, `upcomingDeadlines`,
  `healthBreakdown` sont calculés dans [`src/data/index.ts`](src/data/index.ts).

---

## 4. Données de démonstration

Entreprise fictive **Groupe SOGEBAT** (Douala, 214 collaborateurs, 4 agences) :

- **10 projets** — résidentiel, routes, VRD, rénovation hospitalière, industriel — répartis sur
  Douala, Yaoundé, Kribi et Abidjan, avec lots, tâches datées, jalons contractuels et registre de
  risques. Un chantier est en dérive critique (Yopougon, 17 points de retard), un autre en
  réception, un troisième clôturé.
- **8 clients** (promoteur, marchés publics, diaspora, entreprises), **18 collaborateurs**,
  **10 fournisseurs**, **9 bons de commande**, **12 factures clients**, **18 dépenses**,
  **10 rapports de chantier**, **7 incidents**, **14 équipements**, **12 articles de stock**,
  **12 opportunités**, **6 devis**, **14 documents**.

L'ensemble raconte une histoire cohérente : la marge s'érode de 3,1 points, 372 M FCFA d'impayés
publics pèsent sur la trésorerie, et le plan de rattrapage d'Abidjan se lit du tableau de bord
jusqu'au journal de chantier.

---

## 5. Stack

Next.js 15 (App Router) · TypeScript strict · Tailwind CSS v4 · composants Radix (shadcn/ui) ·
Recharts · Framer Motion · TanStack Query · Zustand · lucide-react.

---

## 6. Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production
npm run typecheck  # vérification TypeScript
```

**Parcours de démonstration conseillé**

1. `/login` → n'importe quel identifiant → `/choix-role` (l'interface s'adapte au rôle choisi).
2. `/dashboard` — la vue du dirigeant : alertes, trésorerie, rentabilité par chantier.
3. `/projets` — basculez entre cartes, liste, kanban, timeline, **Gantt** et **carte**.
4. `/projets/p-04` — le chantier en crise, onglet par onglet.
5. `/chantiers` — le journal terrain et les photos certifiées.
6. `/portail` — l'espace client, en marque blanche, tel que le voit la cliente à Paris.
7. `⌘K` / `Ctrl+K` — la palette de commandes, depuis n'importe quelle page.

---

## 7. Accessibilité et responsive

- Contraste AA minimum, focus visible sur tous les éléments interactifs, libellés explicites.
- Navigation clavier complète (palette de commandes, onglets, menus, dialogues Radix).
- Desktop prioritaire (jusqu'à 1600 px utiles), mise en page vérifiée jusqu'à 390 px de large,
  sans débordement horizontal : la barre latérale devient un tiroir, les grilles passent en
  colonne unique, les tableaux défilent horizontalement dans leur conteneur.
#   b a t i p i l o t  
 