/*
 * This file manages many features in the right panel, especially the Settings menu, and other miscellaneous features of the browser
 */

var windowCounter = 0; // Used to assign unique IDs line info windows when they're opened
var openPopover = ''; // Stores ID of line with currently open color popover selector
var activeAnatomy = 'z-brain'; // Saves active anatomy type, either z-brain or pajevic

// Sets active anatomy type, controlled by button group at top of Anatomy menu
function setActiveAnatomy(type, btnID) {
	if(type != activeAnatomy) { // Checking to make sure selected anatomy is not already active
		$('.anatomy-1-selectable-data, .anatomy-2-selectable-data').attr('render', 'false'); // Turns off rendering of all selectable anatomy regions (shift-click regions)

		// Checks if selectable pajevic anatomy is currently being rendered, removes it if so
		var index1 = currRender.indexOf('anatomy-1-selectable');
		if(index1 > -1) {
			currRender.splice(index1, 1);
		}

		// Checks if selectable z-brain anatomy is currently being rendered, removes it if so
		var index2 = currRender.indexOf('anatomy-2-selectable');
		if(index2 > -1) {
			currRender.splice(index2, 1);
		}

		// Turns off full anatomy for both types
		toggleFullAnatomy('z-brain', 'show-full-btn', false);
		toggleFullAnatomy('pajevic', 'show-full-btn', false);
	}

	activeAnatomy = type; // Storing active anatomy type

	// Setting inset for active anatomy button
	$('.active-anatomy-btn').removeClass('active'); // "active" is a Bootstrap class used to give buttons an inset effect
	$('#' + btnID).addClass('active');
}

// Hides one anatomy panel and shows the other (pajevic or z-brain)
function swapAnatomyPanels(type) {
	$('.anatomy-regions-div').css('display', 'none');
	$('#' + type + '-regions-div').css('display', 'block');
}

// Helper function to deselect a line by deselecting its checkbox input
function deselectLine(id) {
	$('#' + id + '-checkbox').prop('checked', false).change();
}

// Will set open popover to '' (closed) if id matches popover currently open, otherwise will set open popover to given id
function togglePopover(id) {
	openPopover = (openPopover == id ? '' : id);
}

// Swaps active menu panels (menus include Lines, Anatomy, Settings, etc.)
function swapView(id, button) {
	// Insetting button of currently selected menu
	$('.nav-btn, .nav-btn-2').removeClass('active');
	$(button).addClass('active');

	// Hiding any currently open menus then showing selected menu
	$('.right-div').addClass('hidden');
	$('#' + id).removeClass('hidden');
}

// Deprecated function (unused)
// Was used before layout options were removed
function changeButtonInset(layout) {
	$('.layout-btn').removeClass('active');
	$('#layout-btn-' + layout).addClass('active');
}

// Will show/hide and individual line's settings in the draggable individual settings panel
function showSettings(checked, id) {
	$('#' + id + '-settings').css('display', (checked ? 'block' : 'none'));
	$('#' + id + '-color-key').css('display', (checked ? 'block' : 'none')); //ADDED CODE BY ISAAC
}

// Adjusts the height of the right panel so the bottom remains flush with the bottom of the left panel
// This function is typically called when the window is resized
function adjustRightDiv() {
	// Calculating and settings menu height (height of left panel minus height of navigation buttons)
	var numPixels = $('#left-panel-container').height() - $('#nav-btn-row-1').outerHeight() - $('#nav-btn-row-2').outerHeight();
	$('#right-div-container').innerHeight(numPixels + 'px');

	// Calculating height of lists in Lines menu, as not to create multiple unnecessary scroll bars
	// Setting list pane height to total menu height minus navigation tabs height
	var listHeight = $('#right-div-regions').height() - $('#line-selection-header').outerHeight(true) - $('#transgenic-selection-tab').outerHeight();
	$('.region-select-pane').outerHeight(listHeight + 'px');
}

// Sets window size
function changeWindowSize(btnID, size) {
	// Adjusting window size by changing widths of left and right panels
	// The greater the window size, the larger the width of the left panel
	$('#left-panel-container').css('width', size + '%');
	$('#right-panel').css('width', (100 - size) + '%'); // Percentage width of right panel will always be 100 - percentage width of left panel
	updateLines(); // Updating blue crosshair line locations

	// Changing inset for active window height button
	$('.win-button').removeClass('active');
	$('#' + btnID).addClass('active');

	updateSSVolumeAttribs(); // Updating spatial search highlight box when applicable
	adjustRightDiv(); // Updates right panel height
}

