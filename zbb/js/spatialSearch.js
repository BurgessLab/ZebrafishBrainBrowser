/*
 * This file handles the spatial search feature in the Search menu
 */

// Dimensions of the binary tif data used to generate the fragment binary files (should not be changed unless data is changed)
const STACK_WIDTH = 257;
const STACK_HEIGHT = 154;
const STACK_DEPTH = 105;

const LINE_COUNT = 276; // Total number of lines saved in the binary fragment data
const FRAG_SIZE = 8; // Side length of one volume fragment (each fragment represents a cubic subset of the total volume)

const HIGHLIGHT_UPDATE_FPS = 30; // How often the box highlighted is updated when dragging to select a search region
const HIGHLIGHT_UPDATE_TIME = parseInt(1000 / HIGHLIGHT_UPDATE_FPS); // Time between each highlight box render

var spatialSearchOn = false; // Whether spatial search is currently being performed (other functions like clicking to move blue crosshairs will be disabled)
var firstAreaSelected = ''; // Value is x, y, or z depending on which window is selected, '' if no area has been selected
var firstPointsSet = false; // Deprecated (unused)

// Keeps track of which slicer window was first clicked when selecting first region
// This is necessary to make sure the user clicked and released their mouse in the same window to make their first selection
var firstAreaXPressed = false;
var firstAreaYPressed = false;
var firstAreaZPressed = false;

// Keeps track of which slicer window was first clicked when selecting second region
// This is necessary to make sure the user clicked and released their mouse in the same window to make their second selection
var secondAreaXPressed = false;
var secondAreaYPressed = false;
var secondAreaZPressed = false;

// Current x and y mouse position, used for determining bounds on search areas (these are set in index.html)
var mouseX = -1;
var mouseY = -1;

// Maximum and minimum coordinate values of entire selected search volume
var xMin = 0;
var xMax = 0;
var yMin = 0;
var yMax = 0;
var zMin = 0;
var zMax = 0;

var ssHighlighted = false; // Keeps track of whether spatial search areas are currently being rendered in slice windows

// Values used to track locations of highlighted regions in slicer windows
// These affect the highlighted graphic ONLY, has no effect on the search results

// X window min and max coordinates
var ssxp1x = -1;
var ssxp1y = -1;
var ssxp2x = -1;
var ssxp2y = -1;

// Y window min and max coordinates
var ssyp1x = -1;
var ssyp1y = -1;
var ssyp2x = -1;
var ssyp2y = -1;

// Z window min and max coordinates
var sszp1x = -1;
var sszp1y = -1;
var sszp2x = -1;
var sszp2y = -1;

// Turns on/off highlighting of selected spatial search region
function toggleSSHighlighting(enabled) {
	ssHighlighted = enabled;
	updateSSVolumeAttribs(); // Updates values like search box location and size in slice windows
}

