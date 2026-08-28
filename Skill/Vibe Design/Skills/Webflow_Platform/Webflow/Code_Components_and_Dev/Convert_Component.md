---
title: "Webflow Skill: Convert Component"
tags: [webflow, mcp, skill, convert-component]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Convert Component

> **Имя скилла:** `convert-component`  
> **Локальный путь:** `/root/.agent/skills/convert-component/SKILL.md`

---

# Convert Component

Convert an existing React component into a Webflow Code Component by analyzing its structure and generating the appropriate `.webflow.tsx` definition file.

## When to Use This Skill

**Use when:**
- User has an existing React component they want to use in Webflow
- User asks to "convert", "adapt", or "make this work with Webflow"
- User provides a React component file and wants a Webflow definition
- User is migrating components from another React project

**Do NOT use when:**
- Creating a component from scratch (use component-scaffold)
- User just wants to understand code components (answer directly)
- Component is already a Webflow code component (use component-audit)

## Instructions

### Phase 1: Analyze Existing Component

1. **Read the React component file**: Get the full source code

2. **Extract component information**:
   - Component name (function/const name)
   - Props interface or type definition
   - Each prop's TypeScript type
   - Default values if defined
   - Whether component uses `children`

3. **Identify incompatible patterns**:

   | Pattern | Issue | Resolution |
   |---------|-------|------------|
   | React Context usage | Context doesn't work across Webflow components | Refactor to props or use nano stores |
   | `window`/`document` in render | SSR will fail | Wrap in useEffect or set `ssr: false` |
   | `localStorage`/`sessionStorage` in render | SSR will fail | Wrap in useEffect or set `ssr: false` |
   | Complex object props | Can't map to Webflow prop types | Break into individual props |
   | Function props (callbacks) | Not supported in Webflow | Remove or internalize logic |
   | `useContext` hook | Won't work across components | Use alternative state patterns |
   | External CSS imports | May not work in Shadow DOM | Import in .webflow.tsx instead |
   | CSS class references to global styles | Won't work in Shadow DOM | Use component-scoped styles |
   | styled-components | Needs Shadow DOM decorator | Set up globals.ts with decorator |
   | Emotion (@emotion/styled) | Needs Shadow DOM decorator | Set up globals.ts with decorator |

4. **Detect styling approach** and note required setup:

   **If using styled-components:**
   ```bash
   npm i @webflow/styled-components-utils styled-components
   ```

   Create/update `globals.ts`:
   ```typescript
   import { styledComponentsShadowDomDecorator } from "@webflow/styled-components-utils";
   export const decorators = [styledComponentsShadowDomDecorator];
   ```

   **If using Emotion:**
   ```bash
   npm i @webflow/emotion-utils @emotion/cache @emotion/react
   ```

   Create/update `globals.ts`:
   ```typescript
   import { emotionShadowDomDecorator } from "@webflow/emotion-utils";
   export const decorators = [emotionShadowDomDecorator];
   ```

   **For both CSS-in-JS approaches**, update `webflow.json`:

   styled-components:
   ```json
   {
     "library": {
       "globals": "./src/globals.ts",
       "renderer": {
         "server": "@webflow/styled-components-utils/server"
       }
     }
   }
   ```

   Emotion:
   ```json
   {
     "library": {
       "globals": "./src/globals.ts",
       "renderer": {
         "server": "@webflow/emotion-utils/server"
       }
     }
   }
   ```

5. **Flag any dependencies** that might cause issues:
   - Large libraries (bundle size concern)
   - Browser-only libraries
   - Libraries that manipulate DOM directly

### Phase 2: Map Props to Webflow Types

