# Experience design

## Visitor journeys

### First 30 seconds

Show a lightweight loading state with the owner's name, honest progress when measurable, and “Read portfolio” fallback. It is utility UI, not a second visual homepage. Once critical assets and collision are ready, reveal the arrival view without a mandatory cinematic or click-to-enter screen.

The physical arrival sign identifies Mohsen and explains movement in two short lines. The robot is already controllable. A low physical route map gives explicit destinations; contact links are available here as well as in the garden. The systems exhibit is visible down a broad ramp. Moving toward it introduces the world, and approaching its plaque reveals a discreet focus affordance.

### Quick visit: target 60–90 seconds, to be tested

Read identity, inspect the featured delivery project, choose “Career” on the arrival directory or follow its nearby sign, then open GitHub or LinkedIn. A visitor need not explore every sector. Directory destinations can transfer the robot to a safe destination anchor with a short fade; label the action “Go to …” so the behavior is explicit. This shortcut is optional and available from the physical directory and utility navigation.

### Exploratory visit: approximately 3–6 minutes

Drive the loop, watch models, inspect selected panels, visit the upper terrace, and stop in the garden. No completion counter, collection checklist, achievement, or gate. Background activity is pleasant to observe and never demands attention.

## Input and camera

| Action | Desktop | Touch / alternative |
| --- | --- | --- |
| Move | WASD or arrow keys, relative to camera's horizontal heading | Visible lower-left thumb control |
| Look | Drag empty scene with primary pointer; no pointer lock | Drag outside movement control |
| Keyboard look | Q/E rotate; Page Up/Page Down tilt while world has focus | Named camera controls in utility settings |
| Focus panel | E near an eligible panel, or click its physical face | Tap panel or focus action |
| Leave reading | Escape or explicit Back control | Persistent Back control |
| Next panel | Tab to physical-panel action, then Enter | Tap labeled neighboring-panel action |
| Recenter camera | R while exploring | Accessible reset-view action |
| Return to arrival | Utility action or physical directory | Same |

Do not hijack keyboard input when a link/control has focus. Clear held inputs on blur, visibility change, pointer cancel, and mode change. Arrow keys must remain usable in the semantic fallback. Use a visible focus boundary for the world input surface and concise instructions.

Initial tuning: move speed 3.2 m/s, acceleration about 7 m/s², deceleration about 10 m/s², turn response about 8 radians/s with damping. These are starting points. No jumping or sprint action. Clamp/frame-step movement so diagonal input is not faster and background-tab stalls cannot launch the robot.

Follow camera: perspective, vertical FOV initially 68–72 degrees, approximately 6.5 m behind and 4 m above the robot's chassis center. Aim ahead and above the robot, not directly down at its body: an initial target 2 m ahead and 2.8 m above its center gives a downward pitch of about 8 degrees. This places the robot in the lower part of the image and leaves sky for the dome and planet. Tune the three quantities together in the rendered view, keeping the robot visible and avoiding wide-angle distortion. A conventional 30-degree downward camera would hide the chosen sky composition.

Permit orbit and upward tilt; prohibit rolling the horizon or moving through the floor. Preserve manually chosen azimuth until the visitor recenters; avoid automatic yaw fighting the visitor. Use gentle frame-rate-independent positional damping, no head bob, and separate settings for portrait view. The opening north-facing view shows the planet; naturally it can leave the view when the visitor looks elsewhere. Keep inspection cameras independently framed for comfortable reading.

Obstruction: shape/sphere-cast toward the intended camera location, shorten distance before intersecting structure, recover smoothly, and keep the target visible. Give the camera enough near clearance at signs and bridges. Test a bridge overhead and a tight inside turn in the first slice. Simple raycasts alone may miss the camera's near-plane corners.

## Interaction states

Keep a single authoritative state machine: `loading`, `explore`, `inspect`, `navigate`, `fallback`, and `error`. Loading/error handling can transition to fallback. Navigation is an explicit safe-anchor transfer, not pathfinding or autoplay.

- `explore`: movement and camera orbit enabled; nearby eligible panel can receive focus.
- `inspect`: robot stops; camera moves to a pre-authored safe pose facing the physical board. Movement inputs are disabled; links and panel actions receive keyboard focus. Ambient machinery can continue except in reduced-motion mode.
- `navigate`: clear inputs, leave inspection, fade briefly, set safe robot/camera pose, return to explore. Reduced-motion users get an immediate switch.
- Leaving inspection restores the previous safe robot position and camera pose, and restores logical focus. Never trap focus or rely on Escape alone on touch.

