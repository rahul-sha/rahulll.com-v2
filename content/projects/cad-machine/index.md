---
title: From CAD to the machine
stage: make
image: hero.webp
caption: The part as modelled, before the toolpaths are programmed
flagship: true
order: 3
role: CAD, CAM programming, simulation, and NC code checks
outcome: "One part followed from drawing to NC code, with every toolpath checked before a chip is cut"
result: "The Ultem manifold showed why the checks matter: it had to seal under heat and pressure, and the part was rejected when its tolerances drifted"
tools:
  - Fusion 360 CAD
  - Fusion 360 CAM
  - NC code backplots
steps:
  - Draw the part in CAD to the specification
  - Program the toolpaths from the shop floor's machining specifications and the tools on the rack
  - Simulate them to catch unsafe retracts, tool hits, and finishing problems, and to confirm the operations run in order, facing, contouring, roughing, finishing, then drilling and hole making
  - Backplot the generated NC code to make sure the controller reads what the CAM software wrote
  - Use a single 5-axis setup where a 3-axis plus 4th-axis job would mean a second setup and more variables against a tight tolerance
  - Pick ball-nose tools and toolpaths for cusps and curved surfaces, where the finish and the tolerance depend on them
media:
  - kind: video
    label: CAD timelapse, drawn to the specification
    file: cad-timelapse.mp4
  - kind: video
    label: Toolpath simulation, operations in order
    file: cam-simulation.mp4
  - kind: video
    label: Backplot of the NC code
    file: backplot.mp4
  - kind: section
    label: 5-axis machining in a single setup
    file: five-axis.webp
  - kind: video
    label: Multi-axis simulation, the tool approach changing for each side of the part
    file: five-axis-simulation.mp4
  - kind: section
    label: Ball-nose finishing on cusps and curved surfaces
    file: curved-surfaces.webp
  - kind: video
    label: Simulation of the curved-surface toolpaths, flat-end and ball-nose
    file: curved-simulation.mp4
  - kind: section
    label: The toolpaths alone, rapids, retracts, and cuts
    file: curved-toolpaths.webp
  - kind: video
    label: Ultem manifold, simulation beside the machined part
    file: manifold.mp4
---

Following one part from a CAD model to CNC-ready code: drawing it, programming the toolpaths, simulating them, and validating the generated NC code.

Many parts can make do with 3-axis machining. For parts like the one shown below, a single 5-axis setup saves time and keeps tight tolerances from drifting between setups. Where the model has cusps and curved surfaces, the choice of toolpath and ball-nose tool decides how smooth the finish is and which tolerance it can hold.
