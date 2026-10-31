---
title: Cirrus Vision Jet, to scale
short: Cirrus
stage: design
image: hero.png
caption: Final render in real-world lighting, from Fusion 360
flagship: true
order: 1
tools:
  - Fusion 360 CAD
  - T-spline form modelling
  - Fusion 360 Simulation
year: "2021"
role: Surface modelling, mechanism design, and FEA
team: Solo
outcome: "A to-scale Cirrus SF50 whose wings come off and lock back on with a key"
result: "A simplified static FEA put the peak stress at 28.8 MPa in the steel centre beam and 3.2 mm of deflection at the wing tip"
steps:
  - Scaled the SF50 from the Cirrus three-view drawing and specifications, with the published wing and tail airfoils
  - Built the shape over four drafts, from loft surfaces to T-spline form modelling
  - Modelled the nose and main landing gear and animated them retracting in a motion study
  - Made both wings detachable on a centre beam, locked by an off-the-shelf self-locking trailer hitch
  - Ran a static FEA of the mount, with loads taken from the SF50 loads-certification paper
  - Reworked it at 1:8 in wood, with two mount options, tubes with quick-coupling sleeves or 3D-printed spar joints
media:
  - kind: section
    label: Four drafts, from loft surfaces to the final shape
    file: drafts.png
  - kind: section
    label: Rear view, V-tail and engine nacelle
    file: rear.png
  - kind: video
    label: Landing gear retracting
    file: landing-gear.mp4
  - kind: section
    label: Exploded view of the components
    file: exploded.png
  - kind: section
    label: Self-locking hitch joining the wings through the fuselage
    file: wing-lock.png
  - kind: video
    label: A wing sliding off the centre beam
    file: wing-detach.mp4
  - kind: section
    label: "FEA: von Mises stress in the centre beam, 28.8 MPa peak"
    file: fea-stress.png
  - kind: section
    label: "FEA: deflection, 3.2 mm peak at the wing tip"
    file: fea-deflection.png
  - kind: section
    label: "1:8 wooden model: tubes with quick-coupling sleeves"
    file: model-1-8.png
---

A design brief asked for a solid model of the Cirrus Vision SF50 with every external detail, and with both wings detachable. The wing joint had to lock itself, using a part you can buy off the shelf, and it had to be checked with FEA for the loads and bending moments it would carry.

I took the joint from the caravan world: a self-locking aluminium trailer hitch on each end of a steel centre beam that runs through the fuselage. Once the wings are in, turning the key locks them. The FEA used a model simplified to ribs and spars to keep solve times short, so it shows the concept rather than a certified design.