Panel focus distance target: 3 m, with line-of-sight testing. Avoid selecting a plaque behind a wall. E selects the nearest eligible panel in the forward interaction cone. Pointer events on actual links must not trigger movement or refocus the parent board.

## Physical text system

All visible **portfolio** content in the main experience is attached to believable objects: signs, walls, equipment plaques, display boards, or inset screens. World panels keep their physical orientation. They do not face the camera automatically or follow it around.

Control hints, loading/error messages, accessibility controls, touch controls, and a small utility menu are explicit exceptions. Keep these compact and functional. They must not become a conventional navigation header plus floating project cards.

| Information | Physical presentation | Reading behavior |
| --- | --- | --- |
| Owner identity | Large arrival sign, angled toward spawn | Legible at arrival; focus available |
| Sector navigation | Overhead lettering and direction plaques | Short text, readable while moving |
| Project name / summary | Sign on exhibit structure | 20–40 word summary; focusable |
| Project story | Two to four adjacent boards | 40–70 words per board; focus moves between fixed boards |
| Career | Chronological boards on garden pergola | Short entries, source-backed dates only |
| External links | Labeled inset controls on physical board | Real DOM anchors with visible focus |
| Contact | Arrival directory and garden sign | GitHub and LinkedIn; no invented phone, email, CV |

No miniature full CV on one wall. Cut and edit copy, then split across boards. Prefer 35–60 characters per line. In focused reading at 390 px viewport width, body text should appear at least 18 CSS px equivalent, headings 26 px equivalent, with generous line spacing and no horizontal scrolling. Measure the rendered result, not just a world-space font size.

Desktop boards can be landscape. Portrait mode uses a taller physical board configuration and more shorter panels; a fixed authored alternate layout is preferable to shrinking text. Long content does not open a modal, detach the sign, or become a scrolling website overlay. Allow normal page scrolling only in the separate reading mode.

Inspection is a camera change: the sign stays where it is. Hold the camera steady and align it nearly perpendicular to the board. Remove obstructions by designing the sightline, not by letting text render through walls. Use near-instant transitions when reduced motion is requested; normal transitions approximately 350–500 ms, adjustable after testing.

## Semantic content and fallback

Content has one source of truth for physical boards and an accessible HTML reading view. Provide a clear “Read portfolio” utility link from loading, error states, and the world. It opens a deliberately separate layout with semantic headings, project sections, and links. Offer “Explore station” to return without losing content location.

The accessible view must be delivered as usable static HTML, including without JavaScript, rather than waiting for WebGL to create it. Build generation can derive it from the same structured data. Search metadata describes the actual engineer and projects, not fictional station lore. Render only one active interactive representation to assistive technology: inactive world boards must be inert/unfocusable; opacity alone is insufficient. Do not leave two identical link sets in the tab order.

When focusing a world board, move focus to its semantic heading/control group and expose appropriate text; restore focus on exit. Use an explicit scene-content visibility rule for CSS-projected boards that are distant, occluded, or back-facing. Do not assume the renderer automatically handles screen-reader state.

Honor `prefers-reduced-motion`: remove decorative loops, camera easing, body bob, cloud motion, and animated travel; provide stable reading. Pause optional rendering/activity while the page is hidden. No strobing effects. Touch targets at least 44 × 44 CSS px where interaction is expected.

## Routes, recovery, and errors

Use hash routes, e.g. `/#/exhibit/delivery-systems`, `/#/sector/career`, `/#/read/delivery-systems`. No server rewrites are required. A direct exhibit link loads necessary assets, places the robot at that exhibit's safe anchor, and opens its first reading pose. Invalid IDs return to arrival with a brief utility message.

Back/Forward must restore the previous destination/mode without creating a new history entry recursively. Panel-to-panel focus within an exhibit may replace the current entry; explicit navigation pushes one entry. Avoid generating history from ordinary walking.

Boundary protection and railings prevent falling. Track a last safe position; reset if the robot exits bounds or stays invalid. A utility “Return to arrival” is always available. No visible death, penalty, respawn animation, or game-over screen.

If WebGL initialization, required WASM, an essential asset, or context restoration fails, offer the static reading mode promptly. Optional asset failure shows a coherent simplified object, not an infinite loader. Capability detection is more useful than browser-name guessing.

## Sound

Off by default. A visitor can enable soft machinery, wheel-on-metal sounds, and occasional birdsong-like synthetic ambience only if it fits. Do not implement an audio subsystem before the first slice's movement, reading, and visuals work. All actions must remain comprehensible in silence.