// Updates highlighted region in the slicer windows based on selected region values
// This function affects the highlighted graphic ONLY, has no effect on search results
function ssHighlightUpdate() {
	setTimeout(function() { // Timeout function allows for a recursive refresh of the highlighted area every given interval of time
		if(spatialSearchOn) { // Only does anything is spatial search is currently being conducted
			if(firstAreaXPressed) { // First area being selected in x window
				var panelOffset = ($('#left-panel-container').width() - $('#left-panel').width()) / 2; // Getting margin between left edge of screen and left side of x window in pixels

				var xX = $('#x-window').position().left; // X location of x window (from left)
				var xY = $('#x-window').position().top; // Y location of y window (from top)
				var xW = $('#x-window').width(); // Width of x window
				var xH = $('#x-window').height(); // Height of x window

				var relX = 1 - (mouseX - panelOffset - xX) / xW; // Calculating x location of mouse inside X window (0 being left side of window, 1 being right side)
				var relY = (mouseY - panelOffset - xY) / xH; // Calculating y location of mouse inside Y window (0 being top of window, 1 being bottom)

				yMax = relX; // X location of mouse in x window represents volume's y depth
				zMax = relY; // Y location of mouse in x window represents volume's z depth
			} else if(firstAreaYPressed) { // See similar comments above
				var panelOffset = ($('#left-panel-container').width() - $('#left-panel').width()) / 2;

				var yX = $('#y-window').position().left;
				var yY = $('#y-window').position().top;
				var yW = $('#y-window').width();
				var yH = $('#y-window').height();

				var relX = (mouseX - panelOffset - yX) / yW;
				var relY = (mouseY - panelOffset - yY) / yH;

				xMax = relX; // X location of mouse in y window is x depth on whole volume
				zMax = relY; // Y location of mouse in y window is z depth on whole volume
			} else if(firstAreaZPressed) { // See similar comments above
				var panelOffset = ($('#left-panel-container').width() - $('#left-panel').width()) / 2;

				var zX = $('#z-window').position().left;
				var zY = $('#z-window').position().top;
				var zW = $('#z-window').width();
				var zH = $('#z-window').height();

				var relX = (mouseX - panelOffset - zX) / zW;
				var relY = 1 - (mouseY - panelOffset - zY) / zH;

				xMax = relX; // X location of mouse in z window is x depth on whole volume
				yMax = relY; // Y location of mouse in z window is y depth on whole volume
			}

			// Second area being selected in another window
			// See comments above for how mouse location calculations work
			if(secondAreaXPressed) { // Second area being selected in x window
				if(firstAreaSelected == 'y') { // First area was selected in y window
					var panelOffset = ($('#left-panel-container').width() - $('#left-panel').width()) / 2;

					var xX = $('#x-window').position().left;
					var xW = $('#x-window').width();

					var relX = 1 - (mouseX - panelOffset - xX) / xW;
					yMax = relX;
				} else if(firstAreaSelected == 'z') { // First area was selected in z window
					var panelOffset = ($('#left-panel-container').width() - $('#left-panel').width()) / 2;

					var xY = $('#x-window').position().top;
					var xH = $('#x-window').height();

					var relY = (mouseY - panelOffset - xY) / xH;
					zMax = relY;
				}
			} else if(secondAreaYPressed) { // Second area being selected in y window
				if(firstAreaSelected == 'x') { // First area was selected in x window
					var panelOffset = ($('#left-panel-container').width() - $('#left-panel').width()) / 2;

					var yX = $('#y-window').position().left;
					var yW = $('#y-window').width();

					var relX = (mouseX - panelOffset - yX) / yW;
					xMax = relX;
				} else if(firstAreaSelected == 'z') { // First area was selected in z window
					var panelOffset = ($('#left-panel-container').width() - $('#left-panel').width()) / 2;

					var yY = $('#y-window').position().top;
					var yH = $('#y-window').height();

					var relY = (mouseY - panelOffset - yY) / yH;
					zMax = relY;
				}
			} else if(secondAreaZPressed) { // Second area being selected in z window
				if(firstAreaSelected == 'x') { // First area was selected in x window
					var panelOffset = ($('#left-panel-container').width() - $('#left-panel').width()) / 2;

					var zX = $('#z-window').position().left;
					var zW = $('#z-window').width();

					var relX = (mouseX - panelOffset - zX) / zW;
					xMax = relX;
				} else if(firstAreaSelected == 'y') { // First area was selected in y window
					var panelOffset = ($('#left-panel-container').width() - $('#left-panel').width()) / 2;

					var zY = $('#z-window').position().top;
					var zH = $('#z-window').height();

					var relY = 1 - (mouseY - panelOffset - zY) / zH;
					yMax = relY;
				}
			}

			// Updating values used to calculate minimum/maximum coordinate locations of highlighted yellow selection box
			// These values range from 0 to 1, 0 being the top/left sides of the window, 1 being the bottom/right sides

			// Location of highlight box in x window
			ssxp1x = 1 - yMin;
			ssxp1y = 1 - zMin;
			ssxp2x = 1 - yMax;
			ssxp2y = 1 - zMax;

			// Location of highlight box in y window
			ssyp1x = xMin;
			ssyp1y = 1 - zMin;
			ssyp2x = xMax;
			ssyp2y = 1 - zMax;

			// Location of highlight box in z window
			sszp1x = xMin;
			sszp1y = yMin;
			sszp2x = xMax;
			sszp2y = yMax;

			updateSSVolumeAttribs(); // Updates the slicer volume attributes using these newly calculated coordinate values
			ssHighlightUpdate(); // Calls this function again for recursive effect, allowing highlighted box location to be updating while user is making selection
		}
	}, HIGHLIGHT_UPDATE_TIME); // Update is repeated every HIGHLIGHT_UPDATE_TIME milliseconds, as to update the box sizes in real time while the user is dragging their selection
}

