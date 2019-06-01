/*
 * This file handles generation and loading of URL state codes. This interface can be found in the Settings tab of the brain browser.
 */

// Expected URL parameter name for brain browser state
const STATE_VAR = 'state';

// Prepares URL interface events, loads state if one is present in the URL
function prepareURLCodes() {
  // Disable key input to key generation field in Settings tab
  $('#url-code-field').on('keydown', function(e) {
    e.preventDefault();
  });
  
  // Extract 'state' parameter from URL
  var url = new URL(window.location.href);
  var params = new URLSearchParams(url.search);
  
  // Checking if state code was provided
  if(params.has(STATE_VAR)) {
    var encodedStr = params.get(STATE_VAR);
    parseURLCode(encodedStr); // Parse and load state
  }
}

// Parses and loads state provided in the URL
function parseURLCode(encodedStr) {
  // Decoding from URL format
  var codeStr = decodeURI(encodedStr);
  var state = JSON.parse(codeStr);
  
  //
  // Load state
  //
  
  // Configure settings in 'Settings' tab
  var settings = state.settings;
  if(settings.invertColor) {
    $('#invert-input').click();
  }
  if(!settings.showVolume) {
    $('#volume-full-checkbox').click();
  }
  if(!settings.showLine) {
    $('#line-show-checkbox').click();
  }
  if(settings.hideAnnotations) {
    $('#hide-annotations-checkbox').click();
  }
  if(settings.projectionDepthCoding) {
    $('#depth-code-projections-checkbox').click();
  }
  $('#res-btn-' + settings.resolution).click();
  $('#win-size-' + settings.windowSize).click();
  
  // Process Huc-Cer (need to do before AND intersection processing)
  var selectedLines = state.selectedLines; // Also used below
  var hasHucCer = false;
  var hucCerIndex = -1;
  for(var i in selectedLines) {
    if(selectedLines[i].id == HUC_CER[0]) {
      hasHucCer = true;
      hucCerIndex = i;
      break;
    }
  }
  if(hasHucCer) {
    var line = selectedLines[hucCerIndex];
    
    // Changing line color
    var color = line.color;
    changeColor(color.spanColor, color.r, color.g, color.b, HUC_CER[0] + '-color-span', HUC_CER[0]);
    
    // Set contrast and brightness values
    $('#' + HUC_CER[0] + '-intensity-input').val(line.contrast).trigger('input');
    $('#' + HUC_CER[0] + '-brightness-input').val(line.brightness).trigger('input');
  } else {
    // Turning off huc-cer
    $('#' + HUC_CER[0] + '-checkbox').click();
  }
  
  // AND intersection
  var andIntersection = state.andIntersection;
  if(andIntersection.active) {
    var first = andIntersection.firstLine;
    var second = andIntersection.secondLine;
    
    if(first != HUC_CER[0]) {
      $('#' + first + '-checkbox').click();
    }
    if(second != HUC_CER[0]) {
      $('#' + second + '-checkbox').click();
    }
    
    $('#showANDBtn').click();
    
    if(first != HUC_CER[0]) {
      $('#' + first + '-checkbox').click();
    }
    if(second != HUC_CER[0]) {
      $('#' + second + '-checkbox').click();
    }
  }
  
  // Load visibilities (must be done before selected lines and after AND intersection)
  var visSelected = state.visibility.selected;
  var visToggled = state.visibility.toggled;
  for(var i in visSelected) {
    if(i != 0) {
      $('#' + visSelected[i] + '-checkbox').click();
    }
    if(visToggled[i]) {
      toggleSelection(i);
    }
    if(i != 0) {
      $('#' + visSelected[i] + '-checkbox').click();
    }
  }
  
  // Selected lines
  for(var i in selectedLines) {
    var line = selectedLines[i];
    var id = line.id;
    
    // Turning line on
    if(id == HUC_CER[0]) {
      hasHucCer = true;
    } else {
      $('#' + id + '-checkbox').click();
    }
    
    // Changing line color
    var color = line.color;
    changeColor(color.spanColor, color.r, color.g, color.b, id + '-color-span', id);
    
    // Set contrast and brightness values
    $('#' + id + '-intensity-input').val(line.contrast).trigger('input');
    $('#' + id + '-brightness-input').val(line.brightness).trigger('input');
  }
  
  // Selected anatomy
  var anatomy = state.anatomy;
  var active = anatomy.active;
  $('#active-anatomy-' + active).click();
  if(anatomy.showFull) {
    setTimeout(function() { $('#show-full-btn').click(); }, 1000);
  }
  var selectedAnatomy = anatomy.selected;
  for(var i in selectedAnatomy) {
    $('#' + selectedAnatomy[i]).click();
  }
  
  // Move blue selection lines
  var blueLines = state.blueLines;
  $('#x-input').val(blueLines.x).trigger('input');
  $('#y-input').val(blueLines.y).trigger('input');
  $('#z-input').val(blueLines.z).trigger('input');
  
  // Set zoom/pan in 2D windows
  var fov = state.camera.fov;
  updateFov('#view-x', fov.x);
  updateFov('#view-y', fov.y);
  updateFov('#view-z', fov.z);
  var pan = state.camera.pan;
  updatePan(pan.xx, pan.xy, 'x');
  updatePan(pan.yx, pan.yy, 'y');
  updatePan(pan.zx, pan.zy, 'z');
  
  // Set fullscreen window if applicable
  if(state.fullscreen != '') {
    toggleFullscreen(state.fullscreen);
  }
  
  // Load projections (Do last for brown projection lines to display correctly)
  var projections = state.projections;
  if(projections.x.on) {
    toggleMaxProj(true, 'x', projections.x.lower, projections.x.upper);
  }
  if(projections.y.on) {
    toggleMaxProj(true, 'y', projections.y.lower, projections.y.upper);
  }
  if(projections.z.on) {
    toggleMaxProj(true, 'z', projections.z.lower, projections.z.upper);
  }
  xProjMarked1 = projections.x.marked1;
  xProjMarked2 = projections.x.marked2;
  yProjMarked1 = projections.y.marked1;
  yProjMarked2 = projections.y.marked2;
  zProjMarked1 = projections.z.marked1;
  zProjMarked2 = projections.z.marked2;
  xPointX1 = projections.x.x1;
  xPointY1 = projections.x.y1;
  yPointX1 = projections.y.x1;
  yPointY1 = projections.y.y1;
  zPointX1 = projections.z.x1;
  zPointY1 = projections.z.y1;
  xPointX2 = projections.x.x2;
  xPointY2 = projections.x.y2;
  yPointX2 = projections.y.x2;
  yPointY2 = projections.y.y2;
  zPointX2 = projections.z.x2;
  zPointY2 = projections.z.y2;
  updateProjMarkers();
}

