/*
 * This file defines what should happen when the page loads and binds user input to corresponding functions
 */

const MIN_COLORS_HEIGHT = 0.05; // Minimum percentage height of draggable individual settings panel
const MAX_COLORS_HEIGHT = 0.9; // Maximum percentage height of draggable individual settings panel

var colorsAdjusting = false; // Checks if individual settings panel height is currently being adjusted
var colorsMouseY = 0; // Current y position of mouse on the page, used for tracking individual settings panel height
var lastColorsLoc = 0.33333; // Keeps track of last set height of individual settings panel (33.333% height by default, should match values in individualSettings.css)

var browser = 'Chrome'; // Default assumption

// Function that's called when every part of page has downloaded
// This function should be edited whenever you add/edit something you want to occur as soon as the page loads
function docReady() {
  // Check browser type
  if(navigator.userAgent.includes('Edge')) {
    browser = 'Edge';
  } else if(navigator.userAgent.includes('Chrome')) {
    browser = 'Chrome';
  } else if(navigator.userAgent.includes('Safari')) {
    browser = 'Safari';
  } else if(navigator.userAgent.includes('Firefox')) {
    browser = 'Firefox';
  }
  
	// Sets positions/dimensions of windows/sliders in left panel
	// This was primarily useful back when the user had 4 layout options, but should now be left untouched
	setLayout();
	
	// NOTE: append ALL huc-cer stuff here!!!
	
	bindSliderAndNumberInputs(HUC_CER[0]); // Binding inputs for HuC-Cer volumes
	resetIndividual(HUC_CER[0]); // Resetting HuC-Cer volumes
	
	// Creating HuC-Cer's color input and setting its color to white
	$('#' + HUC_CER[0] + '-color').attr('data-content', popoverContent('changeColor', '\'' + HUC_CER[0] + '-color-span\', \'' + HUC_CER[0] + '\''));
	changeColor('col-3', '1.0', '1.0', '1.0', HUC_CER[0] + '-color-span', HUC_CER[0]);
	
	// The blue crosshair lines (and other graphics) in the slicer windows have a pixel-based location
	// Thus, this function updates the location of the lines based on the window size whenever the size of the window is changed
	updateLines();
	$(window).resize(function() {
		updateLines(); // Blue crosshair lines
		updateProjMarkers(); // Brown partial projection lines
		updateSSVolumeAttribs(); // Spatial search yellow box
	});
	
	// Enabling color picker popovers
	$('[data-toggle="popover"]').popover();
	
	// Appending data to page on load, including lines lists in the Lines menu and anatomy volumes
	// See construction.js for details
	constructPage();
	
	// All mouse interactions with the x volume window
	$('#x-window').mousedown(function(evt) {
		if(!$(evt.target).hasClass('full-btn-img') && !$(evt.target).hasClass('btn')) { // Ignoring clicks if they're on a button (max or fullscreen buttons)
			if(evt.which == 1) { // Left-click event
				if(spatialSearchOn) {
					// Spatial search interactions
					if(firstAreaSelected === '') {
						firstAreaPressed('x', evt); // First box being selected
					} else {
						if(firstAreaSelected != 'x') { // Checks to make sure first box was not selected in x window
							secondAreaPressed('x', evt); // Second box being selected
						}
					}
				} else {
          if(evt.ctrlKey) {
            // Panning activated, see zoom.js
            screenHeld = 'x';
            lastZoomMouseX = evt.clientX;
            lastZoomMouseY = evt.clientY;
          } else {
            xBoxClicked(evt); // Updates crosshair lines and slicer locations on left click
          }
				}
			} else if(evt.which == 3 && !xFull && !spatialSearchOn) { // Right click event, also checks if x window is not in fullscreen and spatial search is not on
				setPartialProj('x', evt); // Updating partial projection
			}
		}
	});
	
	// All mouse interactions with the y volume window
	$('#y-window').mousedown(function(evt) {
		if(!$(evt.target).hasClass('full-btn-img') && !$(evt.target).hasClass('btn')) { // Ignoring clicks if they're on a button (max or fullscreen buttons)
			if(evt.which == 1) { // Left-click event
				if(spatialSearchOn) {
					// Spatial search interactions
					if(firstAreaSelected === '') {
						firstAreaPressed('y', evt); // First box being selected
					} else {
						if(firstAreaSelected != 'y') { // Checks to make sure first box was not selected in y window
							secondAreaPressed('y', evt); // Second box being selected
						}
					}
				} else {
          if(evt.ctrlKey) {
            // Panning activated, see zoom.js
            screenHeld = 'y';
            lastZoomMouseX = evt.clientX;
            lastZoomMouseY = evt.clientY;
          } else {
            yBoxClicked(evt); // Updates crosshair lines and slicer locations on left click
          }
				}
			} else if(evt.which == 3 && !yFull && !spatialSearchOn) { // Right click event, also checks if x window is not in fullscreen and spatial search is not on
				setPartialProj('y', evt);
			}
		}
	});
	
	// All mouse interactions with the z volume window
	$('#z-window').mousedown(function(evt) {
		if(!$(evt.target).hasClass('full-btn-img') && !$(evt.target).hasClass('btn')) { // Ignoring clicks if they're on a button (max or fullscreen buttons)
			if(evt.which == 1) { // Left-click event
				if(spatialSearchOn) {
					// Spatial search interactions
					if(firstAreaSelected === '') {
						firstAreaPressed('z', evt); // First box being selected
					} else {
						if(firstAreaSelected != 'z') { // Checks to make sure first box was not selected in z window
							secondAreaPressed('z', evt); // Second box being selected
						}
					}
				} else {
          if(evt.ctrlKey) {
            // Panning activated, see zoom.js
            screenHeld = 'z';
            lastZoomMouseX = evt.clientX;
            lastZoomMouseY = evt.clientY;
          } else {
            zBoxClicked(evt); // Updates crosshair lines and slicer locations on left click
          }
				}
			} else if(evt.which == 3 && !zFull && !spatialSearchOn) { // Right click event, also checks if x window is not in fullscreen and spatial search is not on
				setPartialProj('z', evt); // Updating partial projection
			}
		}
	});
	
	// Interactions when mouse is released in x window
	$('#x-window').mouseup(function(evt) {
		if(evt.which == 1 && spatialSearchOn) { // Left click released and spatial search is on
			if(firstAreaSelected === '') {
				if(firstAreaXPressed) { // Ensuring mouse was first pressed in x window
					firstAreaReleased('x', evt); // First spatial search area selected
				}
			} else {
				if(secondAreaXPressed) { // Ensuring mouse was first pressed in x window
					secondAreaReleased('x', evt); // Second spatial search area selected
				}
			}
		}
	});
	
	// Interactions when mouse is released in y window
	$('#y-window').mouseup(function(evt) {
		if(evt.which == 1 && spatialSearchOn) { // Left click released and spatial search is on
			if(firstAreaSelected === '') {
				if(firstAreaYPressed) { // Ensuring mouse was first pressed in y window
					firstAreaReleased('y', evt); // First spatial search area selected
				}
			} else {
				if(secondAreaYPressed) { // Ensuring mouse was first pressed in y window
					secondAreaReleased('y', evt); // Second spatial search area selected
				}
			}
		}
	});
	
	// Interactions when mouse is released in z window
	$('#z-window').mouseup(function(evt) {
		if(evt.which == 1 && spatialSearchOn) { // Left click released and spatial search is on
			if(firstAreaSelected === '') {
				if(firstAreaZPressed) { // Ensuring mouse was first pressed in z window
					firstAreaReleased('z', evt); // First spatial search area selected
				}
			} else {
				if(secondAreaZPressed) { // Ensuring mouse was first pressed in z window
					secondAreaReleased('z', evt); // Second spatial search area selected
				}
			}
		}
	});
	
	// Changes mouse cursor to grabbing hand when hovering over/clicking in the 3D volume view
	// This doesn't appear to work all the time, at least in Chrome, as sometimes it works but sometimes it interacts strangely
	// I haven't put a whole lot of time into fixing it however, as the issue is very small
	$('#volume-window').mousedown(function() {
		$(this).css('cursor', '-webkit-grabbing'); // "this" refers to the element that the mouse down event is bound to, in this case the #volume-window element
		$(this).css('cursor', 'grabbing');
	});
	$('#volume-window').mouseup(function() {
		$(this).css('cursor', '-webkit-grab');
		$(this).css('cursor', 'grab');
	});
	$('#volume-window').mouseenter(function() {
		$(this).css('cursor', '-webkit-grab');
		$(this).css('cursor', 'grab');
	});
	
	// Changes the height of the right panel when the window is loaded and whenever it's resized
	// This keeps the bottom of the right panel flush with the bottom of the left panel
	// See settingsView.js for details
	adjustRightDiv();
	$(window).resize(function() {
		adjustRightDiv();
	});
	$(window).bind('load', function() {
		adjustRightDiv();
	});
	
	// This will hide the currently open color popover if the user clicks another part of the screen while it's open
	// This does not seem to work perfectly in Firefox, and has been noted in TODO.txt
	$(window).mousedown(function(evt) {
		if(!$(evt.target).is('#' + openPopover + '-color') && !$(evt.target).is('#' + openPopover + '-settings-header') && !$(evt.target).hasClass('popover') && !$(evt.target).hasClass('color-picker') && !$(evt.target).hasClass('color-label')) {
			$('#' + openPopover + '-color').click();
		}
	});
  
  // Resetting camera panning, see zoom.js
  $(window).mouseup(function(evt) {
    if(evt.which == 1) { // Left mouse button
      screenHeld = '';
    }
  });
	
	// These functions keep track of whether the shift key is currently being held down, which is used to determine whether selected anatomy should be shown when shift-clicking
	// See windows.js
	$(document).keydown(function(evt) {
		if(evt.key == 'Shift') {
			shiftHeld = true;
		}
	});
	$(document).keyup(function(evt) {
		if(evt.key == 'Shift') {
			shiftHeld = false;
		}
	});
	
	// Performs a text search whenever the user types a key into the search bar, so it's updated in realtime
	$('#text-search-text').on('input', function() {
		searchInfo();
	});
	
	// Binds shortcut hotkeys, see function below
	setShortcuts();
	
	// Starts adjusting individual settings panel height when the dragger bar is clicked
	$('#colors-selection-dragger').mousedown(function(evt) {
		evt.preventDefault(); // Prevents glitchy behavior when dragging bar (evt.preventDefault() will always prevent the default event response associated with the given action)
		colorsMouseY = evt.pageY; // Updates y location of mouse on page
		colorsAdjusting = true; // Indicates height is being adjusted
	});
	
	// Updates individual settings height when draggable bar is moved
	$(document).mousemove(function(evt) {
		if(colorsAdjusting) { // Only occurs if bar has already been clicked
			var deltaY = colorsMouseY - evt.pageY; // Finding distance mouse has moved
			var containerHeight = $('#right-div-border').height(); // Height of right menu container
			var loc = lastColorsLoc + (deltaY / containerHeight); // Calculates new height of individual settings container (is a percentage of the right menu container's height)
			lastColorsLoc = loc; // Updates last height for new delta calculation
			
			// Clamps height to specific constants (so panel doesn't go above or below page)
			loc = Math.max(loc, MIN_COLORS_HEIGHT);
			loc = Math.min(loc, MAX_COLORS_HEIGHT);
			
			// Updates mouse location on page
			colorsMouseY = evt.pageY;
			
			// Calculating and settings new height of settings panel and new location of dragger bar
			var locText = (loc * 100) + '%';
			$('#colors-selection').css('height', locText);
			$('#colors-selection-dragger').css('bottom', 'calc(' + locText + ' - 4px)');
			$('.right-div').css('height', ((1 - loc) * 100) + '%');
		}
  });
	
	// Indicates settings bar is no longer being dragged when mouse is released
	$(document).mouseup(function() {
		if(colorsAdjusting) {
			colorsAdjusting = false;
		}
	});
  
  // Removing key from the "keyDown" list when it's released, allowing events for that key to fire once again
	$(document).keyup(function(evt) {
		if(evt.key) { // Preventing strange occurrence where keyup event may not have a key associated with it
			var key = evt.key.toLowerCase();
			var index = keysDown.indexOf(key);
			
			if(index > -1) {
				keysDown.splice(index, 1); // Removing key from keyDown list
			}
		}
	});
	
	// Fixing strange bug where HuC-Cer doesn't appear in 3D volume window at first
	// Calls reset function on HuC-Cer after small period time (after page and X3DOM is fully loaded)
	setTimeout(function() {
		resetIndividual(HUC_CER[0]);
    bindZoomFunctions(); // Must be bound after delay to work consistently
    prepareURLCodes(); // Load URL code state after everything else is ready, see urlCodes.js
	}, 250); // Time delayed before reset in milliseconds
}
$(document).ready(docReady);