// Updates location values of highlighted yellow region in slicer windows
function updateSSVolumeAttribs() {
	$('.volume-x, .volume-y, .volume-z').attr('ssHighlighted', ssHighlighted ? 1.0 : 0.0); // Turns on/off highlighting

	if(ssHighlighted) {
		var xWidth = $('#x-window').width() * window.devicePixelRatio;
		var xHeight = $('#x-window').height() * window.devicePixelRatio;
		$('.volume-x').attr('ssp1x', ssxp1x * xWidth).attr('ssp2x', ssxp2x * xWidth).attr('ssp1y', ssxp1y * xHeight).attr('ssp2y', ssxp2y * xHeight); // Setting X window min and max coordinates

		var yWidth = $('#y-window').width() * window.devicePixelRatio;
		var yHeight = $('#y-window').height() * window.devicePixelRatio;
		$('.volume-y').attr('ssp1x', ssyp1x * yWidth).attr('ssp2x', ssyp2x * yWidth).attr('ssp1y', ssyp1y * yHeight).attr('ssp2y', ssyp2y * yHeight); // Setting Y window min and max coordinates

		var zWidth = $('#z-window').width() * window.devicePixelRatio;
		var zHeight = $('#z-window').height() * window.devicePixelRatio;
		$('.volume-z').attr('ssp1x', sszp1x * zWidth).attr('ssp2x', sszp2x * zWidth).attr('ssp1y', sszp1y * zHeight).attr('ssp2y', sszp2y * zHeight); // Setting Z window min and max coordinates
	}
}

// Hides the text search panel and shows the spatial search panel in the Search menu
function showSearch() {
	$('#text-search-div').css('display', 'none');
	$('#spatial-search-div').css('display', 'block');
	$('#text-search-start-btn').removeClass('active');
	$('#ss-show-btn').addClass('active');
}

// Begins spatial search routine after pressing 'Start' button
function startSearch() {
  toggleSSHighlighting(false);
  $('#ss-reset-btn').css('display', 'none');

	if(!window.Worker) {
		$('#ss-message').text('Your browser does not support Web Workers, so a spatial search cannot be performed. Please update your browser and try again.');
		$('#ss-message').css('display', 'block');
		console.warn('Your browser does not support Web Workers, so a spatial search cannot be performed. Please update your browser and try again.');
		return;
	}

	clearProjX();
	clearProjY();
	clearProjZ();

	if(xFull) {
		toggleFullscreen('x');
	}
	if(yFull) {
		toggleFullscreen('y');
	}
	if(zFull) {
		toggleFullscreen('z');
	}
	if(vFull) {
		toggleFullscreen('full');
	}

	if(xProjOn) {
		toggleMaxProj(false, 'x', 0, 1);
	}
	if(yProjOn) {
		toggleMaxProj(false, 'y', 0, 1);
	}
	if(zProjOn) {
		toggleMaxProj(false, 'z', 0, 1);
	}

	$('.full-btn').prop('disabled', true);
	$('.mp-btn').prop('disabled', true);

	spatialSearchOn = true;
	$('#ss-message').text('-click and drag in any view to select an area\n-note: zooming is disabled');
	$('#ss-start-btn').css('display', 'none');
	$('#ss-message').css('display', 'block');
}

// Gets X position of mouse inside specified event target (one of the slicer windows), normalized from 0-1
function getPosX(evt) {
	var bbox = evt.target.getBoundingClientRect(); // Gets bounding box of window

	var pX = parseInt(evt.clientX - bbox.left); // X location of mouse in pixels
	var boxW = parseInt(bbox.right - bbox.left); // Width of window in pixels

	var posX = pX / boxW; // Normalized X position (0-1)
	return posX;
}

