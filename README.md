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
4. Extract 'res.zip' and place the 'res/' folder in the 'zbb/' folder (The 'res/' folder is included in the .gitignore because of its size)
5. Local development in Chrome leads to some cross-origin issues with the volume rendering windows. If you wish to do development in Chrome (recommended), it's suggested you disable cross-origin restrictions by doing the following:
    * Create a folder called 'CrossOriginUserData' in 'C:\Users\\[CurrentUser]\AppData\Local\Google\Chrome\\', or wherever your 'Chrome/' folder is located
    * Create a new shortcut to the Chrome executable, which is likely found at 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
    * Right click on the shortcut and select 'Properties'
    * Add the following to the end of the 'Target' text box entry (without the single quotes): ' --disable-web-security --user-data-dir="C:\Users\\[CurrentUser]\AppData\Local\Google\Chrome\CrossOriginUserData"'. Note that the 'user-data-dir' field should be adjusted to the path of the folder you created in the first step.
    * Open a new Chrome window using this shortcut whenever doing development. **NOTE:** It is highly recommended you only use this window for development on the brain browser, as browsing other sites may be a security risk.
6. Open index.html in this new Chrome window
7. Disabling the browser cache is recommended. To do this in Chrome, press F12 to open the developer console, navigate to the 'Network' tab and select the 'Disable cache' checkbox. Keep the developer console open while working.

## TODO

### High

- [X] Scroll to zoom, z to reset
- [X] Share and load configurations with URL codes (selected lines, slice numbers, volume orientations, etc.)
- [ ] Color key in bottom right of Z window
- [ ] Hide/show 100-micron scale bar that changes with zoom in top-left of Z window

### Medium

- [ ] Bug: Color darkens in Z window at slice 117
- [ ] Bug: Full anatomy (z-brain and pajevic) doesn't show up in 3D volume window when loading from URL code
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
