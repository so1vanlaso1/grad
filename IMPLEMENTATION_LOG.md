# Graduation invitation implementation log

## 2026-11-04 · Complete graduation website enhancements

| Finding | Resolution |
| --- | --- |
| 10th graduation portrait was omitted from the site. | Copied `cb89a1ba...jpg` to `public/assets/photos/flower-gaze-portrait.jpg`, added it to `photos` array, and added a "View all 10 photos" album browser. |
| Graduate sash indicated full name and formal degree not reflected on site. | Updated site identity to **Phạm Thùy Dung**, degree to **Bachelor of Business** (*Cử nhân Kinh doanh*), and university to **Western Sydney University** (*Đại học Western Sydney*). |
| Site lacked bilingual support for Vietnamese family, elders, and classmates. | Added `[VI | EN]` language toggle in the header, with natural and poetic Vietnamese translations for all 6 chapters, Taylor Swift quote, prompts, and buttons. |
| Ceremony is in 3 days with no live countdown timer. | Added an animated, responsive live countdown clock (`Days : Hours : Minutes : Seconds`) to Saturday, Nov 7, 2026 at 10:00 AM. |
| Calendar was only available as a downloadable `.ics` file. | Added a direct 1-click Google Calendar web link alongside the `.ics` download for seamless mobile and desktop calendar adding. |
| Guests lacked direct RSVP, Zalo, and congratulation channels. | Added direct Zalo (`zalo.me/0985763939`), direct phone calling, and an interactive RSVP & Wishes modal with local wish storage and celebratory confetti. |
| Guests needed arrival, parking, and dress code logistics. | Added a Venue & Logistics guide (recommended 9:15 AM arrival for photos, Hall A.116, UEH Campus A basement parking, and dress code recommendations). |
| The graduate had to manually type URL parameters for personalized links. | Added a built-in Personalized Invite Link generator where Thùy Dung can type any guest's name and copy the personalized link in one click. |
| The cinematic 3D journey lacked an atmospheric soundtrack. | Implemented a gentle, warm ambient graduation piano soundtrack synthesized in Web Audio API (zero asset weight, plays smoothly with play/mute toggle). |
| The moment of opening the door into sunrise lacked celebratory feedback. | Added a lightweight, celebratory canvas confetti particle burst upon unlocking the door and reaching Graduation Day. |
| Social sharing (Zalo, Messenger, iMessage) lacked link preview images. | Added `og:image` and `twitter:image` tags in `index.html` referencing the graduation portrait. |


## 2026-11-04 · Photo frame proportions

- Finding: the 3D campus frames used a wide picture window for the supplied 2:3 portrait, leaving visible side stripes around the photo. The first CSS adjustment only affected the flat portrait frame and did not correct these 3D scene frames.
- Solution: resized the 3D photo windows and their surrounding frame blocks to the portrait proportions, so the photo fills its window without side stripes. The flat portrait frame and gallery thumbnails also preserve the full image without cropping.

## 2026-11-04 · Graduation photos added

| Finding | Resolution |
| --- | --- |
| Nine newly added JPGs were graduation portraits, while all nine invitation photo records still had no image paths. Several placeholder titles and alt texts also claimed that family, friends, classmates, or mentors appeared in the photos. | Copied the nine supplied portraits into `public/assets/photos/`, connected each invitation photo record to its image, and replaced unsupported people-based captions and alt text with descriptions of the visible graduation portraits. Updated the Memory Lane and Thank-You Garden copy to explain the portraits and thank the people who supported the graduate without implying they are pictured. |

### Verification and limits

- Confirmed all nine source photos are present in the public photo folder and that the invitation data references each file.
- The source photos show the graduate alone; captions describe the image content accurately while the existing Memory Lane and Thank-You Garden UI remains in place.

## 2026-11-04 · Local customization and full-screen 3D