// Gets Y position of mouse inside specified event target (one of the slicer windows), normalized from 0-1
function getPosY(evt) {
	var bbox = evt.target.getBoundingClientRect(); // Gets bounding box of window

	var pY = parseInt(evt.clientY - bbox.top); // Y location of mouse in pixels
	var boxH = parseInt(bbox.bottom - bbox.top); // Height of window in pixels

	var posY = pY / boxH; // Normalized Y position (0-1)
	return posY;
}

// Function called when user clicks a window while selecting the first searc area (bound in ready.js)
function firstAreaPressed(id, evt) {
	toggleSSHighlighting(true); // Turns on yellow highlight box in slicer windows
	ssHighlightUpdate(); // Starts update loop of yellow box position

	// Determining which window is selected
	firstAreaXPressed = id == 'x';
	firstAreaYPressed = id == 'y';
	firstAreaZPressed = id == 'z';

	// Getting 3D location of click
	// Uses slicer input values (.val()) for axis of window that's clicked
	if(id == 'x') {
		xMin = $('#x-input').val();
		yMin = 1 - getPosX(evt); // Using 1 minus to measure yMin from right side of window instead of left
		zMin = getPosY(evt);
	} else if(id == 'y') {
		xMin = getPosX(evt);
		yMin = $('#y-input').val();
		zMin = getPosY(evt);
	} else if(id == 'z') {
		xMin = getPosX(evt);
		yMin = 1 - getPosY(evt); // Using 1 minus to measure yMin from right side of window instead of left
		zMin = $('#z-input').val();
	}

	// Setting max and min values to be same so highlighted region starts out with 0 area
	xMax = xMin;
	yMax = yMin;
	zMax = zMin;

	// Updates slicer volume attributes (highlighted box display)
	updateSSVolumeAttribs();
}

// Function called when user released their mouse to finalize their first area selection
function firstAreaReleased(id, evt) {
	// Indicating first area is no longer being selected
	firstAreaXPressed = false;
	firstAreaYPressed = false;
	firstAreaZPressed = false;

	// Settings values based on which window selection was made in
	if(id == 'x') {
		// Saving first point that was selected on user's click
		var lastX = xMin;
		var lastY = yMin;
		var lastZ = zMin;

		// Getting location of mouse when released, capturing second selection point
		var thisX = $('#x-input').val();
		var thisY = 1 - getPosX(evt); // Using 1 minus to measure thisY from right side of window instead of left
		var thisZ = getPosY(evt);

		// Finding maximum and minimum values of the two selected points
		// xMin and xMax will be the same because the selection was made in the X window (same x slice used), the x range of the search region will be determined when the user selects the second area
		xMin = Math.min(lastX, thisX);
		xMax = Math.max(lastX, thisX);

		yMin = Math.min(lastY, thisY);
		yMax = Math.max(lastY, thisY);

		zMin = Math.min(lastZ, thisZ);
		zMax = Math.max(lastZ, thisZ);
	} else if(id == 'y') { // See similar comments above
		var lastX = xMin;
		var lastY = yMin;
		var lastZ = zMin;

		var thisX = getPosX(evt);
		var thisY = $('#y-input').val();
		var thisZ = getPosY(evt);

		xMin = Math.min(lastX, thisX);
		xMax = Math.max(lastX, thisX);

		yMin = Math.min(lastY, thisY);
		yMax = Math.max(lastY, thisY);

		zMin = Math.min(lastZ, thisZ);
		zMax = Math.max(lastZ, thisZ);
	} else if(id == 'z') { // See similar comments above
		var lastX = xMin;
		var lastY = yMin;
		var lastZ = zMin;

		var thisX = getPosX(evt);
		var thisY = 1 - getPosY(evt);
		var thisZ = $('#z-input').val();

		xMin = Math.min(lastX, thisX);
		xMax = Math.max(lastX, thisX);

		yMin = Math.min(lastY, thisY);
		yMax = Math.max(lastY, thisY);

		zMin = Math.min(lastZ, thisZ);
		zMax = Math.max(lastZ, thisZ);
	}

	firstAreaSelected = id; // Indicating which window the first selection was made in, this is to prevent user from making second selection in the same window
	$('#ss-message').text('-first area selected (yellow box)\n-click and drag in a second view to complete volume'); // Telling user next steps
}

