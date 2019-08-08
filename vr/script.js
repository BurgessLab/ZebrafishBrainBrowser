/*
 * This file contains the JavaScript component of the Zebrafish Brain Browser's VR page
 */

// Called when document is completely loaded
$(document).ready(function() {
  // Reading values stored in local storage on main ZBB page, see HTML5 Web Storage https://www.w3schools.com/html/html5_webstorage.asp
  var ids = JSON.parse(localStorage.getItem('ids'));
  var colors = JSON.parse(localStorage.getItem('colors'));
  var contrasts = JSON.parse(localStorage.getItem('contrasts'));
  var brightnesses = JSON.parse(localStorage.getItem('brightnesses'));
  var regions = JSON.parse(localStorage.getItem('regions'));
  var regionsText = '';
  var data;
  var toggles;

  // if-else block below constructs HTML for volumes being rendered
  if (ids === null) {
    // Default volume if no volume data is found, i.e. the VR page was not visited directly from the main ZBB page (only shows HuC-Cer)
    data = '<VolumeData id="huc-cer" dimensions="2.452381 1.46667 1">' +
      '<ImageTextureAtlas containerField="voxels" url="../zbb/res/lineImages/transgenic/huc-cer/huc-cer_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
      '<ShadedVolumeStyle lighting="false" baseColor="1 1 1" contrast="1.1" brightness="0"><Material></Material></ShadedVolumeStyle>' +
      '</VolumeData>';
    toggles = '<input type="checkbox" id="huc-cer-toggle" style="color:white" onchange="setRender(\'huc-cer\',this)" checked/><label for="huc-cer-toggle" style="color:white">huc-cer</label>';
  } else {
    data = '';
    toggles = '';

    // Looping through all ids passed from the ZBB page
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var type;
      var color;
      var contrast;
      var brightness;

      // Finding line type from data.js arrays, used to construct file path
      if (TRANSGENIC.includes(id) || id == 'huc-cer') {
        type = 'transgenic';
      } else if (GAL4.includes(id)) {
        type = 'gal4';
      } else if (CRE.includes(id)) {
        type = 'cre';
      } else {
        type = 'misc';
      }

      if (colors === null) {
        // Default color if no colors are selected, i.e. page was not linked from main ZBB page (defaults to white)
        color = '1 1 1';
      } else {
        // Storing each line's color from ZBB page
        color = colors[i];
      }

      if (contrasts === null) {
        // Default contrast if no contrast values are set, i.e. page was not visited directly from main ZBB page (defaults to 1)
        contrast = '1';
      } else {
        // Storing contrast value specified from ZBB page
        contrast = contrasts[i];
      }

      if (brightnesses === null) {
        // Default brightness if no brightness values are set, i.e. page was not visited directly from main ZBB page (defaults to 0)
        brightness = '0';
      } else {
        // Storing brightness value specified from ZBB page
        brightness = brightnesses[i];
      }

      // Constructing this line's volume data
      data += '<VolumeData id="' + id + '" dimensions="2.452381 1.46667 1">' +
        '<ImageTextureAtlas containerField="voxels" url="../zbb/res/lineImages/' + type + '/' + id + '/' + id + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
        '<ShadedVolumeStyle lighting="false" baseColor="' + color + '" contrast="' + contrast + '" brightness="' + brightness + '"><Material></Material></ShadedVolumeStyle>' +
        '</VolumeData>';

      toggles += '<input type="checkbox" id="' + id + '-toggle" onchange="setRender(\'' + id + '\',this)" checked/><label for="'+id+'-toggle" style="color:white">'+id+'</label>';
    }
  }

  // Adding anatomical regions if they exist in memory (i.e. VR page was linked to from main ZBB page)
  if (regions !== null) {
    for (var i = 0; i < regions.length; i++) {
      // Adding each region's volume data based on it's color value (0-255)
      regionsText += '<VolumeData id="' + regions[i] + '" dimensions="2.452381 1.46667 1">' +
        '<ImageTextureAtlas containerField="voxels" url="../zbb/res/anatomy/anatomy-2-sectors/anatomy-2-' + regions[i] + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
        '<ShadedVolumeStyle lighting="false" anatomy="1.0"><Material></Material></ShadedVolumeStyle>' +
        '</VolumeData>';
      toggles += '<input type="checkbox" id="' + regions[i] + '-toggle" style="color:white;" onchange="setRender(\'' + regions[i] + '\',this)" checked/><label for="'+regions[i]+'-toggle" style="color:white">'+regions[i]+'</label>';
    }
  }

  // Appending volume and regions HTML to DOM
  $('#volumes-container').append(data);
  $('#volumes-container').append(regionsText);
	$('#header').append(toggles);

  // Removing data passed from main ZBB page from memory (so it doesn't stay in memory indefinitely)
  if (ids !== null) {
    localStorage.removeItem('ids');
  }
  if (colors !== null) {
    localStorage.removeItem('colors');
  }
  if (contrasts !== null) {
    localStorage.removeItem('contrasts');
  }
  if (brightnesses !== null) {
    localStorage.removeItem('brightnesses');
  }
  if (regions !== null) {
    localStorage.removeItem('regions');
  }
});