- The active checkout at upstream commit `f4e61ac` built successfully and showed the original four-scene RMIT invitation. The neighboring custom-scene folder contained a README for a separate blue-and-gold concept.
- Used the attached concept for the six-chapter story, evening and sunrise palettes, and event details. The follow-up request to match the original site's use of 3D space changed the default experience from a split composition to a full-screen canvas.
- Used the supplied campus view to model the blue glazing, red fins, open balconies, entrance steps, and banner. The façade is a stylized interpretation of one reference view. The supplied WSU mark identifies the university on the ceremony card, which lists UEH Campus A as the venue.
- The sample portrait stayed out of the site. Nine placeholder entries cover the hero portrait, four campus memories, and four thank-you photos. The same metadata feeds the 3D frames, Lite view, and gallery.

### Findings and fixes

| Finding | Resolution |
| --- | --- |
| The original page and social metadata named a different graduate and university. | Updated the entry point and metadata for Thùy Dung. Event information now comes from one TypeScript module. |
| The initial customization placed the canvas beside the story text. | Moved all six chapters to stops in one Three.js world. Titles and photo frames are meshes. Accessible story and action plaques follow projected world coordinates. |
| Vite's development optimizer loaded mismatched React module instances when the lazy canvas first loaded. | Pre-bundled the dynamic renderer imports and deduplicated React, React DOM, and Three in Vite. |
| Canvas fallback content mounted even with working graphics. The async typeface also suspended through the renderer shell during early testing. | Added a WebGL 2 check and context-loss handling, and isolated scene asset loading in an inner Suspense boundary. |
| The upstream 3D typeface lacked the accented letter in Thùy Dung. The initial subset also omitted lowercase s. | Converted Cormorant Infant SemiBold outlines with FontTools and included basic Latin glyphs plus ù. The derived font ships with its OFL notice. |
| Early layouts clipped the portrait and title on narrow screens, and a plaque could overlap navigation during a camera move. | Reframed the mobile geometry, made portrait placement aspect-aware, and show interactive plaques when the camera is close to its stop. |
| The long calendar location needed line folding, and the invitation gave a local start time. | Escaped and folded calendar content at 75 UTF-8 bytes and exported the start as `20261107T030000Z`, equivalent to 10:00 AM in Vietnam. |
| The guide lists Messenger and a phone number without a Messenger URL. | Added a direct call link using the supplied number. |

### Verification