// Connects a line's slider and number inputs so one always updates with the other
function bindSliderAndNumberInputs(id) {
	// Contrast inputs (even though ids says "intensity")
	$('#' + id + '-intensity-input, #' + id + '-intensity-num').on('input', function() {
		$('#' + id + '-intensity-input, #' + id + '-intensity-num').val(this.value);
	});
	// Brightness inputs
	$('#' + id + '-brightness-input, #' + id + '-brightness-num').on('input', function() {
		$('#' + id + '-brightness-input, #' + id + '-brightness-num').val(this.value);
	});
}

// Constructs and opens a line's info window when it's info button is pressed
// All of the data displayed in this window is from data.js
function buildInfoWindow(id) {
	// Information shown in window
	var name;
	var publish;
	var pubmed;
	var integ;
	var zfin;
	var anatomy;
	var scanned;
	var smed;

	// Finding line's information based on id and type
	if(includes(TRANSGENIC, id)) {
		var index = TRANSGENIC.indexOf(id);
		name = TRANSGENIC_NAMES[index];
		publish = TRANSGENIC_PUBLISHED[index];
		pubmed = TRANSGENIC_PUBMED[index];
		integ = TRANSGENIC_INTEGRATION_SITE[index];
		zfin = TRANSGENIC_ZFIN_FEATURE[index];
		anatomy = TRANSGENIC_ANATOMY[index];
		scanned = TRANSGENIC_SCANNED[index];
		smed = TRANSGENIC_SPUBMED[index];
	} else if(includes(GAL4, id)) {
		var index = GAL4.indexOf(id);
		name = GAL4_NAMES[index];
		publish = GAL4_PUBLISHED[index];
		pubmed = GAL4_PUBMED[index];
		integ = GAL4_INTEGRATION_SITE[index];
		zfin = GAL4_ZFIN_FEATURE[index];
		anatomy = GAL4_ANATOMY[index];
		scanned = GAL4_SCANNED[index];
		smed = GAL4_SPUBMED[index];
	} else if(includes(CRE, id)) {
		var index = CRE.indexOf(id);
		name = CRE_NAMES[index];
		publish = CRE_PUBLISHED[index];
		pubmed = CRE_PUBMED[index];
		integ = CRE_INTEGRATION_SITE[index];
		zfin = CRE_ZFIN_FEATURE[index];
		anatomy = CRE_ANATOMY[index];
		scanned = CRE_SCANNED[index];
		smed = CRE_SPUBMED[index];
	} else if(includes(MISC, id)) {
		var index = MISC.indexOf(id);
		name = MISC_NAMES[index];
		publish = MISC_PUBLISHED[index];
		pubmed = MISC_PUBMED[index];
		integ = MISC_INTEGRATION_SITE[index];
		zfin = MISC_ZFIN_FEATURE[index];
		anatomy = MISC_ANATOMY[index];
		scanned = MISC_SCANNED[index];
		smed = MISC_SPUBMED[index];
	} else {
		name = HUC_CER_NAME[0];
		publish = HUC_CER_PUBLISHED[0];
		pubmed = HUC_CER_PUBMED[0];
		integ = HUC_CER_INTEGRATION_SITE[0];
		zfin = HUC_CER_ZFIN_FEATURE[0];
		anatomy = HUC_CER_ANATOMY[0];
		scanned = HUC_CER_SCANNED[0];
		smed = HUC_CER_SPUBMED[0];
	}

	// Constructing HTML for info window
	// Styles are also provided in style tags because this window doesn't link to any stylesheets
	var infoText = 	'<title>' +
						(name == '' ? id : name) + ' Info' +
					'</title>' +
					'<style>' +
					'body {' +
						'margin: 0;' +
						'overflow-y: hidden;' +
					'}' +
					'.ind-info {' +
						'font-family: verdana;' +
						'position: absolute;' +
						'top: 8px;' +
						'bottom: 8px;' +
						'left: 8px;' +
						'right: 8px;' +
						'color: white;' +
						'padding: 19px;' +
						'border-radius: 20px;' +
						'box-shadow: 0 0 20px black;' +
						'background: #555555;' +
					'}' +
					'.header-p {' +
						'margin-bottom: 0;' +
						'font-weight: bold;' +
					'}' +
					'.text-p {' +
						'margin-top: 0;' +
					'}' +
					'.zfin-link {' +
						'color: white;' +
					'}' +
					'</style>' +
					'<div id="' + id + '-info" class="ind-info">' +
						'<p class="header-p">Line:</p>' +
						'<p class="text-p">' + (name == '' ? id : name) + '</p>' +
						'<p class="header-p">Published:</p>' +
						'<p class="text-p">' + (pubmed == '' ? '' : '<a class="zfin-link" href="https://www.ncbi.nlm.nih.gov/pubmed/' + pubmed + '" target="_blank">') + publish + (pubmed == '' ? '' : '</a>') + '</p>' +
						'<p class="header-p">Integration Site:</p>' +
						'<p class="text-p">'+ integ + '</p>' +
						'<p class="header-p">ZFIN Feature:</p>' +
						'<p class="text-p"><a class="zfin-link" href="' + zfin + '" target="_blank">' + zfin + '</a></p>' +
						'<p class="header-p">Anatomy:</p>' +
						'<p class="text-p">' + anatomy + '</p>' +
						'<p class="header-p">Scanned By:</p>' +
						'<p class="text-p">' + (smed == '' ? '' : '<a class="zfin-link" href="https://www.ncbi.nlm.nih.gov/pubmed/' + smed + '" target="_blank">') + scanned + (smed == '' ? '' : '</a>') + '</p>' +
					'</div>';

	// Opening info window
	var infoWindow = window.open('', id + '-window-' + windowCounter++, 'width=500px,height=500px'); // windowCounter is used and incremented to make sure every window opened is unique
	infoWindow.document.write(infoText); // Writing constructed HTML to window
}

