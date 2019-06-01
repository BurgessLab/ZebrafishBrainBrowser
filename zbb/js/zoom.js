/*
 * Handles zoom-related functions and their parameters, including zoom speed, controls, etc.
 */

const ZOOM_SPEED = 0.00035; // Zoom-in/zoom-out speed
const MAX_FOV = 0.785398; // Zoom-out cap (default)
const MIN_FOV = MAX_FOV / 4; // Zoom-in cap

// Volume sizes in each dimension
const X_SIZE = 1.0;
const Y_SIZE = 0.598058;
const Z_SIZE = 0.407767;

var screenHeld = ''; // 'x' if x window is currently being panned, 'y' if y window, 'z' if z window, '' if none

// Tracks position of mouse while panning with control key held
var lastZoomMouseX = 0;
var lastZoomMouseY = 0;

// Initial camera distances from volumes
const X_CAM_DIST = 0.4922183;
const Y_CAM_DIST = 0.4922183;
const Z_CAM_DIST = 0.72192017;

// Track camera positions in all three windows
var camXPos = [0, 0, X_CAM_DIST];
var camYPos = [0, 0, Y_CAM_DIST];
var camZPos = [0, 0, Z_CAM_DIST];

// Constraints on camera distance from center, prevents volume from going offscreen
var maxPanX = [0, 0];
var maxPanY = [0, 0];
var maxPanZ = [0, 0];

// Logic for zooming in and out with mouse wheel
function scrollToZoom(evt, view) {
  // Prevent zoom while spatial search is being performed/displayed
  if(spatialSearchOn || ssHighlighted) {
    return;
  }
  
  // Normalize mouse wheel delta across browsers
  var speedMultiplier = 1;
  if(browser == 'Firefox') {
    speedMultiplier = 66.667;
  } else if(browser == 'Edge') {
    speedMultiplier = 0.752;
  }
  
  var scrollAmt = -evt.originalEvent.deltaY * speedMultiplier;
  var fovPrev = parseFloat($(view).attr('fieldOfView'));
  var newFov = fovPrev + scrollAmt * ZOOM_SPEED;
  
  // Zoomed all the way in
  if(newFov < MIN_FOV) {
    newFov = MIN_FOV;
  }
  
  // Set new FOV
  updateFov(view, newFov);
}

// Sets the fov for a given window after zoom occurs
function updateFov(view, newFov) {
  // Calculate camera constraints so volume isn't offscreen
  if(view == '#view-x') { // X camera
    var halfFrustumHeight = camXPos[2] * Math.tan(0.5 * newFov);
    var halfFrustumWidth = halfFrustumHeight * Y_SIZE / Z_SIZE;
    maxPanX[0] = Y_SIZE * 0.5 - halfFrustumWidth;
    maxPanX[1] = Z_SIZE * 0.5 - halfFrustumHeight;
    
    applyMaxPan('x');
    $('#view-x').attr('position', camXPos[0] + ',' + camXPos[1] + ',' + camXPos[2]);
  } else if(view == '#view-y') { // Y camera
    var halfFrustumHeight = camYPos[2] * Math.tan(0.5 * newFov);
    var halfFrustumWidth = halfFrustumHeight * X_SIZE / Z_SIZE;
    maxPanY[0] = X_SIZE * 0.5 - halfFrustumWidth;
    maxPanY[1] = Z_SIZE * 0.5 - halfFrustumHeight;
    
    applyMaxPan('y');
    $('#view-y').attr('position', camYPos[0] + ',' + camYPos[1] + ',' + camYPos[2]);
  } else { // Z camera
    var halfFrustumHeight = camZPos[2] * Math.tan(0.5 * newFov);
    var halfFrustumWidth = halfFrustumHeight * X_SIZE / Y_SIZE;
    maxPanZ[0] = X_SIZE * 0.5 - halfFrustumWidth;
    maxPanZ[1] = Y_SIZE * 0.5 - halfFrustumHeight;
    
    applyMaxPan('z');
    $('#view-z').attr('position', camZPos[0] + ',' + camZPos[1] + ',' + camZPos[2]);
  }
  
  $(view).attr('fieldOfView', newFov);
  
  // Zoomed all the way out
  if(newFov > MAX_FOV) {
    if(view == '#view-x') {
      resetZoom('x');
    } else if(view == '#view-y') {
      resetZoom('y');
    } else {
      resetZoom('z');
    }
  }
  
  // Update blue selection lines (see windows.js)
  updateLines();
  
  // Update brown projection markers (see maxProj.js)
  updateProjMarkers();
  
  // Disable spatial search if not fully-zoomed out
  if(!checkZoomedOut()) {
    $('#ss-start-btn').prop('disabled', true);
    $('#ss-zoom-warning').css('display', 'block');
  }
}

