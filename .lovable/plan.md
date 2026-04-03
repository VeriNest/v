
Goal: fully fix the dashboard sidebar collapse behavior so the mini-collapsed state looks intentional, aligned, and never leaves a visible “cutout”.

What I found
- All three dashboards use the same shadcn sidebar pattern, so the bug is shared across Admin, Provider, and Seeker.
- The sidebar is using `collapsible="icon"` correctly, and the header trigger is outside the sidebar, which is good.
- The likely cause of the remaining visual break is the custom sidebar content not adapting cleanly to the 3rem collapsed width:
  - logo/header row keeps desktop spacing/padding even in mini mode
  - nav links manually hide labels with `!collapsed`, but their layout still keeps left/right padding and icon margins tuned for full width
  - bottom action area uses the same wide row spacing, which can create the “cutout”/misaligned look in collapsed state
- Theme-wise, the base sidebar tokens are present in `src/index.css`, so this issue looks structural/layout-related more than color-token-related.

Implementation plan
1. Normalize the three sidebar components
- Refactor `AdminSidebar.tsx`, `ProviderSidebar.tsx`, and `SeekerSidebar.tsx` to use the same collapsed-safe structure and spacing rules.
- Keep role-specific items/content, but unify wrapper classes so all 3 collapse identically.

2. Make the logo block collapse-safe
- Rework the top logo row so collapsed mode centers the icon in the available 3rem width.
- Remove extra horizontal padding/gap in collapsed state.
- Ensure the brand text disappears without leaving leftover spacing.

3. Make nav buttons truly icon-mode friendly
- Update each menu link/button so collapsed mode uses centered icon alignment instead of full-row left alignment.
- Remove icon right margins and large horizontal padding when collapsed.
- Keep active/hover states visible in mini mode without clipping.

4. Fix the bottom utility section
- Rebuild the Settings / Back to Site / Sign Out area with the same collapsed-safe alignment as the main nav.
- Ensure the top border and inner padding do not create a notch/cutout effect at the bottom when the panel is collapsed.

5. Tighten sidebar container styling
- Adjust the `Sidebar` class usage so border/background are applied in a way that remains visually clean in both expanded and collapsed widths.
- If needed, move some border/background responsibility from custom child wrappers to the sidebar shell to avoid double edges or exposed gaps.

6. Verify layout interaction points
- Check all three layout headers (`AdminLayout`, `ProviderLayout`, `SeekerLayout`) to ensure the content area and sticky header align flush with the collapsed mini sidebar.
- Prevent any mismatch between the sidebar reserved width and the visible fixed panel width.

Technical details
- Files to update:
  - `src/components/admin/AdminSidebar.tsx`
  - `src/components/provider/ProviderSidebar.tsx`
  - `src/components/seeker/SeekerSidebar.tsx`
  - possibly minor adjustments in:
    - `src/components/admin/AdminLayout.tsx`
    - `src/components/provider/ProviderLayout.tsx`
    - `src/components/seeker/SeekerLayout.tsx`
- I do not currently expect `src/components/ui/sidebar.tsx` to need major edits unless the issue persists after the custom sidebar cleanup.
- The safest approach is to rely more on shadcn’s built-in collapsed behavior and reduce custom spacing that fights the mini width.

Expected result
- Collapsing the sidebar leaves a clean slim icon rail, not a broken or cut-out panel.
- Icons remain centered and active states still read clearly.
- All three dashboards behave the same way.
- No regression to the website color system while fixing the collapse issue.
