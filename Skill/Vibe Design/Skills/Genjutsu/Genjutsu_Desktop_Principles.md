---
title: "Genjutsu Desktop Principles"
tags: [genjutsu, desktop, hover, shortcuts, vibe-design]
date: 2026-07-31
status: ✅ Активен
category: "Vibe Design/Skills/Genjutsu"
---

# ⚡ Genjutsu Desktop Principles

> **Имя скилла:** `desktop-principles`  
> **Локальный путь:** `/root/.agent/skills/_jutsu/desktop-principles/SKILL.md`  
> **Описание:** Десктопные UX-принципы: ховер-состояния, хоткеи, фокус.

---

# Desktop Principles

> Desktop UX context. Loaded when desktop is detected (macOS, Windows, Linux desktop, web desktop).
> Concise rules here. Deep-dive in `references/`.

---

## Hover States Are Mandatory

Hover is the primary affordance signal on desktop, the inverse of mobile. A pointer hovering over a target without immediate visual feedback feels broken: users rely on `:hover` to confirm an element is interactive before committing to a click. Every clickable surface must have a distinct hover style, ideally with a 100-200ms transition so the change is perceptible without feeling sluggish.

**CSS - hover styles for interactive elements:**
```css
.button {
  background: var(--surface);
  transition: background 120ms ease-out, transform 120ms ease-out;
}

.button:hover {
  background: var(--surface-hover);
  transform: translateY(-1px);
}

.button:active {
  transform: translateY(0);
}
```

**SwiftUI - .onHover for macOS, .hoverEffect for iPadOS:**
```swift
struct ToolbarButton: View {
  @State private var hovering = false

  var body: some View {
    Image(systemName: "square.and.arrow.up")
      .padding(8)
      .background(hovering ? Color.gray.opacity(0.15) : .clear)
      .onHover { hovering = $0 }
      .animation(.easeOut(duration: 0.12), value: hovering)
      .hoverEffect(.highlight) // iPadOS pointer support, no-op on macOS
  }
}
```

**Compose Desktop - onPointerEvent or hoverable + interactionSource:**
```kotlin
@OptIn(ExperimentalComposeUiApi::class)
@Composable
fun ToolbarButton(onClick: () -> Unit) {
  val interactionSource = remember { MutableInteractionSource() }
  val hovered by interactionSource.collectIsHoveredAsState()

  Box(
    modifier = Modifier
      .hoverable(interactionSource)
      .background(if (hovered) Color.LightGray.copy(alpha = 0.15f) else Color.Transparent)
      .clickable(onClick = onClick)
      .padding(8.dp),
  ) { Icon(Icons.Default.Share, contentDescription = "Share") }
}
```

---

## Pointer Precision

Mouse and trackpad pointers are far more accurate than thumbs, so desktop targets can be smaller than the 44pt mobile minimum. Common ranges are 24-32px for icon buttons, 28-36px for toolbar items. WCAG 2.5.8 (AA, target size minimum) sets the absolute floor at **24x24 CSS pixels** for non-mobile pointer input. Sub-24px targets need spacing or be grouped with sibling targets.

**Fitts's Law in practice:** the time to acquire a target shrinks with size and grows with distance. Screen edges and corners are infinite-depth targets - the cursor stops there regardless of overshoot. Put high-frequency global controls (close window, system menu, app dock) in corners and along edges. macOS menubar and Windows taskbar are textbook applications: edge-anchored, zero-overshoot acquisition.

---

## Keyboard Shortcuts (first-class)

Desktop users expect parity with native conventions. Missing `⌘+F` in a list-heavy app is not minimalism, it is a bug.

| Action | macOS | Windows / Linux |
|---|---|---|
| New | `⌘+N` | `Ctrl+N` |
| Close window | `⌘+W` | `Ctrl+W` |
| Quit app | `⌘+Q` | `Alt+F4` |
| Settings / Preferences | `⌘+,` | `Ctrl+,` |
| Find | `⌘+F` | `Ctrl+F` |
| Toggle (comment, sidebar...) | `⌘+/` | `Ctrl+/` |
| Save | `⌘+S` | `Ctrl+S` |
| Command palette | `⌘+K` or `⌘+Shift+P` | `Ctrl+K` or `Ctrl+Shift+P` |