// Performs camera panning in relevant window
function panCamera(newMouseX, newMouseY) {
  // Prevent panning while spatial search is being performed/displayed
  if(spatialSearchOn || ssHighlighted) {
    return;
  }
  
  // Calculating how much mouse was moved
  var deltaX = newMouseX - lastZoomMouseX;
  var deltaY = newMouseY - lastZoomMouseY;
  lastZoomMouseX = newMouseX;
  lastZoomMouseY = newMouseY;
  
  // Calculating pan distance
  if(screenHeld == 'x') { // X window
    var containerWidth = $('#x3dom-x-window-canvas').width();
    var containerHeight = $('#x3dom-x-window-canvas').height();
    
    // Calculate total pan distance
    var fov = parseFloat($('#view-x').attr('fieldOfView'));
    var fovMul = fov / MAX_FOV;
    var distX = deltaX / containerWidth * fovMul * Y_SIZE;
    var distY = deltaY / containerHeight * fovMul * Z_SIZE;
    
    // Apply to x camera
    updatePan(distX, distY, 'x');
  } else if(screenHeld == 'y') { // Y window
    var containerWidth = $('#x3dom-y-window-canvas').width();
    var containerHeight = $('#x3dom-y-window-canvas').height();
    
    // Calculate total pan distance
    var fov = parseFloat($('#view-y').attr('fieldOfView'));
    var fovMul = fov / MAX_FOV;
    var distX = deltaX / containerWidth * fovMul;
    var distY = deltaY / containerHeight * fovMul * Z_SIZE;
    
    // Apply to y camera
    updatePan(distX, distY, 'y');
  } else { // Z window
    var containerWidth = $('#x3dom-z-window-canvas').width();
    var containerHeight = $('#x3dom-z-window-canvas').height();
    
    // Calculate total pan distance
    var fov = parseFloat($('#view-z').attr('fieldOfView'));
    var fovMul = fov / MAX_FOV;
    var distX = deltaX / containerWidth * fovMul;
    var distY = deltaY / containerHeight * fovMul * Y_SIZE;
    
    // Apply to z camera
    updatePan(distX, distY, 'z');
  }
}

// Moves camera by specified amount in specified view
function updatePan(distX, distY, view) {
  if(view == 'x') { // X window
    // Apply to x camera
    camXPos[0] -= distX;
    camXPos[1] += distY;
    applyMaxPan('x');
    $('#view-x').attr('position', camXPos[0] + ',' + camXPos[1] + ',' + camXPos[2]);
  } else if(view == 'y') { // Y window
    // Apply to y camera
    camYPos[0] -= distX;
    camYPos[1] += distY;
    applyMaxPan('y');
    $('#view-y').attr('position', camYPos[0] + ',' + camYPos[1] + ',' + camYPos[2]);
  } else { // Z window
    // Apply to z camera
    camZPos[0] -= distX;
    camZPos[1] += distY;
    applyMaxPan('z');
    $('#view-z').attr('position', camZPos[0] + ',' + camZPos[1] + ',' + camZPos[2]);
  }
  
  // Update blue selection lines (see windows.js)
  updateLines();
  
  // Update brown projection markers (see maxProj.js)
  updateProjMarkers();
}