const TO_RADS = Math.PI / 180; // Constant multiplier to convert from angles in degrees to radians
const MOVE_ENABLED = true; // Determines whether translational movement is allowed, should be kept true

// Function to convert Euler angles to Quaternion rotation vector
x3dom.fields.Quaternion.prototype.setFromEulerYXZ = function(alpha, beta, gamma) {
  var c1 = Math.cos(alpha / 2);
  var c2 = Math.cos(beta / 2);
  var c3 = Math.cos(gamma / 2);
  var s1 = Math.sin(alpha / 2);
  var s2 = Math.sin(beta / 2);
  var s3 = Math.sin(gamma / 2);

  this.x = s1 * c2 * c3 + c1 * s2 * s3;
  this.y = c1 * s2 * c3 - s1 * c2 * s3;
  this.z = c1 * c2 * s3 - s1 * s2 * c3;
  this.w = c1 * c2 * c3 + s1 * s2 * s3;
}

// Used to determine if gamma angle reached zero (only happens when user points head straight down or straight up)
const ZERO_PROXIMITY = 1;

var currAlpha = 0; // Current alpha angle
var currGamma = 0; // Current gamma angle
var dirSign = 1; // Determines whether user is facing above or below horizon (determined by gamma angle)
var crossedZero = false; // Stores whether user has pointed head all the way towards ground or all the way towards sky
var lastGamma = 0; // Previous gamma angle, used for determining crossedZero value

// Sets camera's viewpoint orientation based on phone orientation (alpha, beta, and gamma)
function setRotation(alpha, beta, gamma) {
  // Creating quaternion from orientation angles
  var q0 = x3dom.fields.Quaternion.axisAngle(new x3dom.fields.SFVec3f(0, 0, 1), -window.orientation * TO_RADS);
  var q = new x3dom.fields.Quaternion();
  q.setFromEulerYXZ(beta * TO_RADS, (alpha + 90) * TO_RADS, -gamma * TO_RADS);
  var q1 = new x3dom.fields.Quaternion.axisAngle(new x3dom.fields.SFVec3f(1, 0, 0), -Math.PI / 2);

  q = q.multiply(q1);
  q = q.multiply(q0);
  var aa = q.toAxisAngle();

  // Setting camera orientation
  $('#camera-view').attr('orientation', aa[0].x + ' ' + aa[0].y + ' ' + aa[0].z + ' ' + aa[1]);

  // Updating angle values
  currAlpha = alpha;
  currGamma = gamma;
  dirSign = gamma > 0 ? 1 : -1;

  // Checking whether user has crossed zero
  if (Math.abs(lastGamma) < ZERO_PROXIMITY && (lastGamma > 0 && gamma < 0 || lastGamma < 0 && gamma > 0)) {
    crossedZero = !crossedZero;
  }

  // Updating lastGamma
  lastGamma = gamma;
}