// Function called when user clicks to select second region (bound in ready.js)
function secondAreaPressed(id, evt) {
	// Determining which window was clicked in selecting second area
	// Window clicked will never be same as window of first selected area (see ready.js)
	secondAreaXPressed = id == 'x';
	secondAreaYPressed = id == 'y';
	secondAreaZPressed = id == 'z';

	// Checking which window was selected, setting location of click accordingly, similar to logic when clicking to select first region
	// Note however that only one axis will be affected when selecting the second region, as the first two dimensions were determined when selecting the first area
	if(id == 'x') {
		if(firstAreaSelected == 'y') {
			yMin = 1 - getPosX(evt);
			yMax = yMin;
		} else if(firstAreaSelected == 'z') {
			zMin = getPosY(evt);
			zMax = zMin;
		}
	} else if(id == 'y') {
		if(firstAreaSelected == 'x') {
			xMin = getPosX(evt);
			xMax = xMin;
		} else if(firstAreaSelected == 'z') {
			zMin = getPosY(evt);
			zMax = zMin;
		}
	} else if(id == 'z') {
		if(firstAreaSelected == 'x') {
			xMin = getPosX(evt);
			xMax = xMin;
		} else if(firstAreaSelected == 'y') {
			yMin = 1 - getPosY(evt);
			yMax = yMin;
		}
	}
}

// Function called when user releases mouse to finalizing second selected area, bound in ready.js
function secondAreaReleased(id, evt) {
	// Indicating second selection has finished
	secondAreaXPressed = false;
	secondAreaYPressed = false;
	secondAreaZPressed = false;

	$('#ss-message').text('Loading results...'); // Informing user search calculation has begun

	// Getting location of where mouse was located on release, finalizing bounds of search region
	// This logic is similar to firstAreaReleased(), but note that only one dimension is affected here based on which window the second selection was made in
	if(id == 'x') {
		if(firstAreaSelected == 'y') {
			var lastY = yMin;
			var thisY = 1 - getPosX(evt);

			yMin = Math.min(lastY, thisY);
			yMax = Math.max(lastY, thisY);
		} else if(firstAreaSelected == 'z') {
			var lastZ = zMin;
			var thisZ = getPosY(evt);

			zMin = Math.min(lastZ, thisZ);
			zMax = Math.max(lastZ, thisZ);
		}
	} else if(id == 'y') {
		if(firstAreaSelected == 'x') {
			var lastX = xMin;
			var thisX = getPosX(evt);

			xMin = Math.min(lastX, thisX);
			xMax = Math.max(lastX, thisX);
		} else if(firstAreaSelected == 'z') {
			var lastZ = zMin;
			var thisZ = getPosY(evt);

			zMin = Math.min(lastZ, thisZ);
			zMax = Math.max(lastZ, thisZ);
		}
	} else if(id == 'z') {
		if(firstAreaSelected == 'x') {
			var lastX = xMin;
			var thisX = getPosX(evt);

			xMin = Math.min(lastX, thisX);
			xMax = Math.max(lastX, thisX);
		} else if(firstAreaSelected == 'y') {
			var lastY = yMin;
			var thisY = 1 - getPosY(evt);

			yMin = Math.min(lastY, thisY);
			yMax = Math.max(lastY, thisY);
		}
	}

	doSearch(); // Starting search calculations
}