6. **Apply TypeScript → Webflow prop type mapping**:

   | TypeScript Type | Webflow Prop | Notes |
   |-----------------|--------------|-------|
   | `string` | `props.Text()` | Default for short text |
   | `string` (long/HTML content) | `props.RichText()` | If prop name suggests content/body/description |
   | `React.ReactNode` / `children` | `props.Slot()` | For nested content |
   | `number` | `props.Number()` | Numeric values |
   | `boolean` | `props.Boolean()` | Toggles |
   | `"option1" \| "option2"` | `props.Variant()` | String literal unions (requires `options` array) |
   | `enum` | `props.Variant()` | Convert enum values to `options` array (required) |
   | `{ href: string; ... }` | `props.Link()` | Returns `{ href, target?, preload? }` object — may need wrapper if component expects separate `href`/`target` props |
   | Image-related types | `props.Image()` | Image src, url, etc. |
   | `string` (canvas-editable text) | `props.TextNode()` | For text editable directly on canvas; has `multiline` param |
   | `boolean` (show/hide) | `props.Visibility()` | Semantic show/hide toggle |
   | `string` (for HTML id) | `props.Id()` | If prop is named "id" or used for accessibility |
   | Complex objects | **SPLIT** | Break into multiple simple props |
   | Functions/callbacks | **REMOVE** | Not supported |
   | Arrays | **SPECIAL** | May need component redesign |

7. **Handle special cases**:

   **Complex object props** - Break them down:
   ```typescript
   // Original
   interface Props {
     author: {
       name: string;
       avatar: string;
       bio: string;
     }
   }

   // Converted to flat props
   props: {
     authorName: props.Text({ name: "Author Name" }),
     authorAvatar: props.Image({ name: "Author Avatar" }),
     authorBio: props.RichText({ name: "Author Bio" })
   }
   ```

   **Union types with more than simple strings**:
   ```typescript
   // Original - complex union
   type Size = "sm" | "md" | "lg" | { width: number; height: number };

   // Convert to Variant with only string options
   size: props.Variant({
     name: "Size",
     options: ["sm", "md", "lg", "custom"],
     defaultValue: "md"
   })
   // Note: Custom size would need additional Number props
   ```

   **Optional props** - Provide defaultValue for prop types that support it. Note: Link, Image, Slot, and Id do not accept defaultValue.
   ```typescript
   // Original
   interface Props {
     title?: string;
   }

   // Converted - provide default for types that support it
   title: props.Text({
     name: "Title",
     defaultValue: ""  // Empty string or sensible default
   })
   ```

### Phase 3: Check Project Setup

8. **Verify Webflow setup exists**:
   - Check for `webflow.json` in project root
   - Check for required dependencies (@webflow/webflow-cli, @webflow/data-types, @webflow/react)
   - If using styled-components/Emotion, check for decorator packages
   - If missing, offer to set up or direct to local-dev-setup skill

9. **Determine file locations**:
   - Identify where the original component lives
   - Determine where `.webflow.tsx` should be created (same directory)
   - Check for existing styles that need to be imported

### Phase 4: Generate Definition File

10. **Create the `.webflow.tsx` file**:

```typescript
import { declareComponent } from "@webflow/react";
import { props } from "@webflow/data-types";
import { ComponentName } from "./ComponentName";
// Import styles if they exist
import "./ComponentName.module.css"; // or .css

export default declareComponent(ComponentName, {
  name: "ComponentName",
  description: "[Generated from component purpose]",
  group: "[Appropriate category]",
  props: {
    // Mapped props here
  },
  // decorators: [], // Optional — per-component decorators (e.g., for CSS-in-JS Shadow DOM support)
  options: {
    applyTagSelectors: true, // Default is false. Set to true to apply Webflow's tag selectors (e.g., h1, p styles) inside the component.
    ssr: true // or false if browser APIs detected
  }
});
```

11. **Provide the complete file** with all props mapped

### Phase 5: Document Required Changes

12. **List modifications needed** to the original component:

```markdown
## Required Changes to [ComponentName].tsx

### Must Fix (Component won't work without these):
- [ ] Issue 1: [Description and how to fix]
- [ ] Issue 2: [Description and how to fix]

### Recommended (Will improve Webflow integration):
- [ ] Recommendation 1
- [ ] Recommendation 2

### Props Mapping Summary:
| Original Prop | Webflow Prop | Notes |
|---------------|--------------|-------|
| title: string | props.Text() | Direct mapping |
| isOpen: boolean | props.Boolean() | Direct mapping |
| data: object | SPLIT → dataTitle, dataValue | Flattened |
| onClick: function | REMOVED | Not supported |
```

13. **Provide modified component code** if changes are needed:
    - Show the updated TypeScript interface
    - Show any useEffect wrappers needed for SSR
    - Show style import changes
    - Note CSS-in-JS setup requirements if applicable

