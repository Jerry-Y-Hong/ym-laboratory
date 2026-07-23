# 03_ATOMIC_COMPONENT_LIBRARY.md

## Phase 28 – AI Frontend Design System (AFDS)

**Version** : v3.5.0  
**Status** : Closed & Frozen  
**Architecture Level** : Frontend UI Architecture Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Purpose

Specify the production-ready **Atomic Component Library Standards & React/TypeScript Interfaces** for the YM-LAB Enterprise Ecosystem. The library structures UI elements into Atomic Design levels (Atoms, Molecules, Organisms, Templates) to ensure maximum reusability, strict prop contracts, type safety, and seamless UI behavior across applications.

---

## 2. Component Taxonomy & Atomic Classification

```
┌────────────────────────────────────────────────────────────────────────┐
│                     ATOMIC DESIGN HIERARCHY                    │
├───────────────────┬───────────────────┬───────────────────┬────────────┤
│ ATOMS             │ MOLECULES         │ ORGANISMS         │ TEMPLATES  │
│ - Button          │ - FormFieldGroup  │ - NavigationBar   │ - Admin    │
│ - Input           │ - MetricCard      │ - EnterpriseTable │   Console  │
│ - Badge           │ - SearchBar       │ - AIStreamingView │ - AI Agent │
│ - Spinner         │ - ModalHeader     │ - PromptPanel     │   Studio   │
└───────────────────┴───────────────────┴───────────────────┴────────────┘
```

---

## 3. Core Component Specifications & TypeScript Schemas

### 3.1 Button Component (`<Button />`)

```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cyan-outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

```css
.afds-btn-primary {
  background: linear-gradient(135deg, var(--afds-color-emerald-500), var(--afds-color-emerald-600));
  color: #FFFFFF;
  font-weight: 600;
  border-radius: var(--afds-radius-md);
  padding: 10px 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.afds-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}
```

### 3.2 Metric Card Component (`<MetricCard />`)

```typescript
export interface MetricCardProps {
  title: string;
  value: string | number;
  changeRate?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  sparklineData?: number[];
}
```

### 3.3 Data Table Component (`<DataTable />`)

```typescript
export interface ColumnDef<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  pagination?: { pageSize: number; currentPage: number; totalCount: number };
  onSort?: (columnKey: keyof T, direction: 'asc' | 'desc') => void;
}
```

---

## 4. State & Event Handlers Standard

- **Controlled State Pattern**: Components emit immutable state changes via `onChange(value: T)` callbacks.
- **Uncontrolled Fallbacks**: Simple input controls maintain internal default states when `value` is omitted.
- **Form Integration**: Native integration with `React Hook Form` and `Zod` validation schemas.

---

## 5. Traceability & Cross-References

- [07_UI_UX_DESIGN_SYSTEM.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ABIDS/07_UI_UX_DESIGN_SYSTEM.md) - Component Visual Spec
- [02_DESIGN_TOKENS_SYSTEM.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/02_DESIGN_TOKENS_SYSTEM.md) - Design Tokens
- [01_AFDS_MASTER_STANDARD.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/01_AFDS_MASTER_STANDARD.md) - Master Architecture

---

## 6. Self Review & Validation

| Validation Item | Status | Result |
|---|---|---|
| Atomic Hierarchy | Atoms, Molecules, Organisms fully specified | PASS |
| Type Safety | Complete TypeScript interface contracts defined | PASS |
| Cross-Reference | Mapped to ABIDS & AFDS Tokens | PASS |

---

## 7. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.5.0 | 2026-07-22 | Antigravity (AI) | Initial release. Atomic Component Library specification created. |