// Once the bounds of the search volume have been determined by user selection, this function will calculate the percent volume occupancy of each line in the selected volume based on data in the binary fragment files
function doSearch() {
	// Finding bounds of the search region based on the dimensions of the binary tifs (converting from normalized 0-1 values to pixel values)
	var minW = parseInt(xMin * STACK_WIDTH);
	var maxW = parseInt(xMax * STACK_WIDTH);
	var minH = parseInt(yMin * STACK_HEIGHT);
	var maxH = parseInt(yMax * STACK_HEIGHT);
	var minD = parseInt(zMin * STACK_DEPTH);
	var maxD = parseInt(zMax * STACK_DEPTH);

	// Finding index range of fragments needed to be searched
	var startFragW = parseInt(minW / FRAG_SIZE);
	var endFragW = parseInt(maxW / FRAG_SIZE);
	var startFragH = parseInt(minH / FRAG_SIZE);
	var endFragH = parseInt(maxH / FRAG_SIZE);
	var startFragD = parseInt(minD / FRAG_SIZE);
	var endFragD = parseInt(maxD / FRAG_SIZE);

	const TOTAL_VOLUME = (maxW - minW + 1) * (maxH - minH + 1) * (maxD - minD + 1); // Total volume of selected region in pixels
	const FILES_NEEDED = (endFragW - startFragW + 1) * (endFragH - startFragH + 1) * (endFragD - startFragD + 1); // Total number of fragment files needed to be searched

	var stackSums = new Array(LINE_COUNT + 1).join('0').split('').map(parseFloat); // Creates empty array of zeroes to store sums of binary data for every line
	var workersFinished = 0; // Keeps track of number of web workers finished parsing fragment data, will be used to determine when all files have successfully been read

	// Looping through all fragments needed to be searched
	for(var d = startFragD; d <= endFragD; d++) {
		for(var h = startFragH; h <= endFragH; h++) {
			for(var w = startFragW; w <= endFragW; w++) {
				var fragFile = 'res/ssBinaries/frag-' + w + '-' + h + '-' + d + '.bin'; // Getting URL of binary fragment file

				// Starting AJAX request to load binary data as an array
				var xhr = new XMLHttpRequest();
				xhr.open('GET', fragFile);
				xhr.responseType = 'arraybuffer';

				// Function called when file is successfully loaded
				// This uses the Web Workers API to speed up parsing of fragment files: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
				xhr.onload = function(evt) {
					var w = new Worker('js/searchFrag.js'); // Creating new Web Worker to parse data from a single fragment file, assigning it to run searchFrag.js

					// Telling worker what to do when it's finished running searchFrag.js
					w.addEventListener('message', function(evt) {
						var data = evt.data; // Getting results data returned from searchFrag.js (sums for all line volumes)
						stackSums = stackSums.map(function(val, i) { return val + data[i] }); // Adding sums from this fragment's results to total results (map function adds values in both arrays with corresponding indices)

						// Destroying worker
						w.terminate();
						w = undefined;

						// Checking if all files are finished being read
						workersFinished++;
						if(workersFinished == FILES_NEEDED) {
							continueSearch(stackSums, TOTAL_VOLUME); // Continuing search on completion
						}
					}, false);

					// Getting indices of current fragment from its file name
					var url = evt.target.responseURL;
					var urlParts = url.split('/');
					var fileName = urlParts[urlParts.length - 1];
					var fragTitle = fileName.split('.')[0];
					var fragValues = fragTitle.split('-');

					// Index values
					var thisW = parseInt(fragValues[1]);
					var thisH = parseInt(fragValues[2]);
					var thisD = parseInt(fragValues[3]);

					var message = [this.response, thisD, thisH, thisW, minW, maxW, minH, maxH, minD, maxD, LINE_COUNT, FRAG_SIZE, STACK_WIDTH, STACK_HEIGHT, STACK_DEPTH]; // Storing data to be used by worker in searchFrag.js
					w.postMessage(message); // Telling worker to begin running searchFrag.js, given the provided data
											// Note that this is called BEFORE the response function assigned by addEventListener() above
				}

				xhr.send(); // Starting request to retrieve fragment file, note that this is called BEFORE the onload function above
			}
		}
	}
}