## Examples

### Example 1: Simple Component Conversion

**User prompt:**
```
Convert this React component to work with Webflow:

// TestimonialCard.tsx
interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorTitle?: string;
  rating?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  authorName,
  authorTitle = "",
  rating = 5
}) => {
  return (
    <div className="testimonial-card">
      <div className="stars">{"★".repeat(rating)}</div>
      <blockquote>{quote}</blockquote>
      <div className="author">
        <strong>{authorName}</strong>
        {authorTitle && <span>{authorTitle}</span>}
      </div>
    </div>
  );
};
```

**Response:**

```markdown
## Component Analysis: TestimonialCard

### Props Detected:
| Prop | TypeScript Type | Webflow Mapping |
|------|-----------------|-----------------|
| quote | string | props.Text() |
| authorName | string | props.Text() |
| authorTitle | string (optional) | props.Text() |
| rating | number (optional) | props.Number() |

### Issues Found:
- **CSS class "testimonial-card"** - Uses global class that won't work in Shadow DOM
  - Fix: Convert to CSS Modules or import scoped styles

### No blocking issues - ready to convert!

---

## Generated Files

### TestimonialCard.webflow.tsx
```typescript
import { declareComponent } from "@webflow/react";
import { props } from "@webflow/data-types";
import { TestimonialCard } from "./TestimonialCard";
import "./TestimonialCard.module.css";

export default declareComponent(TestimonialCard, {
  name: "TestimonialCard",
  description: "Display customer testimonials with rating stars",
  group: "Display",
  props: {
    quote: props.Text({
      name: "Quote",
      defaultValue: "This product changed my life!"
    }),
    authorName: props.Text({
      name: "Author Name",
      defaultValue: "Jane Doe"
    }),
    authorTitle: props.Text({
      name: "Author Title",
      defaultValue: "CEO, Company"
    }),
    rating: props.Number({
      name: "Rating",
      defaultValue: 5,
      min: 1,
      max: 5
    })
  },
  options: {
    applyTagSelectors: true,
    ssr: true
  }
});
```

### Required Changes to TestimonialCard.tsx

1. **Convert to CSS Modules** - Rename `TestimonialCard.css` to `TestimonialCard.module.css` and update imports:

```typescript
import styles from "./TestimonialCard.module.css";

// Default CSS Modules uses bracket notation:
<div className={styles["testimonial-card"]}>
<div className={styles["stars"]}>
// Dot notation (styles.testimonialCard) requires camelCase class names
// or a webpack override for css-loader.
```

### Setup Check
- [ ] Verify webflow.json exists
- [ ] Install dependencies if needed: `npm i --save-dev @webflow/webflow-cli @webflow/data-types @webflow/react`
```

---

### Example 2: Component with Incompatible Patterns

**User prompt:**
```
Make this work as a Webflow code component:

// Modal.tsx
import { createContext, useContext, useState } from 'react';

const ModalContext = createContext<{ isOpen: boolean; toggle: () => void } | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
};

interface ModalProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ trigger, children, onOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState && onOpen) onOpen();
    if (!newState && onClose) onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <ModalContext.Provider value={{ isOpen, toggle }}>
      <div onClick={toggle}>{trigger}</div>
      {isOpen && (
        <div className="modal-overlay" onClick={toggle}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
```

**Response:**

```markdown
## Component Analysis: Modal

### Issues Found:

| Issue | Severity | Resolution |
|-------|----------|------------|
| React Context (ModalContext) | Critical | Context won't work across Webflow components. Since this is internal to Modal, it's OK but exported useModal hook won't work. |
| document.body manipulation | Critical | SSR incompatible. Must set `ssr: false` or wrap in useEffect check. |
| onOpen/onClose callbacks | Warning | Function props not supported in Webflow. Must remove. |
| Global CSS classes | Warning | "modal-overlay", "modal-content" won't work in Shadow DOM. |

### Props Detected:
| Prop | TypeScript Type | Webflow Mapping | Status |
|------|-----------------|-----------------|--------|
| trigger | React.ReactNode | props.Slot() | OK |
| children | React.ReactNode | props.Slot() | OK |
| onOpen | function | REMOVE | Not supported |
| onClose | function | REMOVE | Not supported |

---

## Required Changes

### 1. Remove function props (onOpen, onClose)
These cannot be passed from Webflow Designer. Remove from interface and component.

### 2. Fix SSR issue with document.body
Either set `ssr: false` or add typeof check:

```typescript
useEffect(() => {
  if (typeof document === 'undefined') return;
  // ... rest of effect
}, [isOpen]);
```

### 3. Convert to CSS Modules
Rename styles and update class references.

### 4. Remove exported useModal hook
This won't work for external components. Keep ModalContext internal only.

---

## Generated Files

### Modal.webflow.tsx
```typescript
import { declareComponent } from "@webflow/react";
import { props } from "@webflow/data-types";
import { Modal } from "./Modal";
import "./Modal.module.css";