// Builds URL and code string from current state of brain browser, displays it in the URL code interface
function generateURLCode() {
  // Check if spatial search is being performed or a custom line is on
  if(spatialSearchOn || ssHighlighted) {
    alert('Please finish spatial searching before generating a URL code.');
    return;
  }
  var customLineSelected = false;
  for(var i = 0; i < customLineCounter; i++) {
    if(currRender.includes('custom-line-' + i)) {
      customLineSelected = true;
      break;
    }
  }
  if(customLineSelected) {
    alert('Please deselect any custom lines before generating a URL code.');
    return;
  }
  
  //
  // Generate state JSON
  //
  
  var state = {};
  
  // Settings (in 'Settings' tab)
  var settings = {};
  settings.invertColor = $('#invert-input').is(':checked');
  settings.showVolume = $('#volume-full-checkbox').is(':checked');
  settings.showLine = $('#line-show-checkbox').is(':checked');
  settings.hideAnnotations = $('#hide-annotations-checkbox').is(':checked');
  settings.projectionDepthCoding = $('#depth-code-projections-checkbox').is(':checked');
  settings.resolution = currRes;
  if($('#win-size-sm').hasClass('active')) {
    settings.windowSize = 'sm';
  } else if($('#win-size-md').hasClass('active')) {
    settings.windowSize = 'md';
  } else {
    settings.windowSize = 'lg';
  }
  state.settings = settings;
  
  // AND intersection
  var andIntersection = {};
  andIntersection.active = firstLineBeingIntersected != '' && secondLineBeingIntersected != '';
  andIntersection.firstLine = firstLineBeingIntersected;
  andIntersection.secondLine = secondLineBeingIntersected;
  state.andIntersection = andIntersection;
  
  // Visibility toggles
  var visibility = {};
  visibility.selected = firstSelected;
  visibility.toggled = toggled;
  state.visibility = visibility;
  
  // Currently-selected lines
  var selectedLines = [];
  for(var i in currRender) {
    // Line ID
    var line = {};
    var id = currRender[i];
    line.id = id;
    
    // Color information
    line.color = {};
    line.color.spanColor = $('#' + id + '-settings-header').attr('spanColor');
    var colorComponents = $('.' + id + '-volume-x').attr('baseColor').split(' ');
    line.color.r = colorComponents[0];
    line.color.g = colorComponents[1];
    line.color.b = colorComponents[2];
    
    // Contrast and brightness values
    line.contrast = $('#' + id + '-intensity-num').val();
    line.brightness = $('#' + id + '-brightness-num').val();
    
    selectedLines.push(line);
  }
  state.selectedLines = selectedLines;
  
  // Anatomy
  var anatomy = {};
  if(activeAnatomy == 'z-brain') {
    anatomy.active = 'z-brain';
    anatomy.showFull = $('.anatomy-2-edges-data').attr('render') == 'true';
    anatomy.selected = currentZbrainCheckboxes;
  } else {
    anatomy.active = 'pajevic';
    anatomy.showFull = $('.anatomy-1-edges-data').attr('render') == 'true';
    anatomy.selected = currentPajevicCheckboxes;
  }
  state.anatomy = anatomy;
  
  // Blue selection lines
  var blueLines = {};
  blueLines.x = $('#x-input').val();
  blueLines.y = $('#y-input').val();
  blueLines.z = $('#z-input').val();
  state.blueLines = blueLines;
  
  // Camera zoom/pan in 2D windows
  var camera = {};
  var fov = {};
  fov.x = parseFloat($('#view-x').attr('fieldOfView'));
  fov.y = parseFloat($('#view-y').attr('fieldOfView'));
  fov.z = parseFloat($('#view-z').attr('fieldOfView'));
  camera.fov = fov;
  var pan = {};
  pan.xx = -camXPos[0];
  pan.xy = camXPos[1];
  pan.yx = -camYPos[0];
  pan.yy = camYPos[1];
  pan.zx = -camZPos[0];
  pan.zy = camZPos[1];
  camera.pan = pan;
  state.camera = camera;
  
  // Fullscreen window
  if(xFull) {
    state.fullscreen = 'x';
  } else if(yFull) {
    state.fullscreen = 'y';
  } else if(zFull) {
    state.fullscreen = 'z';
  } else if(vFull) {
    state.fullscreen = 'volume';
  } else {
    state.fullscreen = '';
  }
  
  // Maximum/partial projections
  var projections = {};
  projections.x = {};
  projections.y = {};
  projections.z = {};
  projections.x.on = xProjOn;
  projections.y.on = yProjOn;
  projections.z.on = zProjOn;
  projections.x.marked1 = xProjMarked1;
  projections.x.marked2 = xProjMarked2;
  projections.y.marked1 = yProjMarked1;
  projections.y.marked2 = yProjMarked2;
  projections.z.marked1 = zProjMarked1;
  projections.z.marked2 = zProjMarked2;
  projections.x.x1 = xPointX1;
  projections.x.y1 = xPointY1;
  projections.y.x1 = yPointX1;
  projections.y.y1 = yPointY1;
  projections.z.x1 = zPointX1;
  projections.z.y1 = zPointY1;
  projections.x.x2 = xPointX2;
  projections.x.y2 = xPointY2;
  projections.y.x2 = yPointX2;
  projections.y.y2 = yPointY2;
  projections.z.x2 = zPointX2;
  projections.z.y2 = zPointY2;
  if(currRender.length > 0) {
    var sampleLine = currRender[0];
    
    projections.x.lower = $('#' + sampleLine + '-proj-x').attr('minLine');
    projections.x.upper = $('#' + sampleLine + '-proj-x').attr('maxLine');
    projections.y.lower = $('#' + sampleLine + '-proj-y').attr('minLine');
    projections.y.upper = $('#' + sampleLine + '-proj-y').attr('maxLine');
    projections.z.lower = $('#' + sampleLine + '-proj-z').attr('minLine');
    projections.z.upper = $('#' + sampleLine + '-proj-z').attr('maxLine');
  } else {
    projections.x.lower = 0;
    projections.x.upper = 0;
    projections.y.lower = 0;
    projections.y.upper = 0;
    projections.z.lower = 0;
    projections.z.upper = 0;
  }
  state.projections = projections;
  
  // Encoding and constructing full URL string
  var codeStr = JSON.stringify(state);
  var encodedStr = encodeURI(codeStr);
  var locationHead = window.location.href.split('?')[0];
  var paramHead = '?' + STATE_VAR + '=';
  var urlStr = locationHead + paramHead + encodedStr;
  
  // Display full URL with code
  $('#url-code-field').val(urlStr);
}

// Copies currently-displayed URL code to the clipboard
function copyURLString() {
  // Getting text input element
  var codeField = $('#url-code-field');
  
  // Checking that the text field isn't empty
  if(codeField.val() !== '') {
    // Selecting and copying the URL string
    codeField.get(0).select();
    document.execCommand('copy');
  }
}