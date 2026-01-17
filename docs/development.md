## Data Storage Architecture
```
LocalStorage (uploadedJson)
  │
  ▼
┌───────────────────────────┐
│  gameData.model.ts        │  ← MODEL LAYER
│  - schema-aware read/write│
│  - column + sub-column    │
└───────────────────────────┘
  │
  ▼
┌───────────────────────────┐
│  BaseRepository.ts        │  ← REPOSITORY LAYER
│  - CRUD via model         │
│  - no LocalStorage logic  │
└───────────────────────────┘
  │
  ▼
┌───────────────────────────┐
│  Generated Repositories   │  ← AUTO-GENERATED
│  - per key                │
│  - per column/subcolumn   │
└───────────────────────────┘
```

## Directory Structure

```
lib/
 ├─ types/
 │   └─ table.tsx          ← ColumnDef<T>
 ├─ constants/
 │   └─ options.tsx        ← SKILL / TALENT / HOBBY
 ├─ components/
 │   ├─ table/
 │   │   ├─ InputCell.tsx
 │   │   └─ DropdownCell.tsx
 │   └─ button/
 │       └─ MaxAttributeButton.tsx
 ├─ columns/
 │   ├─ memberNow.tsx
 │   └─ memberQu.tsx
 └─ hooks/
    ├─ useMemberNow.tsx     ← useTableEditor + useRowEditor
    └─ useMemberQu.tsx      ← useTableEditor + useRowEditor
```

```
useTableEditor  → quản lý list (indexes)
useRowEditor    → quản lý 1 row
TableEditor     → layout
ColumnDef       → mapping UI ↔ model

```