- `npm run build` and `git diff --check` passed. Vite reports a size warning for the lazy 3D bundle, about 867 kB minified and 235 kB gzip. The entry JS is about 210 kB minified and 67 kB gzip.
- Desktop browser checks at 1366×850 covered drag-to-orbit, scroll-to-travel, clicks on the 3D envelope, portrait, memory frame, and doorway, the sunrise and quote reveal, and chapter navigation through the garden and horizon.
- The gallery advanced via Arrow Right, closed via Escape, and restored focus. Verified the Ceremony Info shortcut, directions and telephone targets, the calendar download and contents, and switching from 3D to Lite and back.
- At 390×844, checked that each chapter plaque cleared the viewport edges and footer. Also checked the ceremony in the in-app viewport. Physical phone performance was outside this verification.
- The desktop evidence is at `D:/grad/graduation-3d-preview.jpg`. The brief quotation links to [NYU's 2022 commencement recording](https://www.youtube.com/watch?v=OBG50aoUwlI).
- Delivery is the local Vite preview and static production build. A public deployment, guestbook, and soundtrack were outside this pass.

### Adding the photoshoot

Place the photographs under `public/photos/` and add `src`, an optional smaller `thumbnail`, and an accurate `alt` to the corresponding entries in `src/invitation.ts`. Use paths relative to `public/`, such as `photos/portrait.webp`. The 3D frame uses the thumbnail when supplied, and the gallery uses the full image. Run `npm run dev` for a local preview and `npm run build` for the static build.

## 2026-11-04 · Orbit, scene isolation, and visual detail

| Finding | Resolution |
| --- | --- |
| The original drag implementation barely moved around the subject. The first exploration pass added keyboard walking and a directional pad, which the user then asked to remove. | Added a full orbit around a fixed chapter target. Drag spins, wheel and pinch zoom, and zoom buttons provide an alternative to gestures. Removed camera translation, panning, WASD, and the directional pad. Chapter selection and recentering restore the default angle. |
| The longer camera range revealed the next chapter's title and diorama behind the current chapter. | Rendered only the selected chapter's meshes and removed the inter-island bridges. Each chapter has its own composition and can be spun or zoomed independently. |
| The campus and props looked flat and static. | Added lit windows and rails, a letter with a star-shaped wax seal, rotating celestial rings, swaying ribbons and keepsakes, layered lighting, a glowing doorway, and moving garden petals. Personal photo frames still use the existing placeholders. |
| Fixed overlays could compete with touch gestures, and compact portrait and landscape layouts needed different spacing. | Kept the canvas open for gestures and made chapter details a dismissible, scrollable sheet on narrow screens. Zoom and recenter controls have 44-pixel targets. |
| Hot reload briefly mixed the intermediate movement controller with the final component props during the change. | Reloaded the preview and repeated the final interaction checks. The renderer opened normally on fresh loads. |

### Verification

- Browser-tested desktop drag, wheel zoom, recentering, and the removal of WASD. Dragging or zooming did not change the selected chapter. Inspected the isolated welcome scene from the front and while rotated.
- Browser-tested all six chapter panels at 390×844, direct portrait selection, the door reveal, the ceremony shortcut, the calendar download, zoom buttons, and switching between 3D and Lite. Also checked 320×568 and 844×390 for control clipping.
- Tested the installed OrbitControls against simulated touch pointer sequences. One finger changed angle at a constant radius, two fingers changed zoom, and both kept the orbit target fixed. Physical phone testing remains separate.
- The production build and whitespace check passed. Vite reported the lazy 3D chunk size warning. Evidence is available at `D:/grad/graduation-3d-preview.jpg` and `D:/grad/graduation-mobile-preview.jpg`.

## 2026-11-04 · Chapter transitions

- Isolated chapters initially switched with a hard cut. A chapter selection now moves the camera toward the outgoing subject, covers the canvas with a short fade, swaps the mounted chapter while fully covered, and brings the new chapter into view with a second camera move. Only one chapter's models are mounted at any point.
- Kept chapter shortcuts available during the transition and applied the latest queued selection. Camera gestures pause during the handoff and resume afterward. Reduced-motion and Lite mode use an immediate chapter change.
- Verified the outgoing and incoming phases in the desktop browser, including the active chapter at the cut. At 390×844, verified rapid selection, the ceremony details opening after arrival, and switching to Lite during departure. The production build and whitespace check passed.

## 2026-11-04 · Guest journey and finishing pass

### Findings and solutions

- Mobile visitors could see a chapter without a clear next action while the story sheet was closed. Added a compact chapter label, narrative prompt, and contextual button for starting the journey, opening the door, continuing, and opening ceremony details. Short phone layouts collapse the paragraph to preserve space. Desktop uses its existing story plaque to avoid overlapping the diorama with duplicate copy.
- The final View Invitation button navigated to the ceremony but left its mobile details hidden. It now opens the card after arrival. Added a polite chapter announcement for assistive technology and prevented canvas object clicks during transitions and gallery viewing.
- Photo collections lacked direct selection and touch navigation. Added selected-state thumbnail buttons and horizontal swipe handling, retaining keyboard navigation and the native dialog. All personal photos remain placeholders.
- The memory and garden frames needed meaningful labels and more environmental detail. Added extruded frame captions, suspended string lights, a stack of university books, and a ribbon-bound floating diploma at the ceremony. Slightly increased the mobile diorama scale.
- Added a brief rising and rotating arrival for each diorama and an animated seal during the transition. Reduced-motion preference makes the new arrival immediate. Chapter isolation and spin/zoom controls continue to apply.

### Verification and limits

- Production build and whitespace checks passed. Targeted ESLint checks had zero errors and the existing react-refresh export warning in explore.tsx. Vite continues to flag the lazy 3D chunk, about 896 kB minified and 242 kB gzip.
- Browser verification covered the mobile journey from welcome through memory, door opening, ceremony details, garden and ending. Verified the repaired final invitation action, thumbnail selection, gallery close, and no captured browser runtime errors. Inspected 1366×850, 390×844 and 320×568 layouts. Restored the browser viewport afterward.
- The new swipe handler was code-reviewed. Physical touch-device testing and hardware performance measurements were not performed in this pass.
- Saved the garden preview at D:/grad/graduation-mobile-polished.png. Work remains a local website and production build.