if (window.DeviceOrientationEvent) { // Checking if device supports orientation
  window.addEventListener('deviceorientation', function(evt) {
    // Updates camera orientation whenever device is rotated
    setRotation(evt.alpha, evt.beta, evt.gamma);
  });
} else {
  alert('This device does not support VR motion detection.');
}

function setRender(id, checkbox) {
  $('#' + id).attr('render', checkbox.checked); // "render" is an X3DOM scene attribute
}

// Sets x3d window to fullscreen
function fullscreen() {
  rtLeft = document.getElementById('rtLeft');
  rtRight = document.getElementById('rtRight');
  rtLeft._x3domNode.lensCenter = 0;
  rtRight._x3domNode.lensCenter = 0;

  var x3dElm = $('#all_view')[0];

  // Checks fullscreen support for all browser types
  if (x3dElm.requestFullscreen) {
    x3dElm.requestFullscreen();
  } else if (x3dElm.msRequestFullscreen) {
    x3dElm.msRequestFullscreen();
  } else if (x3dElm.mozRequestFullScreen) {
    x3dElm.mozRequestFullScreen();
  } else if (x3dElm.webkitRequestFullscreen) {
    x3dElm.webkitRequestFullscreen();
  }
}

const MOVE_FPS = 60; // Number of times user moves per second
const MOVE_INC = 1000 / MOVE_FPS; // Amount of time in milliseconds that passes between each movement
const SPEED = 0.3; // Movement speed of user
const MAX_DISTANCE = 50; // Maximum distance user can move from center

var moving = false; // Keeps track of whether user is currently moving
var currX = 0; // Current x location
var currY = 10; // Current y location
var currZ = 20; // Current z location

// Moves user one unit
function move() {
  // Gets direction user is currently facing
  var dirX = dirSign * Math.sin(currAlpha * TO_RADS) * Math.abs(Math.sin(currGamma * TO_RADS));
  var dirY = dirSign * Math.cos(currGamma * TO_RADS) * (crossedZero ? -1 : 1);
  var dirZ = dirSign * Math.cos(currAlpha * TO_RADS) * Math.abs(Math.sin(currGamma * TO_RADS));

  // Normalizing direction vector
  var length = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
  dirX /= length;
  dirY /= length;
  dirZ /= length;

  // Moving user based on speed
  currX += dirX * SPEED;
  currY += dirY * SPEED;
  currZ += dirZ * SPEED;

  // Preventing user from moving outside of maximum boundaries
  currX = Math.max(currX, -MAX_DISTANCE);
  currY = Math.max(currY, 0);
  currZ = Math.max(currZ, -MAX_DISTANCE);
  currX = Math.min(currX, MAX_DISTANCE);
  currY = Math.min(currY, 2 * MAX_DISTANCE);
  currZ = Math.min(currZ, MAX_DISTANCE);

  // Updating camera position
  var pos = currX + ' ' + currY + ' ' + currZ;
  $('#camera-view').attr('position', pos);
}

// Recursive function for moving user every period of time (MOVE_INC)
function moveCycle() {
  if (moving) {
    move();

    setTimeout(function() { // This function executes after MOVE_INC milliseconds have passed
      moveCycle();
    }, MOVE_INC);
  }
}

if (MOVE_ENABLED) { // Checking if movement is allowed
  document.addEventListener('touchstart', function(evt) {
    if (!$(evt.target).hasClass('btn')) { // Doesn't move user when pressing fullscreen button
      // Moving user whenever screen is touched
      moving = true;
      moveCycle();
    }
  });

  document.addEventListener('touchend', function(evt) {
    // Stopping user whenever screen is released
    moving = false;
  });
}