// Applies maximum pan distance from center for current zoom level
function applyMaxPan(dim) {
  if(dim == 'x') { // X camera
    for(var i = 0; i < 2; i++) {
      if(camXPos[i] < -maxPanX[i]) {
        camXPos[i] = -maxPanX[i];
      } else if(camXPos[i] > maxPanX[i]) {
        camXPos[i] = maxPanX[i];
      }
    }
  } else if(dim == 'y') { // Y camera
    for(var i = 0; i < 2; i++) {
      if(camYPos[i] < -maxPanY[i]) {
        camYPos[i] = -maxPanY[i];
      } else if(camYPos[i] > maxPanY[i]) {
        camYPos[i] = maxPanY[i];
      }
    }
  } else { // Z camera
    for(var i = 0; i < 2; i++) {
      if(camZPos[i] < -maxPanZ[i]) {
        camZPos[i] = -maxPanZ[i];
      } else if(camZPos[i] > maxPanZ[i]) {
        camZPos[i] = maxPanZ[i];
      }
    }
  }
}

// Transforms absolute coordinates to zoom/pan frustum coordinates (see updateLines() in windows.js)
function zoomTransform(x, y, fov, camX, camY, camDist, winWidth, winHeight, relWidth, relHeight, panYSign) {
  var frustumRatio = 2 * camDist * Math.tan(0.5 * fov) / relHeight;
  var panRatioX = camX / relWidth;
  var panRatioY = camY / relHeight;
  
  var xNorm = x / winWidth - 0.5;
  var yNorm = y / winHeight - 0.5;
  
  var xTrans = (xNorm - panRatioX) / frustumRatio;
  var yTrans = (yNorm + panYSign * panRatioY) / frustumRatio;
  
  var lineX = (xTrans + 0.5) * winWidth;
  var lineY = (yTrans + 0.5) * winHeight;
  
  return [lineX, lineY];
}

// Transforms zoom/pan frustum coordinates to normalized 0-1 coordinates (see box clicked functions in windows.js)
function zoomInverseTransform(lineX, lineY, fov, camX, camY, camDist, relWidth, relHeight, panSignX, panSignY) {
  var frustumRatio = 2 * camDist * Math.tan(0.5 * fov) / relHeight;
  var panRatioX = camX / relWidth;
  var panRatioY = camY / relHeight;
  
  var xNorm = (lineX - 0.5) * frustumRatio - panSignX * panRatioX + 0.5;
  var yNorm = (lineY - 0.5) * frustumRatio - panSignY * panRatioY + 0.5;
  
  return [xNorm, yNorm];
}

// Reset zoom and pan values for specified window
function resetZoom(dim) {
  // Prevent zoom reset while spatial search is being performed/displayed
  if(spatialSearchOn || ssHighlighted) {
    return;
  }
  
  // Reset fov to maximum
  $('#view-' + dim).attr('fieldOfView', MAX_FOV);
  
  // Resetting camera locations, max pan from center
  if(dim == 'x') {
    camXPos = [0, 0, X_CAM_DIST];
    $('#view-x').attr('position', camXPos[0] + ',' + camXPos[1] + ',' + camXPos[2]);
    maxPanX = [0, 0];
  } else if(dim == 'y') {
    camYPos = [0, 0, Y_CAM_DIST];
    $('#view-y').attr('position', camYPos[0] + ',' + camYPos[1] + ',' + camYPos[2]);
    maxPanY = [0, 0];
  } else {
    camZPos = [0, 0, Z_CAM_DIST];
    $('#view-z').attr('position', camZPos[0] + ',' + camZPos[1] + ',' + camZPos[2]);
    maxPanZ = [0, 0];
  }
  
  // Update blue selection lines (see windows.js)
  updateLines();
  
  // Update brown projection markers (see maxProj.js)
  updateProjMarkers();
  
  // Allowing spatial search if all windows are fully-zoomed out
  if(checkZoomedOut()) {
    $('#ss-start-btn').prop('disabled', false);
    $('#ss-zoom-warning').css('display', 'none');
  }
}

// Checks if all windows are fully-zoomed out
function checkZoomedOut() {
  var fovX = parseFloat($('#view-x').attr('fieldOfView'));
  var fovY = parseFloat($('#view-y').attr('fieldOfView'));
  var fovZ = parseFloat($('#view-z').attr('fieldOfView'));
  
  return fovX >= MAX_FOV && fovY >= MAX_FOV && fovZ >= MAX_FOV;
}

// Called when user presses 'z' shortcut
function resetZoomAll() {
  resetZoom('x');
  resetZoom('y');
  resetZoom('z');
}