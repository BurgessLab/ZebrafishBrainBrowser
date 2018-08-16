/*
 * This file manages custom lines added under the Custom tab in the Lines menu
 */

const NUMBER_OF_SLICES = 100; // Required total number of images/slices on the uploaded texture atlas
const SLICES_OVER_X = 10; // Required x dimension of the uploaded texture atlas (in terms of slices)
const SLICES_OVER_Y = 10; // Required y dimension of the uploaded texture atlas (in terms of slices)

// Note that while the number of slices in the uploaded texture atlas must meet the specifications above (as well as the aspect ratio), there is no required resolution specification

var customLineCounter = 0; // Number of custom lines added, used to ID them

// Deprecated functionality
//var addedCustomNames = []; // Keeps track of custom names added

// Appends a newly created custom line to the page
// Note that appendage functionality here is completely separate from appendage functions of normal lines, if you wish to make changes for both custom lines and normal lines, changes must be made in both functions
function appendCustomLine(id, name, url) {
	appendCustomList(id, name); // Appending to line list in Custom tab
	appendCustomSettings(id, name); // Appending to individual settings panel
	appendCustomProjections(id, url); // Appending projection windows
	appendCustomVolumes(id, url); // Appending to volume windows
	
	bindSliderAndNumberInputs(id); // Binds value inputs to corresponding volumes
	resetIndividual(id, true); // Resets line
	
	// Creates/enables color popover selector
	$('#' + id + '-color').attr('data-content', popoverContent('changeColor', '\'' + id + '-color-span\', \'' + id + '\''));
	$('[data-toggle="popover"]').popover();
	
	// Turning on line
	pushed.push(id);
	$('#' + id + '-checkbox').prop('checked', true).change();
}

// Loads custom line file
// This function is called when the user hits the "Load" button
function loadCustom() {
	// Gets file path (fake path) of file input
	var filePath = $('#custom-file-input').val();
	
	if(filePath == '') { // No file chosen
		alert('Please choose a file.');
	} else {
		// Parsing line name from file path (fake path except for name itself)
		var fileParts = $('#custom-file-input').val().split('\\');
		var name = fileParts[fileParts.length - 1].split('.')[0];
		
		// Using FileReader to read data into memory, see https://developer.mozilla.org/en-US/docs/Web/API/FileReader
		var reader = new FileReader();
		reader.readAsDataURL($('#custom-file-input')[0].files[0]);
		
		// Function called when reader has successfully loaded file
		reader.onload = function () {
			var id = 'custom-line-' + customLineCounter; // Setting custom line's ID
			var url = reader.result; // This is a data URL, which points to a location in memory rather than a file path
			customLineCounter++;
			appendCustomLine(id, name, url); // Appending newly loaded line
		}
		
		// Deprecated functionality
		//addedCustomNames.push(name);
		
		// Resetting file input
		$('#custom-file-input').val('');
		setLabelText('choose-custom-file-btn', 'Select file');
	}
}

// Sets file input text
function setLabelText(labelID, value) {
	$('#' + labelID).text(value);
}

// Function called when user chooses a file, but before they hit the "Load" button
function customFileChosen(filePath, labelID) {
	if(filePath == '') {
		setLabelText(labelID, 'Select file'); // Resets input label if no file is actually chosen
	} else {
		// Extracts file name from inputted file path (fake path)
		var parts = filePath.split('\\');
		var name = parts[parts.length - 1];
		var nameParts = name.split('.');
		var ext = nameParts[nameParts.length - 1].toLowerCase(); // Getting type of chosen file
		
		// Requiring selected file's type to be PNG (only texture atlas type supported by X3DOM)
		if(ext == 'png') {
			setLabelText(labelID, name);
		} else {
			setLabelText(labelID, 'Select file');
			$('#custom-file-input').val('');
			alert('File type must be PNG.');
		}
	}
}

// Appends new custom line to list in Custom tab
function appendCustomList(id, name) {
	var listText = 	'<div class="container-fluid">' +
						'<input id="' + id + '-checkbox" class="float-left" type="checkbox" onchange="setRender(\'' + id + '\', this)" checked />' +
						'<label class="settings-label float-left" for="' + id + '-checkbox">' + name + '</label>' +
					'</div>';
	
	$('#custom-lines').append(listText);
}

