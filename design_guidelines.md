# CodeTolzy AI - Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based with VS Code Inspiration + Modern SaaS Patterns

Drawing from VS Code's professional code editor aesthetic combined with Linear's clean typography and Stripe's refined component design. The application balances technical functionality with approachable SaaS aesthetics.

**Core Principles:**
- Professional developer tool aesthetic with modern polish
- Clear information hierarchy for complex interfaces
- Efficient use of space without clutter
- Smooth, purposeful interactions

---

## Typography System

**Font Families:**
- Primary: Inter (400, 500, 600, 700)
- Code/Monospace: JetBrains Mono (400, 500)

**Hierarchy:**
- Hero Headline: text-5xl md:text-6xl font-bold tracking-tight
- Section Headlines: text-3xl md:text-4xl font-bold
- Subsection Titles: text-2xl font-semibold
- Card/Component Headers: text-lg font-semibold
- Body Text: text-base leading-relaxed
- UI Labels: text-sm font-medium
- Helper Text: text-xs
- Code Display: font-mono text-sm

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, and 16
- Micro spacing (gaps, padding): p-2, gap-2
- Standard spacing: p-4, m-4, gap-4
- Component spacing: p-6, m-6
- Section spacing: p-8, py-12, py-16
- Large separations: py-20, py-24

**Container Structure:**
- Full-width sections: w-full
- Content containers: max-w-7xl mx-auto px-4 md:px-6
- Narrow content: max-w-4xl mx-auto
- Text blocks: max-w-3xl

**Grid Systems:**
- Feature grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Pricing cards: grid-cols-1 md:grid-cols-2 gap-8
- History items: space-y-4

---

## Page-Specific Layouts

### Home Page
**Hero Section:**
- Full viewport height (min-h-screen) with centered content
- Logo and navigation at top (h-16)
- Large headline with tagline beneath
- CTA buttons in horizontal flex layout (gap-4)
- Animated code snippet preview or terminal window mockup below headline
- Gradient mesh or subtle grid pattern background

**Features Section:**
- 3-column grid showcasing: AI Code Generation, Monaco Editor, Multi-language Support
- Each feature card with icon (w-12 h-12), title, and description
- py-20 section padding

**How It Works Section:**
- 3-step process in horizontal cards (numbered 1-2-3)
- Icon + Title + Description format
- Connecting lines or arrows between steps on desktop

**Pricing Preview:**
- 2-column grid (Free vs Pro)
- Highlight Pro plan with border treatment
- CTA at bottom: "View Full Pricing"

### Editor Interface (Main Application)
**Layout Structure:**
- Fixed header bar (h-14): Logo, language selector, usage counter, theme toggle, user avatar
- Split-pane layout below header:
  - Chat Panel: w-80 lg:w-96 (collapsible sidebar on left)
  - Code Editor: flex-1 (Monaco Editor fills remaining space)
  - History Panel: w-72 (collapsible sidebar on right, optional)

**Chat Panel:**
- Scrollable message area with flex-1
- Input at bottom (sticky)
- Message bubbles with rounded-2xl corners
- User messages align right, AI messages align left
- Code snippets in messages use rounded-lg cards with copy button

**Editor Controls Bar:**
- Positioned above Monaco Editor (h-12)
- Buttons: Copy Code, Download, Clear, Save (gap-2)
- Language selector dropdown on right

**History Panel:**
- List of saved code snippets
- Each item: rounded-lg card with title, timestamp, language badge
- Click to load into editor

### Docs Page
- Sidebar navigation (w-64) with collapsible sections
- Main content area: max-w-4xl with generous line-height
- Code examples in rounded-lg containers
- Table of contents sticky on scroll (lg screens)
- Section anchors for deep linking

### Pricing Page
- Hero: centered headline + subheadline
- 2-column comparison grid (Free vs Pro)
- Feature comparison table below
- FAQ section at bottom (accordion format)
- Sticky CTA bar for mobile

### Dashboard (Future)
- Stats cards in 3-column grid at top
- Recent codes table below
- Usage chart (line or bar graph)
- Account settings in tabs

---

## Component Library

### Buttons
**Primary CTA:**
- rounded-lg with px-6 py-3
- font-medium text-base
- Includes arrow or icon (→) with gap-2
- Shadow: shadow-lg

**Secondary:**
- rounded-lg with px-6 py-3
- Border with transparent background
- Same sizing as primary

**Icon Buttons:**
- rounded-md with p-2
- Icon size: w-5 h-5
- Used in editor toolbar

**Button Groups:**
- Flex row with gap-2
- Wrap on mobile (flex-wrap)