export default declareComponent(Modal, {
  name: "Modal",
  description: "Overlay modal dialog with trigger element",
  group: "Interactive",
  props: {
    trigger: props.Slot({
      name: "Trigger"
    }),
    children: props.Slot({
      name: "Content"
    })
  },
  options: {
    applyTagSelectors: true,
    ssr: false  // Required due to document.body usage
  }
});
```

### Updated Modal.tsx
```typescript
import { useState, useEffect } from 'react';
import styles from "./Modal.module.css";

interface ModalProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  // Removed: onOpen, onClose - not supported in Webflow
}

export const Modal: React.FC<ModalProps> = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div onClick={toggle}>{trigger}</div>
      {isOpen && (
        <div className={styles["overlay"]} onClick={toggle}>
          <div className={styles["content"]} onClick={e => e.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </>
  );
};
```

### Setup Required
```bash
npm i --save-dev @webflow/webflow-cli @webflow/data-types @webflow/react
```
```

---

### Example 3: Component with Complex Object Props

**User prompt:**
```
Convert to Webflow:

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'electronics' | 'clothing' | 'home';
}

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
}

export const ProductCard = ({ product, showBadge = true }: ProductCardProps) => (
  <div>
    <img src={product.image} alt={product.name} />
    {showBadge && <span>{product.category}</span>}
    <h3>{product.name}</h3>
    <p>${product.price}</p>
  </div>
);
```

**Response:**

```markdown
## Component Analysis: ProductCard

### Complex Props Detected:

The `product` prop is a complex object that must be flattened for Webflow:

| Original | Flattened Props |
|----------|-----------------|
| product.id | (Not needed in UI - remove) |
| product.name | productName: props.Text() |
| product.price | productPrice: props.Number() |
| product.image | productImage: props.Image() |
| product.category | productCategory: props.Variant() |
| showBadge | showBadge: props.Boolean() |

---

## Generated Files

### ProductCard.webflow.tsx
```typescript
import { declareComponent } from "@webflow/react";
import { props } from "@webflow/data-types";
import { ProductCard } from "./ProductCard";
import "./ProductCard.module.css";

export default declareComponent(ProductCard, {
  name: "ProductCard",
  description: "Product display card with image, name, price, and category",
  group: "Display",
  props: {
    productName: props.Text({
      name: "Product Name",
      defaultValue: "Product Title"
    }),
    productPrice: props.Number({
      name: "Price",
      defaultValue: 29.99
    }),
    productImage: props.Image({
      name: "Product Image"
    }),
    productCategory: props.Variant({
      name: "Category",
      options: ["electronics", "clothing", "home"],
      defaultValue: "electronics"
    }),
    showBadge: props.Boolean({
      name: "Show Category Badge",
      defaultValue: true
    })
  },
  options: {
    applyTagSelectors: true,
    ssr: true
  }
});
```

### Updated ProductCard.tsx
```typescript
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  productName: string;
  productPrice: number;
  productImage?: { src: string; alt?: string };
  productCategory: 'electronics' | 'clothing' | 'home';
  showBadge?: boolean;
}

export const ProductCard = ({
  productName,
  productPrice,
  productImage,
  productCategory,
  showBadge = true
}: ProductCardProps) => (
  <div className={styles["card"]}>
    {productImage && (
      <img src={productImage.src} alt={productImage.alt || productName} />
    )}
    {showBadge && <span className={styles["badge"]}>{productCategory}</span>}
    <h3>{productName}</h3>
    <p>${productPrice.toFixed(2)}</p>
  </div>
);
```

### Migration Notes:
- The `product` object has been flattened into individual props
- Each prop is now directly editable in Webflow Designer
- `product.id` was removed as it's not displayed in the UI
- Image prop now uses Webflow's Image type (provides { src, alt })
```