// Appends new custom line settings in individual settings panel
function appendCustomSettings(id, name) {
	var toggleIndex = storeSelection(id); // Gets toggle index for key toggling (1-9 keys)
	
	var settingsText = 	'<div id="' + id + '-settings" class="individual-settings">' +
							// Color picker button
							'<button id="' + id + '-color" class="btn btn-default btn-xs color-picker" data-toggle="popover" data-html="true" data-placement="top" data-animation="false" data-container="body" onclick="swapInfoView(\'' + id + '\'); togglePopover(\'' + id + '\');">' +
								'<h4 id="' + id + '-settings-header" class="settings-header">' + name + '</h4>' +
								'<span id="' + id + '-color-span" class="color-label"></span>' +
							'</button>' +
							// Deselect button (X)
							'<button class="line-deselect-btn close" type="button" onclick="deselectLine(\'' + id + '\')">&times;</button>' +
							// Reset button
							'<button class="individual-reset-btn btn btn-xs btn-success" type="button" onclick="resetIndividual(\'' + id + '\')">Reset</button>' +
							// Visibility button and number label if it was successfully given a valid toggle index
							(toggleIndex > -1 ? '<button id="' + id + '-toggle-btn" class="btn btn-xs btn-default individual-settings-toggle" type="button" onclick="toggleSelection(' + toggleIndex + ')"></button>' : '') +
							'<p class="toggle-num">' + (toggleIndex > -1 ? toggleIndex + 1 : '') + '</p>' +
							// Contrast input
							'<div class="input-block container-fluid no-padding">' +
								'<div class="row settings-row margin-0">' +
									'<div class="col-sm-4 no-padding">' +
										'<p class="settings-value-header">Contrast</p>' +
									'</div>' +
									'<div class="col-sm-5 no-padding slider-input-div">' +
										'<input id="' + id + '-intensity-input" class="slider-input" type="range" min="0" max="20" step="0.01" oninput="changeIndividualAttrib(\'' + id + '\', \'renderIntensity\', this.value)" />' +
									'</div>' +
									'<div class="col-sm-3 padding-right-0">' +
										'<input id="' + id + '-intensity-num" class="number-input form-control" type="number" min="0" max="20" step="0.01" value="1" oninput="changeIndividualAttrib(\'' + id + '\', \'renderIntensity\', this.value)" />' +
									'</div>' +
								'</div>' +
							'</div>' +
							// Brightness input
							'<div class="input-block container-fluid no-padding">' +
								'<div class="row settings-row margin-0">' +
									'<div class="col-sm-4 no-padding">' +
										'<p class="settings-value-header">Brightness</p>' +
									'</div>' +
									'<div class="col-sm-5 no-padding slider-input-div">' +
										'<input id="' + id + '-brightness-input" class="slider-input" type="range" min="-2" max="2" step="0.01" oninput="changeIndividualAttrib(\'' + id + '\', \'brightness\', this.value)" />' +
									'</div>' +
									'<div class="col-sm-3 padding-right-0">' +
										'<input id="' + id + '-brightness-num" class="number-input form-control" type="number" min="-2" max="2" step="0.01" value="0" oninput="changeIndividualAttrib(\'' + id + '\', \'brightness\', this.value)" />' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>';
	
	$('.individual-settings-container').append(settingsText);
}

