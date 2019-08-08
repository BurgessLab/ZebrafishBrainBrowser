/*
 * This file manages maximum and partial projections
 */

// Keeps track of whether first point has been marked for partial projection
var xProjMarked1 = false;
var yProjMarked1 = false;
var zProjMarked1 = false;

// Keeps track of whether second point has been marked for partial projection
var xProjMarked2 = false;
var yProjMarked2 = false;
var zProjMarked2 = false;

// Coordinate values of brown lines in X, Y, and Z windows respectively
// These values are only used for rendering the brown lines in the right location
var xPointX1 = 0;
var xPointY1 = 0;
var yPointX1 = 0;
var yPointY1 = 0;
var zPointX1 = 0;
var zPointY1 = 0;

var xPointX2 = 0;
var xPointY2 = 0;
var yPointX2 = 0;
var yPointY2 = 0;
var zPointX2 = 0;
var zPointY2 = 0;

// Keeps track of which projection windows are currently on/visible
var xProjOn = false;
var yProjOn = false;
var zProjOn = false;

// Creates/removes a maximum or partial projection
// Maximum projections will always have val1 and val2 equal to 0 and 1, indicating that the entire volume should be projected
function toggleMaxProj(checked, id, val1, val2) {
	if(checked) { // Projection enabled
		var min = Math.min(val1, val2);
		var max = Math.max(val1, val2);

		$.each(currRender, function(i, line) {
			$('#' + line + '-proj-' + id).attr('minLine', min);
			$('#' + line + '-proj-' + id).attr('maxLine', max);
		});

		$('#proj-scene-' + id).attr('render', 'true');

		$('#proj-' + id + '-window').css('display', 'initial');
		$('#' + id + '-window').css('display', 'none');
	} else { // Projection disabled
		$('#proj-scene-' + id).attr('render', 'false'); // Turning off rendering in projection window

		$('#' + id + '-window').css('display', 'initial'); // Showing slice window
		$('#proj-' + id + '-window').css('display', 'none'); // Hiding projection window
	}

	// Updating whether projections are currently on
	if(id == 'x') {
		xProjOn = checked;
	} else if(id == 'y') {
		yProjOn = checked;
	} else {
		zProjOn = checked;
	}

	// Applies color inversion to projection windows shortly after it's turned on
	// This is done to ensure color inversion is set correctly when turning on projections
	setTimeout(function() {
		var colorInverted = $('#invert-input').prop('checked'); // Checks whether color is currently inverted
		applyColorInversion(colorInverted, false); // Updates color inversion in projection windows
	}, 100); // This function runs 100 milliseconds after being set
}