// Function used to append a line's volumes (slicer and 3D) when it is first turned on
// NOTE: This function is not used to create the HuC-Cer volume, which is hardcoded in index.html
// Changes made to this function should be updated to the HuC-Cer volumes in index.html as well
function appendVolumes(id) {
	var type;

	// Finding line's type based on ID, used for image URL
	if(includes(TRANSGENIC, id)) {
		type = 'transgenic';
	} else if(includes(GAL4, id)) {
		type = 'gal4';
	} else if(includes(CRE, id)) {
		type = 'cre';
	} else {
		type = 'misc';
	}

	// Constructing HTML for each volume (x, y, z, 3D)
	// These volumes use the X3DOM libraries https://doc.x3dom.org/author/index.html
	var xText = '<VolumeData class="' + id + '-data" dimensions="1 0.598058 0.407767" render="false">' +
					'<ImageTextureAtlas class="' + id + '-atlas" containerField="voxels" url="res/lineImages/' + type + '/' + id + '/' + id + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="' + id + '-volume-x volume-x" originLine="1 0 0" finalLine = "-1 0 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075">' +
						'<ImageTexture class="' + id + '-transfer-atlas" containerField="transferFunction"></ImageTexture>' + // This transfer function is used ONLY for AND intersecting two lines, same with the ImageTexture tags below
					'</MPRVolumeStyle>' +
				'</VolumeData>';
	var yText = '<VolumeData class="' + id + '-data" dimensions="1 1 0.407767" render="false">' +
					'<ImageTextureAtlas class="' + id + '-atlas" containerField="voxels" url="res/lineImages/' + type + '/' + id + '/' + id + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="' + id + '-volume-y volume-y" originLine="0 1 0" finalLine = "0 -1 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075">' +
						'<ImageTexture class="' + id + '-transfer-atlas" containerField="transferFunction"></ImageTexture>' +
					'</MPRVolumeStyle>' +
				'</VolumeData>';
	var zText = '<VolumeData class="' + id + '-data" dimensions="1 0.598058 1" render="false">' +
					'<ImageTextureAtlas class="' + id + '-atlas" containerField="voxels" url="res/lineImages/' + type + '/' + id + '/' + id + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="' + id + '-volume-z volume-z" originLine="0 0 1" finalLine = "0 0 -1" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075">' +
						'<ImageTexture class="' + id + '-transfer-atlas" containerField="transferFunction"></ImageTexture>' +
					'</MPRVolumeStyle>' +
				'</VolumeData>';
	var vText = '<VolumeData class="' + id + '-data" dimensions="2.4524 1.46667 1" render="false">' +
					'<ImageTextureAtlas class="' + id + '-atlas" containerField="voxels" url="res/lineImages/' + type + '/' + id + '/' + id + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<BoundaryEnhancementVolumeStyle class="' + id + '-volume-full volume-full"></BoundaryEnhancementVolumeStyle>' +
				'</VolumeData>';

	// Appending volumes to page
	$('.volume-x-container').append(xText);
	$('.volume-y-container').append(yText);
	$('.volume-z-container').append(zText);
	$('.volume-full-container').append(vText);
}

