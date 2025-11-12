# AURA Application Design Guidelines

## Design Approach: Modern Data Application System

**Selected Approach:** Design System (Utility-Focused)

**Primary Inspiration:** Linear's clean interface + Notion's workspace feel + ChatGPT's conversational UI

**Justification:** AURA is a productivity tool focused on data analysis and report generation. Users need efficiency, clarity, and quick access to information. The design should prioritize data readability, clear action hierarchies, and minimal cognitive load while maintaining a professional, modern aesthetic.

---

## Core Design Principles

1. **Data First:** Information hierarchy favors content visibility over decorative elements
2. **Conversational Clarity:** Chat-like interface feels approachable yet professional
3. **Action Clarity:** Primary actions are always visually distinct and accessible
4. **Spatial Efficiency:** Maximize data visibility while maintaining breathing room

---

## Typography System

**Font Family:** Inter via Google Fonts (primary), system-ui fallback

**Scale:**
- Headings (H1): 2xl (24px), font-semibold
- Headings (H2): xl (20px), font-semibold  
- Body Large: base (16px), font-normal
- Body Standard: sm (14px), font-normal
- Labels/Captions: xs (12px), font-medium
- Table Headers: sm (14px), font-semibold
- Table Data: sm (14px), font-normal

**Line Heights:** relaxed (1.625) for body text, tight (1.25) for headings

---

## Layout & Spacing System

**Tailwind Units:** Use 2, 3, 4, 6, 8, 12, 16 as primary spacing values

**Container Structure:**
- Main container: max-w-7xl mx-auto with px-4 md:px-6 lg:px-8
- Chat area: max-w-4xl for optimal reading width
- Dashboard/Report area: full-width with internal max-w constraints per component

**Vertical Rhythm:**
- Section spacing: space-y-6 to space-y-8
- Component internal spacing: p-4 to p-6
- Card spacing: p-6 on desktop, p-4 on mobile
- Table cell padding: px-4 py-3

**Grid Systems:**
- Dashboard KPI cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
- Charts section: grid-cols-1 lg:grid-cols-2 gap-6
- Form fields: grid-cols-1 md:grid-cols-2 gap-4

---

## Component Library

### 1. Chat Interface Components

**Query Input Area:**
- Full-width container with rounded-lg border
- Textarea with min-h-24, resize-none
- Action buttons row below input: flex gap-3, justify-end
- Primary button (Generate Dashboard): larger size, filled style
- Secondary button (Generate Report): outlined style
- Input container shadow: subtle (shadow-sm), elevated on focus (shadow-md)

**Chat Message Bubbles:**
- User messages: align-right, max-w-3xl, rounded-2xl with rounded-br-sm
- System responses: align-left, max-w-full, minimal styling
- Spacing between messages: space-y-4

### 2. Data Table Components

**Table Structure:**
- Contained in rounded-lg card with border
- Header: sticky top-0, slightly elevated background
- Zebra striping: subtle alternating row backgrounds
- Cell alignment: text-left for text, text-right for numbers
- Responsive: horizontal scroll on mobile (overflow-x-auto)

**Table Controls:**
- Pagination bar: flex justify-between items-center, border-t, p-4
- "Go to page" dropdown: compact, inline
- "Items per page" selector: compact dropdown, right-aligned
- Navigation buttons: icon-only, circular, hover states

**Column Widths:**
- ID/Number columns: w-24
- Text columns: flex-1 with min-w-[150px]
- Action columns: w-32
- Status/Badge columns: w-40

### 3. Dashboard Components

**KPI Cards:**
- Aspect ratio: auto height based on content
- Structure: icon (top-left or top-center) + metric value (large) + label (small) + trend indicator
- Icon container: w-12 h-12, rounded-lg, centered icon
- Metric value: text-3xl font-bold
- Card elevation: shadow-sm with hover:shadow-md transition

**Chart Containers:**
- Aspect ratio: Maintain 16:9 for horizontal charts, 4:3 for compact
- Padding: p-6 for card wrapper
- Chart canvas: h-64 to h-80 depending on importance
- Title above chart: text-lg font-semibold mb-4
- Legend: bottom or right-aligned, text-xs

### 4. Modal Components

**Email Compose Modal:**
- Overlay: backdrop with blur effect (backdrop-blur-sm)
- Modal container: max-w-2xl, rounded-lg, shadow-2xl
- Header: border-b, flex justify-between items-center, p-6
- Form body: p-6, space-y-4
- Footer: border-t, flex justify-end gap-3, p-6
- Input fields: full-width, rounded-md, border, px-4 py-2
- Text area (Body): min-h-40, resize-vertical

**Modal Behavior:**
- Center-screen positioning
- Smooth transitions (transition-all duration-200)
- Click outside overlay to close
- ESC key support (implementation detail)

### 5. Feedback & Action Components

**Feedback Section:**
- Centered text with icon buttons: flex items-center justify-center gap-4
- Question text: text-base font-medium
- Thumbs icons: w-8 h-8, cursor-pointer, hover scale effect
- Margin above: mt-8, below table

**Action Button Group (Post-Feedback):**
- Flex layout: flex flex-wrap gap-3, justify-center
- Button sizes: consistent height (h-10 to h-11)
- Icon + text buttons: gap-2 between icon and label
- Hierarchy: filled primary, outlined secondary, ghost tertiary

### 6. Recent Activities Sidebar/Section

**Layout:**
- Positioned: side panel (w-80 border-l) OR bottom section (full-width)
- Container: divide-y for item separation
- Header: text-sm font-semibold uppercase tracking-wide, p-4

**Activity Items:**
- Padding: p-4
- Hover state: subtle background change, cursor-pointer
- Structure: timestamp (text-xs, muted) + query text (text-sm, truncate) + generated type badge
- Badge: inline-flex, rounded-full, px-2 py-1, text-xs

---

## Animation Guidelines

**Minimal Animation Strategy:**
- Modal entrance: fade + scale (duration-200)
- Table loading: skeleton loaders with pulse
- Button interactions: scale-95 on active
- Page transitions: fade only
- Chart rendering: no animations, instant display
- Avoid scroll-triggered animations entirely

---

## Accessibility Standards

- Consistent focus indicators: ring-2 ring-offset-2 on all interactive elements
- Keyboard navigation: Tab order follows visual hierarchy
- Form labels: Always visible, not placeholder-dependent
- Icon buttons: Include aria-label attributes
- Table headers: Proper th elements with scope attributes
- Contrast ratios: Ensure WCAG AA compliance (4.5:1 minimum)

---

## Responsive Breakpoints

- Mobile: < 768px (single column layouts, stacked cards, simplified tables)
- Tablet: 768px - 1024px (2-column grids, compact spacing)
- Desktop: > 1024px (full multi-column layouts, expanded spacing)

**Mobile Adaptations:**
- Hide non-essential table columns, show "View More" button
- Stack dashboard cards vertically
- Reduce chart heights (h-48 on mobile vs h-80 desktop)
- Simplify pagination to Previous/Next only

---

## Images

**No hero images required** - this is a functional application, not a marketing site. Focus on data visualization and UI clarity.

**Icon Usage:**
- Use Heroicons (via CDN) throughout
- Icon sizes: w-5 h-5 for inline, w-6 h-6 for buttons, w-12 h-12 for KPI cards
- Consistent stroke-width across all icons