**Web - detect Ctrl vs Cmd correctly:**
```js
// Prefer event.metaKey on macOS, event.ctrlKey elsewhere.
// navigator.platform is deprecated but still pragmatic; fall back to userAgent.
const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

window.addEventListener("keydown", (e) => {
  const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
  if (cmdOrCtrl && e.key.toLowerCase() === "k") {
    e.preventDefault();
    openCommandPalette();
  }
});
```

**SwiftUI - .keyboardShortcut binds to menu commands:**
```swift
Button("New Document", action: newDoc)
  .keyboardShortcut("n", modifiers: .command)

Button("Find", action: focusSearch)
  .keyboardShortcut("f", modifiers: .command)
```

**Compose Desktop - onKeyEvent + KeyShortcut:**
```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun Modifier.commandShortcut(key: Key, onTrigger: () -> Unit) =
  onKeyEvent { event ->
    if (event.type == KeyEventType.KeyDown && event.isMetaPressed && event.key == key) {
      onTrigger(); true
    } else false
  }

// In MenuBar:
MenuBar {
  Menu("File") {
    Item("New", shortcut = KeyShortcut(Key.N, meta = true), onClick = ::newDoc)
    Item("Find", shortcut = KeyShortcut(Key.F, meta = true), onClick = ::focusSearch)
  }
}
```

---

## Multi-Window Patterns

Desktop users keep windows side by side. A new window is the right answer when:

- A task runs long enough that the user wants to keep working in the main window (rendering, export, sync log).
- The user is comparing two parallel contexts (two documents, two chats, two issues).
- The app is document-based and each document is a peer (Pages, Figma files, Xcode projects).

A new window is the wrong answer for transient confirmations, brief settings panels, or anything that can live in a sheet or popover.

**SwiftUI - WindowGroup for document-style, Window for singletons:**
```swift
@main
struct MyApp: App {
  var body: some Scene {
    WindowGroup("Document") { DocumentView() } // peer windows, one per doc

    Window("Inspector", id: "inspector") { InspectorView() }
      .windowResizability(.contentSize) // tracks intrinsic content size

    Settings { SettingsView() } // ⌘+, target on macOS
  }
}
```

**Compose Desktop - Window composables, application scope:**
```kotlin
fun main() = application {
  val docs = remember { mutableStateListOf(Document()) }

  docs.forEach { doc ->
    Window(onCloseRequest = { docs.remove(doc) }, title = doc.title) {
      DocumentView(doc)
    }
  }

  if (showInspector) {
    Window(onCloseRequest = { showInspector = false }, title = "Inspector") {
      InspectorView()
    }
  }
}
```

**State sharing:** windows are *views* over the same model. Hold the source of truth in a singleton or a DI-scoped object (SwiftUI `@Observable` injected via environment, Compose `koin` or `viewModel`-equivalent). Never duplicate state per window - reconciling diverging copies is a graveyard of bugs.

---

## Focus Management

Keyboard navigation is a first-class input on desktop. Tab order must be sane, focus rings must be visible, and removing them without an alternative is an accessibility regression.

**SwiftUI - @FocusState drives field focus:**
```swift
struct LoginForm: View {
  enum Field { case email, password }

  @State private var email = ""
  @State private var password = ""
  @FocusState private var focused: Field?

  var body: some View {
    VStack {
      TextField("Email", text: $email)
        .focused($focused, equals: .email)
        .onSubmit { focused = .password }
      SecureField("Password", text: $password)
        .focused($focused, equals: .password)
        .onSubmit(submit)
    }
    .onAppear { focused = .email }
  }
}
```

**Compose - FocusRequester + LocalFocusManager:**
```kotlin
val emailFocus = remember { FocusRequester() }
val passwordFocus = remember { FocusRequester() }
val focusManager = LocalFocusManager.current

TextField(
  value = email, onValueChange = { email = it },
  modifier = Modifier.focusRequester(emailFocus).focusable(),
  keyboardActions = KeyboardActions(onNext = { passwordFocus.requestFocus() }),
)

TextField(
  value = password, onValueChange = { password = it },
  modifier = Modifier.focusRequester(passwordFocus).focusable(),
  keyboardActions = KeyboardActions(onDone = { focusManager.clearFocus(); submit() }),
)

LaunchedEffect(Unit) { emailFocus.requestFocus() }
```