// Function used to append a line's projection volumes when it is first turned on
// NOTE: This function is not used to create the HuC-Cer volume, which is hardcoded in index.html
// Changes made to this function should be updated to the HuC-Cer volumes in index.html as well
function appendProjections(id) {
	var type;

	// Finding line's type based on id
	if(includes(TRANSGENIC, id)) {
		type = 'transgenic';
	} else if(includes(GAL4, id)) {
		type = 'gal4';
	} else if(includes(CRE, id)) {
		type = 'cre';
	} else {
		type = 'misc';
	}

	// Checking whether depth coding is currently enabled
	var depthCodingText = $('#depth-code-projections-checkbox').prop('checked') ? 'depthCoded="1.0"' : '';

	// Constructing HTML for projection volumes, setting depth coding based on whether it's currently active
	var xText = 	'<VolumeData class="' + id + '-data" dimensions="1 0.598058 0.407767" render="false">' +
						'<ImageTextureAtlas class="' + id + '-atlas" containerField="voxels" url="res/lineImages/' + type + '/' + id + '/' + id + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
						'<MPRVolumeStyle id="' + id + '-proj-x" class="' + id + '-volume-x volume-x proj-x" ' + depthCodingText + ' isProjection="1.0" projectionDir="0.0" renderLines="0.0" sliceCount="1029" originLine="1 0 0" finalLine = "-1 0 0" positionLine="0.25" lineColor="0 1 1"></MPRVolumeStyle>' +
					'</VolumeData>';
	var yText = 	'<VolumeData class="' + id + '-data" dimensions="1 1 0.407767" render="false">' +
						'<ImageTextureAtlas class="' + id + '-atlas" containerField="voxels" url="res/lineImages/' + type + '/' + id + '/' + id + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
						'<MPRVolumeStyle id="' + id + '-proj-y" class="' + id + '-volume-y volume-y proj-y" ' + depthCodingText + ' isProjection="1.0" projectionDir="1.0" renderLines="0.0" originLine="0 1 0" finalLine = "0 -1 0" positionLine="0.25" lineColor="0 1 1"></MPRVolumeStyle>' +
					'</VolumeData>';
	var zText = 	'<VolumeData class="' + id + '-data" dimensions="1 0.598058 1" render="false">' +
						'<ImageTextureAtlas class="' + id + '-atlas" containerField="voxels" url="res/lineImages/' + type + '/' + id + '/' + id + '_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
						'<MPRVolumeStyle id="' + id + '-proj-z" class="' + id + '-volume-z volume-z proj-z" ' + depthCodingText + ' isProjection="1.0" projectionDir="2.0" renderLines="0.0" originLine="0 0 1" finalLine = "0 0 -1" positionLine="0.25" lineColor="0 1 1"></MPRVolumeStyle>' +
					'</VolumeData>';

	// Appending volumes to page
	$('.proj-x-container').append(xText);
	$('.proj-y-container').append(yText);
	$('.proj-z-container').append(zText);
}