// Updates partial projection lines in slicer windows
function updateProjMarkers() {
	// Looping through all currently rendered lines
	$.each(currRender, function(i, val) {
		// Calculating current width and height of all slicer windows
		// window.devicePixelRatio is used because many browsers will use this value to automatically scale up size of all elements on high resolution screens (meaning results of width() and height() functions won't be accurate)
		var xW = $('#x-window').width() * window.devicePixelRatio;
		var xH = $('#x-window').height() * window.devicePixelRatio;
		var yW = $('#y-window').width() * window.devicePixelRatio;
		var yH = $('#y-window').height() * window.devicePixelRatio;
		var zW = $('#z-window').width() * window.devicePixelRatio;
		var zH = $('#z-window').height() * window.devicePixelRatio;

    // Adjust absolute coordinates for current zoom/pan frustum in each window (see zoom.js)
    var fovX = parseFloat($('#view-x').attr('fieldOfView'));
    var fovY = parseFloat($('#view-y').attr('fieldOfView'));
    var fovZ = parseFloat($('#view-z').attr('fieldOfView'));

    var [xP1x, xP1y] = zoomTransform(xPointX1 * xW, (1 - xPointY1) * xH, fovX, camXPos[0], camXPos[1], X_CAM_DIST, xW, xH, Y_SIZE, Z_SIZE, -1);
    var [yP1x, yP1y] = zoomTransform(yPointX1 * yW, (1 - yPointY1) * yH, fovY, camYPos[0], camYPos[1], Y_CAM_DIST, yW, yH, X_SIZE, Z_SIZE, -1);
    var [zP1x, zP1y] = zoomTransform(zPointX1 * zW, (1 - zPointY1) * zH, fovZ, camZPos[0], camZPos[1], Z_CAM_DIST, zW, zH, X_SIZE, Y_SIZE, -1);

    var [xP2x, xP2y] = zoomTransform(xPointX2 * xW, (1 - xPointY2) * xH, fovX, camXPos[0], camXPos[1], X_CAM_DIST, xW, xH, Y_SIZE, Z_SIZE, -1);
    var [yP2x, yP2y] = zoomTransform(yPointX2 * yW, (1 - yPointY2) * yH, fovY, camYPos[0], camYPos[1], Y_CAM_DIST, yW, yH, X_SIZE, Z_SIZE, -1);
    var [zP2x, zP2y] = zoomTransform(zPointX2 * zW, (1 - zPointY2) * zH, fovZ, camZPos[0], camZPos[1], Z_CAM_DIST, zW, zH, X_SIZE, Y_SIZE, -1);

		// Updating first marker location in slicer windows
		// not(.proj-x) indicates this value should not be changed in the projection windows
		$('.' + val + '-volume-x:not(.proj-x)').attr('markerLoc1', xP1x + ' ' + xP1y + ' 0.0');
		$('.' + val + '-volume-y:not(.proj-y)').attr('markerLoc1', yP1x + ' ' + yP1y + ' 0.0');
		$('.' + val + '-volume-z:not(.proj-z)').attr('markerLoc1', zP1x + ' ' + zP1y + ' 0.0');

		// Updating second marker location
		$('.' + val + '-volume-x:not(.proj-x)').attr('markerLoc2', xP2x + ' ' + xP2y + ' 0.0');
		$('.' + val + '-volume-y:not(.proj-y)').attr('markerLoc2', yP2x + ' ' + yP2y + ' 0.0');
		$('.' + val + '-volume-z:not(.proj-z)').attr('markerLoc2', zP2x + ' ' + zP2y + ' 0.0');

		// Updating whether first marker should be rendered (i.e. first partial projection selection is made)
		$('.' + val + '-volume-x:not(.proj-x)').attr('renderMarker1', xProjMarked1 ? 1.0 : 0.0);
		$('.' + val + '-volume-y:not(.proj-y)').attr('renderMarker1', yProjMarked1 ? 1.0 : 0.0);
		$('.' + val + '-volume-z:not(.proj-z)').attr('renderMarker1', zProjMarked1 ? 1.0 : 0.0);

		// Updating whether second marker should be rendered (i.e. second partial projection selection is made)
		$('.' + val + '-volume-x:not(.proj-x)').attr('renderMarker2', xProjMarked2 ? 1.0 : 0.0);
		$('.' + val + '-volume-y:not(.proj-y)').attr('renderMarker2', yProjMarked2 ? 1.0 : 0.0);
		$('.' + val + '-volume-z:not(.proj-z)').attr('renderMarker2', zProjMarked2 ? 1.0 : 0.0);
	});
}

// Clears partial projection lines in x window
function clearProjX() {
	xProjMarked1 = false;
	xProjMarked2 = false;
	updateProjMarkers();
}

// Clears partial projection lines in y window
function clearProjY() {
	yProjMarked1 = false;
	yProjMarked2 = false;
	updateProjMarkers();
}

// Clears partial projection lines in z window
function clearProjZ() {
	zProjMarked1 = false;
	zProjMarked2 = false;
	updateProjMarkers();
}