// Binds scroll-to-zoom and panning functions to events
function bindZoomFunctions() {
  // Scroll-to-zoom functionality, see zoom.js
  $('#x3dom-x-window-canvas').on('wheel', function(evt) { // Binding to canvas element generated for x window
    scrollToZoom(evt, '#view-x');
  });
  $('#x3dom-y-window-canvas').on('wheel', function(evt) { // Binding to canvas element generated for y window
    scrollToZoom(evt, '#view-y');
  });
  $('#x3dom-z-window-canvas').on('wheel', function(evt) { // Binding to canvas element generated for z window
    scrollToZoom(evt, '#view-z');
  });
  
  // Handle camera panning while zoomed, see zoom.js
  $('#x3dom-x-window-canvas, #x3dom-y-window-canvas, #x3dom-z-window-canvas').mousemove(function(evt) {
    if(screenHeld != '') {
      panCamera(evt.clientX, evt.clientY);
    }
  });
}

// Keeps track of keys currently held down
var keysDown = [];

// Binds shortcut hotkeys to the actions they perform
function setShortcuts() {
	// Event where any key is pressed
	$(document).keydown(function(evt) {
		if(evt.target.id !== 'text-search-text' && !evt.target.className.includes('number-input') && evt.target.id !== 'custom-line-name-input' && evt.target.id !== 'url-code-field') { // Making sure the user is not currently typing into one of the input fields
			var key = evt.key.toLowerCase(); // Getting lower case version of key pressed so shift is irrelevant
			
			// Making sure key has not already been pressed without being released
			// This is important because the "keydown" event will fire in rapid succession when a user holds a key down, but we only want the hotkey's action to happen once
			if(!includes(keysDown, key)) {
				if(key == 'x') { // Show/hide line
					$('#line-show-checkbox').trigger('click');
				} else if(key == 'm') { // Show/hide all maximum projections
					var xMaxed = xProjOn && $('#' + HUC_CER_[0] + '-proj-x').attr('minLine') == 0.0 && $('#' + HUC_CER_[0] + '-proj-x').attr('maxLine') == 1.0;
					var yMaxed = yProjOn && $('#' + HUC_CER_[0] + '-proj-y').attr('minLine') == 0.0 && $('#' + HUC_CER_[0] + '-proj-y').attr('maxLine') == 1.0;
					var zMaxed = zProjOn && $('#' + HUC_CER_[0] + '-proj-z').attr('minLine') == 0.0 && $('#' + HUC_CER_[0] + '-proj-z').attr('maxLine') == 1.0;
					var allMaxed = xMaxed && yMaxed && zMaxed; // Checking if all windows are already in maximum projection
					
					if(allMaxed) {
						// Turning off all maximum projections
						toggleMaxProj(false, 'x', 0, 1);
						toggleMaxProj(false, 'y', 0, 1);
						toggleMaxProj(false, 'z', 0, 1);
					} else {
						// Turning on all maximum projections, even if some windows are already showing maximum or partial projections
						toggleMaxProj(true, 'x', 0, 1);
						toggleMaxProj(true, 'y', 0, 1);
						toggleMaxProj(true, 'z', 0, 1);
					}
					
					// Clearing partial projection lines
					clearProjX();
					clearProjY();
					clearProjZ();
				} else if(key == 'f') { // Jumping to text search
					$('#search-main-btn').trigger('click');
					$('#text-search-start-btn').trigger('click');
					$('#text-search-text').focus();
					evt.preventDefault(); // Preventing f key from being typed into text search input
				} else if(key == 'a') { // Hide/show full anatomy
					var fullBtnVisible = $('#show-full-btn').css('display') !== 'none';
					toggleFullAnatomy(activeAnatomy, fullBtnVisible ? 'hide-full-btn' : 'show-full-btn', fullBtnVisible); // Showing/hiding active anatomy
				} else if(key == 'z') { // Reset zoom, see zoom.js
					resetZoomAll();
				} else if(key == '1' || key == '2' || key == '3' || key == '4' || key == '5' || key == '6' || key == '7' || key == '8' || key == '9') { // 1-9 line toggle keys
					var index = parseInt(key) - 1;
					toggleSelection(index);
				}
				
				// Indicating that the key has been pressed
				keysDown.push(key);
			}
		}
	});
}
