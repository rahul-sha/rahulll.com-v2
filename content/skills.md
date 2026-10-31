---
stages:
  design:
    tools:
      - Fusion 360 CAD
      - SolidWorks
      - Product housings
      - Design for manufacture
    proof:
      - cirrus-jet
      - hvac
      - thermometer
      - desk-mount
  simulate:
    tools:
      - Fusion 360 Simulation
      - Ansys
      - COMSOL
      - CFD
      - FEA
    proof:
      - hvac
  make:
    tools:
      - Fusion 360 CAM
      - 3-axis and 5-axis toolpaths
      - Lathe programming
      - NC code checks
    proof:
      - cad-machine
  test:
    tools:
      - Thermal imaging
      - Acoustic analysis
      - Prototype validation
    proof:
      - hvac
beyond:
  - name: Web building
    line: Four sites shipped with Claude Code, one pull request at a time
    opens: sites
  - name: Data visualisation
    line: Grid Walk's points heatmaps and standings
    opens: site-gridwalk
  - name: Photography
    line: The Aperture, 48 photos and counting
    opens: site-aperture
  - name: Linux
    line: CachyOS with niri and Noctalia; this desk is modelled on that setup
    opens: homelab
  - name: 3D printing
    line: Bambu Lab A1 since December 2024
    opens: prints
---

Production liaison, team delegation, and project budgets, from a year as development consultant at Criswell. Aerospace background from NTU and TU Munich: boundary layers, CFD, and propulsion, which is why I simulate before I cut.
