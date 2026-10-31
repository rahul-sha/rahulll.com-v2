---
title: Compact HVAC unit, from concept to test room
stage: simulate
image: hero.webp
caption: Air draft across the test room, with a person standing in it, from CFD
flagship: true
order: 2
year: 2018 to 2021
role: Mechanical design, CFD and FEA, test rig, and build tracking
team: Startup team at Disruptive Thermodynamics
outcome: "Three working HVAC prototypes designed, built, and tested at a startup"
result: "Every test fed the next design: thermal imaging found a restricted flow splitter, sensor data earned the custom diffuser its place, and a retuned PID loop stopped the expansion valve hunting"
tools:
  - Fusion 360 CAD
  - Fusion 360 Simulation
  - Ansys / COMSOL
  - Coda.io
steps:
  - Placed the unit in the settings it was meant for, a balcony, a shipping-container site office, and a mining camp, to size it and to count how many units a job needs
  - Designed the volute around the product requirements, and compared configurations in CFD to keep performance inside a compact housing with the least back pressure
  - Simulated the rest of the air and refrigerant path, a three-way refrigerant splitter, the outwash from an axial fan shroud, flow through a custom diffuser, and the heat exchanger tubes
  - Took weight out of the structure with generative design and load-path analysis, then checked the parts again in the full assembly, where new failure points showed up
  - Built a virtual test room with real wall, window, and open-boundary properties to see draft coverage, thermal spread, and the turbulence at start-up
  - Tested the real machine with thermal imaging, audio spectrograms, and pressure and temperature sensors, and tuned the PID loop on the expansion valve
  - Ran the build on Coda.io, a task tracker tied to design status and vendors, a timeline, a bill of materials with lead times and weights, and an auxiliary equipment list
media:
  - kind: section
    label: Concept render, the unit on a balcony wall
    file: concept-balcony.webp
  - kind: section
    label: The same unit on a shipping-container site office
    file: concept-site-office.webp
  - kind: section
    label: Mining camp, counting the units needed to cool the rooms
    file: mining-camp.webp
  - kind: video
    label: Dual-fan concept for a ledge, light and tidy
    file: dual-fan-concept.mp4
  - kind: section
    label: Volute inside the compact housing
    file: volute-housing.webp
  - kind: section
    label: Volute configurations compared for back pressure
    file: volute-options.webp
  - kind: video
    label: Back pressure through the restricted sections of the volute, CFD
    file: volute-back-pressure.mp4
  - kind: video
    label: Three-way refrigerant splitter, tuned until the downstream velocities were right
    file: splitter.mp4
  - kind: video
    label: Outwash from the axial fan shroud
    file: fan-shroud.mp4
  - kind: video
    label: Flow distribution through the custom diffuser
    file: diffuser-flow.mp4
  - kind: section
    label: Distribution plotted along the height of the machine
    file: diffuser-plot.webp
  - kind: video
    label: Heat exchanger tubes with cold refrigerant, 2D
    file: heat-exchanger.mp4
  - kind: section
    label: Generative design iterations of a mounting bracket
    file: generative-bracket.webp
  - kind: section
    label: Load path analysis, regions marked for removal at a set safety factor
    file: load-path.webp
  - kind: section
    label: Full assembly load, where parts that passed alone show new failure points
    file: assembly-load.webp
  - kind: section
    label: Manifold stress and deflection, the case for a different material
    file: manifold-stress.webp
  - kind: section
    label: Cantilever mount spreading 160 kg across four wall points
    file: cantilever-mount.webp
  - kind: section
    label: The test room model, with its materials and an open boundary
    file: test-room.webp
  - kind: video
    label: Heat transfer through the window, velocity spheres
    file: window-heat.mp4
  - kind: section
    label: Thermal spread as the air leaves the duct
    file: thermal-spread.webp
  - kind: video
    label: Turbulence at start-up, and why the unit's position matters
    file: start-up.mp4
  - kind: section
    label: Thermal image of the condenser, one section hotter than the other two
    file: thermal-condenser.webp
  - kind: section
    label: Compressor spectrogram, with and without the electrical noise
    file: spectrogram.webp
  - kind: video
    label: Expansion valve PID before tuning, oscillating
    file: pid-before.mp4
  - kind: video
    label: After tuning, the oscillation gone
    file: pid-after.mp4
  - kind: section
    label: Sensor data with and without the diffuser
    file: diffuser-sensors.webp
  - kind: section
    label: Task tracker tied to design status and parts availability, on Coda.io
    file: tracker.webp
  - kind: section
    label: Product timeline, design to prototype
    file: timeline.webp
  - kind: section
    label: Bill of materials with lead times, weights, and revisions
    file: bom.webp
  - kind: section
    label: Weight distribution worked out before the physical build
    file: weight.webp
---

A startup set out to build a compact HVAC unit that could hang on a wall and cool a room without the usual ductwork. I joined from an aerospace degree expecting to work on compressors, and ended up carrying the mechanical side of the product from the first concept render to the test room.

The thread through all of it is simulate before you cut. CFD settled the volute, the splitter, the fan shroud, and the diffuser before any were made. FEA took weight out of the frame and then caught the failure points that only appear once the parts are bolted together. The virtual test room answered where the unit should sit in a real room, and the physical tests then told the simulations where they were wrong.