// Appends projection volumes of new custom line
function appendCustomProjections(id, url) {
	// Checks if depth coding is currently on
	var depthCodingText = $('#depth-code-projections-checkbox').prop('checked') ? 'depthCoded="1.0"' : '';
	
	// Projection volume HTML
	var xText = 	'<VolumeData class="' + id + '-data" dimensions="1 0.598058 0.407767" render="false">' +
						'<ImageTextureAtlas class="' + id + '-atlas" containerField="voxels" url="' + url + '" numberOfSlices="' + NUMBER_OF_SLICES + '" slicesOverX="' + SLICES_OVER_X + '" slicesOverY="' + SLICES_OVER_Y + '"></ImageTextureAtlas>' +
						'<MPRVolumeStyle id="' + id + '-proj-x" class="' + id + '-volume-x volume-x proj-x" ' + depthCodingText + ' isProjection="1.0" projectionDir="0.0" renderLines="0.0" sliceCount="1029" originLine="1 0 0" finalLine = "-1 0 0" positionLine="0.25" lineColor="0 1 1"></MPRVolumeStyle>' +
					'</VolumeData>';
	var yText = 	'<VolumeData class="' + id + '-data" dimensions="1 1 0.407767" render="false">' +
						'<ImageTextureAtlas class="' + id + '-atlas" containerField="voxels" url="' + url + '" numberOfSlices="' + NUMBER_OF_SLICES + '" slicesOverX="' + SLICES_OVER_X + '" slicesOverY="' + SLICES_OVER_Y + '"></ImageTextureAtlas>' +
						'<MPRVolumeStyle id="' + id + '-proj-y" class="' + id + '-volume-y volume-y proj-y" ' + depthCodingText + ' isProjection="1.0" projectionDir="1.0" renderLines="0.0" originLine="0 1 0" finalLine = "0 -1 0" positionLine="0.25" lineColor="0 1 1"></MPRVolumeStyle>' +
					'</VolumeData>';
	var zText = 	'<VolumeData class="' + id + '-data" dimensions="1 0.598058 1" render="false">' +
						'<ImageTextureAtlas class="' + id + '-atlas" containerField="voxels" url="' + url + '" numberOfSlices="' + NUMBER_OF_SLICES + '" slicesOverX="' + SLICES_OVER_X + '" slicesOverY="' + SLICES_OVER_Y + '"></ImageTextureAtlas>' +
						'<MPRVolumeStyle id="' + id + '-proj-z" class="' + id + '-volume-z volume-z proj-z" ' + depthCodingText + ' isProjection="1.0" projectionDir="2.0" renderLines="0.0" originLine="0 0 1" finalLine = "0 0 -1" positionLine="0.25" lineColor="0 1 1"></MPRVolumeStyle>' +
					'</VolumeData>';
	
	$('.proj-x-container').append(xText);
	$('.proj-y-container').append(yText);
	$('.proj-z-container').append(zText);
}

// Appends slicer and 3D volumes of new custom line
function appendCustomVolumes(id, url) {
	// Slicer/volume HTML
	var xText = '<VolumeData class="' + id + '-data" dimensions="1 0.598058 0.407767" render="false">' +
					'<ImageTextureAtlas class="' + id + '-atlas" containerField="voxels" url="' + url + '" numberOfSlices="' + NUMBER_OF_SLICES + '" slicesOverX="' + SLICES_OVER_X + '" slicesOverY="' + SLICES_OVER_Y + '"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="' + id + '-volume-x volume-x" originLine="1 0 0" finalLine = "-1 0 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>';
	var yText = '<VolumeData class="' + id + '-data" dimensions="1 1 0.407767" render="false">' +
					'<ImageTextureAtlas class="' + id + '-atlas" containerField="voxels" url="' + url + '" numberOfSlices="' + NUMBER_OF_SLICES + '" slicesOverX="' + SLICES_OVER_X + '" slicesOverY="' + SLICES_OVER_Y + '"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="' + id + '-volume-y volume-y" originLine="0 1 0" finalLine = "0 -1 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>';
	var zText = '<VolumeData class="' + id + '-data" dimensions="1 0.598058 1" render="false">' +
					'<ImageTextureAtlas class="' + id + '-atlas" containerField="voxels" url="' + url + '" numberOfSlices="' + NUMBER_OF_SLICES + '" slicesOverX="' + SLICES_OVER_X + '" slicesOverY="' + SLICES_OVER_Y + '"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="' + id + '-volume-z volume-z" originLine="0 0 1" finalLine = "0 0 -1" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>';
	var vText = '<VolumeData class="' + id + '-data" dimensions="2.4524 1.46667 1" render="false">' +
					'<ImageTextureAtlas class="' + id + '-atlas" containerField="voxels" url="' + url + '" numberOfSlices="' + NUMBER_OF_SLICES + '" slicesOverX="' + SLICES_OVER_X + '" slicesOverY="' + SLICES_OVER_Y + '"></ImageTextureAtlas>' +
					'<BoundaryEnhancementVolumeStyle class="' + id + '-volume-full volume-full"></BoundaryEnhancementVolumeStyle>' +
				'</VolumeData>';
	
	$('.volume-x-container').append(xText);
	$('.volume-y-container').append(yText);
	$('.volume-z-container').append(zText);
	$('.volume-full-container').append(vText);
}