// Part of spatial search done after all necessary data has been read from the binary fragment files
function continueSearch(stackSums, totalVolume) {
	var percentages = stackSums.map(function(val) { return (val / totalVolume * 100).toFixed(2); }); // Creates array of percent volume occupancy for each line rounded to 2 decimal places
	var pairs = []; // Array used to match line names to corresponding percentage values

	// Looping through all percentages (all lines)
	$.each(percentages, function(i, val) {
		if(val > 0) {
			var thisID;
			var thisName;

			// Finding ID for each percentage value using its array index
			// See Python script for generating spatial search data to see how this order is determined
			if(i == 0) { // HuC-Cer always first
				thisID = 'huc-cer';
				thisName = 'HuC-Cer';
			} else if((i - 1) < TRANSGENIC.length) { // Transgenic list second
				thisID = TRANSGENIC[i - 1];
				thisName = TRANSGENIC_NAMES[i - 1];
			} else if((i - TRANSGENIC.length - 1) < GAL4.length) { // Gal4 lines third
				thisID = GAL4[i - TRANSGENIC.length - 1];
				thisName = GAL4_NAMES[i - TRANSGENIC.length - 1];
			} else if((i - GAL4.length - TRANSGENIC.length - 1) < CRE.length) { // Cre lines
				thisID = CRE[i - GAL4.length - TRANSGENIC.length - 1];
				thisName = CRE_NAMES[i - GAL4.length - TRANSGENIC.length - 1];
			} else { // Misc lines
				thisID = MISC[i - GAL4.length - TRANSGENIC.length - 1 - CRE.length];
				thisName = MISC_NAMES[i - GAL4.length - TRANSGENIC.length - 1 - CRE.length];
			}

			// Adds new line name/percentage pair to pairs array
			pairs.push({id:thisID, name:thisName, percentage:val});
		}
	});

	// Percentages are originally in the order they are stored in the binary fragment data
	// This function sorts the name/percentage pairs in decreasing order by percentage values
	pairs.sort(function(a, b) { return b.percentage - a.percentage; });

	var tableData = ''; // Stores HTML code to represent results data

	// Looping through all pairs
	$.each(pairs, function(i, val) {
		if(val.percentage > 0) { // Ignoring line in the results if it was not present in the selected region at all
			// Constructing table row for each result
			tableData += 	'<tr>' +
								'<td>' + '<input id="' + val.id + '-ss-checkbox" class="' + val.id + '-ss-checkbox float-left" type="checkbox" onchange="$(\'#' + val.id + '-checkbox\').trigger(\'click\');" ' + (includes(currRender, val.id) ? 'checked' : '') + ' /><label class="settings-label float-left ss-label" for="' + val.id + '-ss-checkbox">' + val.name + '</label></td>' +
								'<td>' + val.percentage + '</td>' +
							'</tr>';
		}
	});

	$('#ss-table-body').html(tableData); // Appending results to table
	resetSearch(); // Resetting spatial search values since search is now finished
}

// Resets all global values when the search is complete
function resetSearch() {
	firstAreaSelected = ''; // Window first selection was made in
	spatialSearchOn = false; // Whether spatial search is currently being performed
	firstPointsSet = false; // Deprecated value (unused)

	// Minimum and maximum coordinates of selection made (used only for yellow highlight boxes)
	ssxp1x = -1;
	ssxp1y = -1;
	ssxp2x = -1;
	ssxp2y = -1;

	ssyp1x = -1;
	ssyp1y = -1;
	ssyp2x = -1;
	ssyp2y = -1;

	sszp1x = -1;
	sszp1y = -1;
	sszp2x = -1;
	sszp2y = -1;

	// Minimum and maximum values of the search volume
	xMin = 0;
	xMax = 0;
	yMin = 0;
	yMax = 0;
	zMin = 0;
	zMax = 0;

	// Re-enabling fullscreen and maximum projection buttons
	$('.full-btn').prop('disabled', false);
	$('.mp-btn').prop('disabled', false);

	// Resetting message text and showing "Start" and "Reset" button again
	$('#ss-message').css('display', 'none');
	$('#ss-start-btn').css('display', 'initial');
  $('#ss-reset-btn').css('display', 'inline-block');
	$('#ss-message').text('');
}

// Clears the table and yellow boxes and removes "Reset" button
function resetAll() {
  $('#ss-table-body').html('');
  toggleSSHighlighting(false);
  $('#ss-reset-btn').css('display', 'none');
}
