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

## Checklist
```
✅ A. Khi thêm cột mới (ColumnDef)
1️⃣ Có parse / serialize chưa?
 Field đã tồn tại trong Parsed model

 deserializeRow đọc đúng index / compound
 serializeRow ghi đúng lại raw row
⛔ Nếu thiếu → UI update xong nhưng reload mất dữ liệu

2️⃣ get & set có pure không?
 set không mutate object
 Luôn return { ...m, field: value }
⛔ Mutate → batch update sai hàng loạt

3️⃣ key có trùng không?
 key unique trong page
 Không dùng chung key cho 2 cột khác nghĩa
⛔ Trùng key → React render sai cell

4️⃣ input vs render
 Nếu là dropdown → KHÔNG set input
 Nếu có render → render tự xử lý update
⛔ Vừa input vừa render → double update

✅ B. Khi thêm Dropdown option mới
1️⃣ Option khai báo ở đâu?
 Chỉ khai báo trong lib/constants/options.ts
 Không khai báo trong buildColumns
⛔ Hard-code → duplicate & khó sync

2️⃣ Option value có liên tục không?
 Record<number, string>
 Không dùng string key "1" "2"
⛔ Dropdown hiển thị đúng nhưng set sai value

3️⃣ i18n key có đủ không?
 labels[key] tồn tại
 Có fallback hiển thị raw key
⛔ Thiếu i18n → dropdown trống

✅ C. Khi thêm batch action (Max / Reset / …)
1️⃣ Batch logic đặt ở đâu?
 Chỉ ở Page
 Không đặt trong component
⛔ Đặt trong component → reuse kém

2️⃣ Batch update có 1 lần writeAll?
 Dùng repo.batchUpdate
 Không loop gọi updateParsed
⛔ Loop update → performance kém + race condition

✅ D. Khi thêm page mới (JunYing, NongZ…)
 Dùng TableEditor
 Tạo buildXxxColumns
 Tạo useXxx / useXxxs
 Không copy-paste Member page
```