**Web - tabindex + :focus-visible:**
```css
.button {
  /* Never `outline: none` without an alternative. */
}

.button:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```
```html
<!-- tabindex="0" puts a non-interactive element in tab order -->
<div role="button" tabindex="0" class="button">Custom button</div>
```

---

## Information Density

Desktop users sit on a 13-32 inch screen with a precise pointer and full keyboard. They can - and want to - parse more information per viewport than on mobile. Use an 8px base grid (vs 4-8px mobile), persistent sidebars instead of bottom tabs, command palettes (`⌘K`) for power users, and dense data tables when the data warrants it. Linear, Things 3, and Notion are the touchstones: information-rich without feeling cramped, every pixel earns its keep.

---

## Subtle Animations Doctrine

Desktop apps are stared at for hours. Animations that feel delightful once become unbearable on the hundredth repetition. Prefer short, purely functional motion: opacity and small translations under 200ms, no bounces on routine interactions, no playful overshoots on hover. Save expressive motion for one-shot moments (onboarding, success states), never daily UI.

```css
/* BAD - every hover bounces for 600ms, exhausting after the third use */
.card {
  transition: transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.card:hover { transform: scale(1.05); }
```

```css
/* GOOD - 100ms opacity, almost subliminal, never tires */
.card {
  opacity: 0.92;
  transition: opacity 100ms ease-out;
}
.card:hover { opacity: 1; }
```

---

## Anti-Patterns (BAD / GOOD)

### 1. Hiding navigation behind a hamburger on desktop

```html
<!-- BAD - 1440px viewport, infinite room, but nav is collapsed -->
<header>
  <button class="hamburger" aria-label="Menu">☰</button>
</header>
<nav class="drawer hidden">...</nav>
```

```html
<!-- GOOD - persistent sidebar on desktop, collapsible if the user wants it -->
<aside class="sidebar">
  <nav>
    <a href="/inbox">Inbox</a>
    <a href="/projects">Projects</a>
    <a href="/archive">Archive</a>
  </nav>
  <button class="collapse-toggle" aria-label="Collapse sidebar">⇤</button>
</aside>
```

### 2. No keyboard shortcuts for primary actions

```jsx
// BAD - "New" is buried in a menu, no shortcut, every creation is 3 clicks
<Toolbar>
  <Menu>
    <MenuItem onClick={newDoc}>New document</MenuItem>
  </Menu>
</Toolbar>
```

```jsx
// GOOD - ⌘N baseline, surfaced in the menu, mirrored on the toolbar tooltip
<Toolbar>
  <button onClick={newDoc} title="New document (⌘N)">
    <PlusIcon />
  </button>
</Toolbar>
// Bound globally:
useShortcut("mod+n", newDoc);
useShortcut("mod+s", save);
useShortcut("mod+f", focusSearch);
```

### 3. Removing focus rings without an alternative

```css
/* BAD - keyboard users now have no idea where focus is */
button:focus { outline: none; }
```

```css
/* GOOD - :focus-visible keeps mouse clicks ring-free, keyboard navigation visible */
button:focus { outline: none; }
button:focus-visible {
  outline: 2px solid var(--brand-500);
  outline-offset: 2px;
  border-radius: 6px;
}
```

---

## Quick Reference: Loading sub-skills

| Need | Load |
|---|---|
| Keyboard patterns deep-dive | `references/keyboard-patterns.md` |
| Multi-window state | `references/multi-window.md` |
| SwiftUI animations | `../swiftui-motion/SKILL.md` |
| Compose Desktop | `../compose-multiplatform/SKILL.md` (when desktop is a CMP target) |

---

## Sources

- Apple Human Interface Guidelines (macOS): https://developer.apple.com/design/human-interface-guidelines/macos
- Microsoft Fluent Design 2: https://fluent2.microsoft.design/
- GNOME Human Interface Guidelines: https://developer.gnome.org/hig/
