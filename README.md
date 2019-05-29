# ZebrafishBrainBrowser

The Zebrafish Brain Browser is a tool for visualizing 3D expression within the brain of zebrafish transgenic lines. More than 200 of the available lines were created at the NICHD at the National Institutes of Health.

The latest production version of the browser is available at [zbbrowser.com](http://zbbrowser.com). Similar projects are listed below:

- [Brain Browser](https://science.nichd.nih.gov/confluence/display/burgess/Brain+Browser)
- [ViBE-Z](http://vibez.informatik.uni-freiburg.de/)
- [Z-Brain](https://engertlab.fas.harvard.edu/Z-Brain/#/home/)

## Project Setup

1. Fork the project if you're not a collaborator
2. Clone the project onto your machine
3. Download 'res.zip' from [here](https://drive.google.com/file/d/1lryYfr_fp5two4IxqrZO1-rm4F3_Gmy3/view?usp=sharing) (1 GB)
4. Extract 'res.zip' and place the 'res/' folder in the 'zbb/' folder (This folder is ignored by Git because of its size)
5. Begin working

## TODO

### High

- [X] Scroll to zoom, z to reset
- [ ] Color key in bottom right of Z window
- [ ] Share and load configurations with URL codes (selected lines, slice numbers, volume orientations, etc.)
- [ ] Hide/show 100-micron scale bar that changes with zoom in top-left of Z window

### Medium

- [ ] Bug: Color darkens in Z window at slice 117
- [ ] Start VR mode at similar angle as 3D volume view

### Low

- [ ] Oblique view
- [ ] Play/pause buttons to auto-rotate 3D volume view in each cardinal direction
- [ ] VR mode: Demo with pre-selected lines and camera movement

### Minor

- [ ] Reduce font size for current plane info at bottom-left of each slicer view (about 2/3 size)
- [ ] Help icon on top-right of each tab that links to subsection of an online how-to-use guide

### Future

- [ ] Add download links to full-resolution data stacks
- [ ] Allow users to download current views (as images)