// Function called whenever user right-clicks to select a partial projection (both first and second selections)
// This is bound to right-click in ready.js
function setPartialProj(id, evt) {
	// Checking if first line has been marked but not second
	var isMarked;
	if(id == 'x') {
		isMarked = xProjMarked1 && !xProjMarked2;
	} else if(id == 'y') {
		isMarked = yProjMarked1 && !yProjMarked2;
	} else {
		isMarked = zProjMarked1 && !zProjMarked2;
	}

	if(isMarked) { // First line being marked
		// Getting location of click
		var bbox = evt.target.getBoundingClientRect();

		var pX = parseInt(evt.clientX - bbox.left);
		var pY = parseInt(evt.clientY - bbox.top);
		var boxW = parseInt(bbox.right - bbox.left);
		var boxH = parseInt(bbox.bottom - bbox.top);

		// Normalizing location of click to 0-1
		var posX = pX / boxW;
		var posY = pY / boxH;

		// Checking which window was clicked
		if(id == 'x') {
      // Transform from view frustum coordinates to absolute normalized coordinates (see zoom.js)
      var fovX = parseFloat($('#view-x').attr('fieldOfView'));
      [posX, posY] = zoomInverseTransform(posX, posY, fovX, camXPos[0], camXPos[1], X_CAM_DIST, Y_SIZE, Z_SIZE, -1, 1);

      // Getting range of selection in y and z windows
			var y1 = 1 - posX;
			var y2 = 1 - xPointX1;

			var z1 = posY;
			var z2 = xPointY1;

			// Saving second click location and indicating second selection has been made
			xPointX2 = posX;
			xPointY2 = posY;
			xProjMarked2 = true;

			// Toggling projection in y and z windows based on selected area
			toggleMaxProj(true, 'y', Math.min(y1, y2), Math.max(y1, y2));
			toggleMaxProj(true, 'z', Math.min(z1, z2), Math.max(z1, z2));
		} else if(id == 'y') { // See similar comments above
      var fovY = parseFloat($('#view-y').attr('fieldOfView'));
      [posX, posY] = zoomInverseTransform(posX, posY, fovY, camYPos[0], camYPos[1], Y_CAM_DIST, X_SIZE, Z_SIZE, -1, 1);

			var x1 = posX;
			var x2 = yPointX1;

			var z1 = posY;
			var z2 = yPointY1;

			yPointX2 = posX;
			yPointY2 = posY;
			yProjMarked2 = true;

			toggleMaxProj(true, 'x', Math.min(x1, x2), Math.max(x1, x2));
			toggleMaxProj(true, 'z', Math.min(z1, z2), Math.max(z1, z2));
		} else { // See similar comments above
      var fovZ = parseFloat($('#view-z').attr('fieldOfView'));
      [posX, posY] = zoomInverseTransform(posX, posY, fovZ, camZPos[0], camZPos[1], Z_CAM_DIST, X_SIZE, Y_SIZE, -1, 1);

			var x1 = posX;
			var x2 = zPointX1;

			var y1 = 1 - posY;
			var y2 = 1 - zPointY1;

			zPointX2 = posX;
			zPointY2 = posY;
			zProjMarked2 = true;

			toggleMaxProj(true, 'x', Math.min(x1, x2), Math.max(x1, x2));
			toggleMaxProj(true, 'y', Math.min(y1, y2), Math.max(y1, y2));
		}

		updateProjMarkers(); // Updating brown projection markers in slicer windows
	} else { // Second line being marked
		var bbox = evt.target.getBoundingClientRect();

		// Calculating x and y position of click
		var pX = parseInt(evt.clientX - bbox.left);
		var pY = parseInt(evt.clientY - bbox.top);
		var boxW = parseInt(bbox.right - bbox.left);
		var boxH = parseInt(bbox.bottom - bbox.top);

		// Normalizing click location to 0-1
		var posX = pX / boxW;
		var posY = pY / boxH;

		// Saving click location for relevant window
		if(id == 'x') {
      // Transform from view frustum coordinates to absolute normalized coordinates (see zoom.js)
      var fovX = parseFloat($('#view-x').attr('fieldOfView'));
      [posX, posY] = zoomInverseTransform(posX, posY, fovX, camXPos[0], camXPos[1], X_CAM_DIST, Y_SIZE, Z_SIZE, -1, 1);

			xPointX1 = posX;
			xPointY1 = posY;
		} else if(id == 'y') {
      var fovY = parseFloat($('#view-y').attr('fieldOfView'));
      [posX, posY] = zoomInverseTransform(posX, posY, fovY, camYPos[0], camYPos[1], Y_CAM_DIST, X_SIZE, Z_SIZE, -1, 1);

			yPointX1 = posX;
			yPointY1 = posY;
		} else {
      var fovZ = parseFloat($('#view-z').attr('fieldOfView'));
      [posX, posY] = zoomInverseTransform(posX, posY, fovZ, camZPos[0], camZPos[1], Z_CAM_DIST, X_SIZE, Y_SIZE, -1, 1);

			zPointX1 = posX;
			zPointY1 = posY;
		}

		// Saving that first marked has been selected but not second
		xProjMarked1 = true;
		yProjMarked1 = true;
		zProjMarked1 = true;

		xProjMarked2 = false;
		yProjMarked2 = false;
		zProjMarked2 = false;

		// Updating brown projection markers in slice windows
		updateProjMarkers();
	}
}