---

### Example 4: Component with styled-components

**User prompt:**
```
Convert this styled-components React component to Webflow:

// Button.tsx
import styled from 'styled-components';

const StyledButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  background: ${props => props.variant === 'primary' ? '#3b82f6' : '#e5e7eb'};
  color: ${props => props.variant === 'primary' ? 'white' : '#1f2937'};

  &:hover {
    opacity: 0.9;
  }
`;

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button = ({ label, variant = 'primary', disabled = false }: ButtonProps) => (
  <StyledButton variant={variant} disabled={disabled}>
    {label}
  </StyledButton>
);
```

**Response:**

```markdown
## Component Analysis: Button

### Styling Approach Detected: styled-components

styled-components requires a Shadow DOM decorator to work in Webflow.

### Props Detected:
| Prop | TypeScript Type | Webflow Mapping |
|------|-----------------|-----------------|
| label | string | props.Text() |
| variant | 'primary' \| 'secondary' | props.Variant() |
| disabled | boolean | props.Boolean() |

### No blocking issues - ready to convert!

---

## Required Setup for styled-components

**1. Install dependencies:**
```bash
npm i @webflow/styled-components-utils styled-components
npm i -D @types/styled-components
```

**2. Create/update `src/globals.ts`:**
```typescript
import { styledComponentsShadowDomDecorator } from "@webflow/styled-components-utils";
export const decorators = [styledComponentsShadowDomDecorator];
```

**3. Update `webflow.json`:**
```json
{
  "library": {
    "name": "My Library",
    "components": ["./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"],
    "globals": "./src/globals.ts"
  }
}
```

---

## Generated Files

### Button.webflow.tsx
```typescript
import { declareComponent } from "@webflow/react";
import { props } from "@webflow/data-types";
import { Button } from "./Button";
// No CSS import needed - styled-components handles styles

export default declareComponent(Button, {
  name: "Button",
  description: "Styled button with primary and secondary variants",
  group: "Interactive",
  props: {
    label: props.Text({
      name: "Label",
      defaultValue: "Click me"
    }),
    variant: props.Variant({
      name: "Variant",
      options: ["primary", "secondary"],
      defaultValue: "primary"
    }),
    disabled: props.Boolean({
      name: "Disabled",
      defaultValue: false,
      trueLabel: "Disabled",
      falseLabel: "Enabled"
    })
  },
  options: {
    applyTagSelectors: true,
    ssr: true
  }
});
```

### No changes needed to Button.tsx
The component can remain as-is. The styled-components decorator in globals.ts will handle Shadow DOM style injection automatically.

### Setup Checklist
- [ ] Install @webflow/styled-components-utils
- [ ] Create globals.ts with decorator
- [ ] Update webflow.json to reference globals
- [ ] Deploy with `npx webflow library share`
```

## Guidelines

### When to Recommend Component Redesign

Some components fundamentally don't fit the Webflow model:

1. **Heavy Context usage**: If component relies on app-wide context, suggest redesign
2. **Complex state machines**: May need simplification
3. **Tightly coupled components**: Each needs to be independent in Webflow
4. **Components that render portals**: Consider if portal is necessary

### Default Value Strategy

Always provide sensible defaults:
- Text props: Representative example text
- Numbers: Common/typical value
- Booleans: Most common use case
- Variants: Most popular option
- Images: Can be undefined (optional)
- Slots: No default needed

### Props Naming for Webflow

Make prop names designer-friendly:
- Use descriptive names: `buttonText` not `txt`
- Avoid abbreviations: `imageSource` not `imgSrc`
- Group related props with prefixes: `authorName`, `authorAvatar`, `authorBio`

### SSR Decision

Set `ssr: false` if component:
- Accesses `window`, `document`, `navigator`
- Uses `localStorage` or `sessionStorage`
- Manipulates DOM directly
- Uses libraries that require browser APIs
- Renders canvas, WebGL, or maps