// Used to append a line's individual settings to the individual settings panel
// NOTE: This function is not used to create the HuC-Cer settings panel, which is hardcoded in index.html
// Changes made to this function should be updated to the HuC-Cer settings panel in index.html as well
function appendSettings(id, toggleIndex) {
	var name;

	// Getting name of line based on its id (needed for proper capitalization)
	if(includes(TRANSGENIC, id)) {
		var index = TRANSGENIC.indexOf(id);
		name = TRANSGENIC_NAMES[index];
	} else if(includes(GAL4, id)) {
		var index = GAL4.indexOf(id);
		name = GAL4_NAMES[index];
	} else if(includes(CRE, id)) {
		var index = CRE.indexOf(id);
		name = CRE_NAMES[index];
	} else {
		var index = MISC.indexOf(id);
		name = MISC_NAMES[index];
	}

	// Creating settings panel for line
	var settingsText = 	'<div id="' + id + '-settings" class="individual-settings">' +
							// Color picker button
							'<button id="' + id + '-color" class="btn btn-default btn-xs color-picker" data-toggle="popover" data-html="true" data-placement="top" data-animation="false" data-container="body" onclick="swapInfoView(\'' + id + '\'); togglePopover(\'' + id + '\');">' +
								'<h4 id="' + id + '-settings-header" class="settings-header">' + (name == '' ? id : name) + '</h4>' + // Name being displayed in this button
								'<span id="' + id + '-color-span" class="color-label"></span>' +
							'</button>' +
							// X button to deselect line
							'<button class="line-deselect-btn close" type="button" onclick="deselectLine(\'' + id + '\')">&times;</button>' +
							// Reset button
							'<button class="individual-reset-btn btn btn-xs btn-success" type="button" onclick="resetIndividual(\'' + id + '\')">Reset</button>' +
							// Line info button (builds info window on click)
							'<button class="btn btn-xs btn-primary line-info-btn" type="button" onclick="buildInfoWindow(\'' + id + '\')"><img class="line-info-img" src="res/info.png" alt="Info" /></button>' +
							// Visibility button
							(toggleIndex > -1 ? '<button id="' + id + '-toggle-btn" class="btn btn-xs btn-default individual-settings-toggle" type="button" onclick="toggleSelection(' + toggleIndex + ')"></button>' : '') +
							// Toggle button label (where applicable)
							'<p id="' + id + '-toggle-num" class="toggle-num"></p>'+
							// Contrast inputs (Note: the volume attribute for contrast is called "renderIntensity", a name that was chosen before deciding on Contrast)
							'<div class="input-block container-fluid no-padding">' +
								'<div class="row settings-row margin-0">' +
									// Contrast label
									'<div class="col-sm-4 no-padding">' +
										'<p class="settings-value-header">Contrast</p>' +
									'</div>' +
									// Contrast slider input (Note "renderIntensity" attribute name)
									'<div class="col-sm-5 no-padding slider-input-div">' +
										'<input id="' + id + '-intensity-input" class="slider-input" type="range" min="0" max="20" step="0.01" oninput="changeIndividualAttrib(\'' + id + '\', \'renderIntensity\', this.value)" />' +
									'</div>' +
									// Contrast number input (Note "renderIntensity" attribute name)
									'<div class="col-sm-3 padding-right-0">' +
										'<input id="' + id + '-intensity-num" class="number-input form-control" type="number" min="0" max="20" step="0.01" value="1" oninput="changeIndividualAttrib(\'' + id + '\', \'renderIntensity\', this.value)" />' +
									'</div>' +
								'</div>' +
							'</div>' +
							// Brightness inputs
							'<div class="input-block container-fluid no-padding">' +
								'<div class="row settings-row margin-0">' +
									// Brightness label
									'<div class="col-sm-4 no-padding">' +
										'<p class="settings-value-header">Brightness</p>' +
									'</div>' +
									// Brightness slider input
									'<div class="col-sm-5 no-padding slider-input-div">' +
										'<input id="' + id + '-brightness-input" class="slider-input" type="range" min="-2" max="2" step="0.01" oninput="changeIndividualAttrib(\'' + id + '\', \'brightness\', this.value)" />' +
									'</div>' +
									// Brightness number input
									'<div class="col-sm-3 padding-right-0">' +
										'<input id="' + id + '-brightness-num" class="number-input form-control" type="number" min="-2" max="2" step="0.01" value="0" oninput="changeIndividualAttrib(\'' + id + '\', \'brightness\', this.value)" />' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>';

	// Appending line settings to page
	$('.individual-settings-container').append(settingsText);

	//Appending color key to page
	var colorKey = '<p id="' + id + '-color-key" class="individual-color-key">' + (name == '' ? id : name) + '</p>';
	$('.color-keys').append(colorKey);
}

//Open help document
function openHelp(section) {
	window.open('help.html#'+section);
}

//Toggle help buttons on when checked
function toggleHelp(checked) {
	$('.help-btn').css('display', (checked ? 'block' : 'none'));
}