### Cards
**Feature Cards:**
- rounded-xl with p-6
- Shadow: shadow-md
- Icon at top (w-10 h-10)
- Title (text-xl font-semibold) + Description (text-sm)
- Hover: translate-y-1 transition

**Pricing Cards:**
- rounded-2xl with p-8
- Border width: border-2
- Price display: text-5xl font-bold
- Feature list with checkmarks (space-y-3)
- CTA button at bottom (mt-8)

**Code History Cards:**
- rounded-lg with p-4
- Truncated code preview (font-mono text-xs)
- Metadata row: language badge + timestamp
- Actions: Load, Delete icons

### Navigation
**Top Navigation:**
- Fixed header: h-16 with border-b
- Container: max-w-7xl mx-auto px-6
- Logo on left (flex items-center gap-2)
- Desktop menu: flex gap-8 (hidden on mobile)
- Mobile: Hamburger menu button
- Right side: Theme toggle + CTA button

**Mobile Menu:**
- Full-screen overlay when open
- Centered menu items (space-y-6)
- Slide-in animation from right

### Forms & Inputs
**Text Input (Chat):**
- rounded-lg with px-4 py-3
- Border with focus ring
- Placeholder text: text-sm
- Submit button integrated on right

**Dropdown/Select:**
- rounded-md with px-4 py-2
- Chevron icon on right
- Custom styled dropdown menu

**Code Language Selector:**
- Compact dropdown in editor toolbar
- Icon + language name
- Dropdown shows all supported languages with icons

### Monaco Editor Integration
- Full height of available space (h-full)
- Rounded corners: rounded-lg (apply to container)
- Custom theme matching application design
- Line numbers enabled
- Minimap on by default (collapsible)

### Chat Messages
**User Message:**
- Max-width: max-w-md ml-auto
- rounded-2xl rounded-br-sm (chat bubble effect)
- px-4 py-3
- Timestamp below (text-xs)

**AI Message:**
- Max-width: max-w-md mr-auto
- rounded-2xl rounded-bl-sm
- px-4 py-3
- Code blocks: nested rounded-lg container with syntax highlighting
- Copy button in top-right of code blocks

### Modals & Overlays
**Settings Modal:**
- Centered overlay with backdrop blur
- rounded-xl with p-6
- Max-width: max-w-lg
- Close button (×) in top-right

**History Sidebar:**
- Slide-in panel from right
- Full height with overflow-y-auto
- Close button at top

### Badges & Labels
**Language Badge:**
- rounded-full with px-3 py-1
- text-xs font-medium
- Icon + text (gap-1.5)

**Usage Counter:**
- Pill shape: rounded-full px-4 py-1.5
- Shows: "8/10 requests remaining"
- Different treatment when near limit

**Status Indicators:**
- Small dot (w-2 h-2 rounded-full)
- "Generating..." with animated pulse

---

## Animations

**Use Sparingly - Only Where Valuable:**

**Page Transitions:**
- Fade in content: opacity 0 to 1 over 300ms
- Slide up hero content: translate-y-4 to 0

**Interactive Elements:**
- Button hover: slight scale (1.02) with 150ms transition
- Card hover: shadow expansion + translate-y-1
- Code generation: Pulsing "generating" indicator

**Chat Messages:**
- New messages: slide in from bottom with fade (300ms)
- Code insertion: highlight flash effect

**Micro-interactions:**
- Copy button: checkmark swap animation on success
- Theme toggle: smooth icon rotation
- Dropdown menus: scale + fade (200ms)

**Prohibited:**
- No scroll-triggered animations
- No parallax effects
- No auto-playing animations

---

## Images

**Hero Section Image:**
- Large code editor mockup or terminal window visualization
- Positioned below headline text, centered
- Dimensions: max-w-5xl with shadow-2xl
- Shows example of AI generating code in action
- Subtle glow effect around image

**Feature Section Icons:**
- Use Heroicons (outline style) via CDN
- Consistent sizing: w-12 h-12
- Integrated into feature cards at top

**No photography needed** - This is a developer tool with UI screenshots and iconography focus

---

## Responsive Behavior

**Breakpoints:**
- Mobile: base (< 768px)
- Tablet: md (768px+)
- Desktop: lg (1024px+)
- Wide: xl (1280px+)

**Mobile Adaptations:**
- Hide History panel by default (show as modal on action)
- Collapsible Chat panel with toggle button
- Stack pricing cards vertically
- Simplified header with hamburger menu
- Reduce Monaco Editor minimap on mobile
- Touch-friendly button sizing (min 44px tap targets)

**Tablet:**
- 2-column feature grids
- Side-by-side pricing cards
- Persistent navigation

**Desktop:**
- Full split-pane editor layout
- 3-column feature grids
- Expanded navigation with all links visible