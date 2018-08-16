/*
 * This file manages the resolutions of the image texture atlases used for volume rendering
 */

// The current selected resolution, 2560 is low res by default
var currRes = 2560;

// Updates the resolution of all atlases used by the specified line ID
function updateURLs(res, type, id) {
	$('.' + id + '-atlas').attr('url', 'res/lineImages/' + type + '/' + id + '/' + id + '_' + res + '.png');
}

// Function called whenever a resolution button is pressed in the Settings menu
// Changes the image resolution for all applicable volumes
function changeResolution(srcID, res) {
	// Looping through and updating texure atlas URLs for all currently rendered lines
	$.each(currRender, function(i, val) {
		// See data.js for what arrays are being searched
		if(includes(TRANSGENIC, val)) {
			updateURLs(res, 'transgenic', val);
		} else if(includes(GAL4, val)) {
			updateURLs(res, 'gal4', val);
		} else if(includes(CRE, val)) {
			updateURLs(res, 'cre', val);
		} else if(includes(MISC, val)) {
			updateURLs(res, 'misc', val);
		}
	});
	
	// Special cases for items currently being rendered whose image URLs should be updated
	if(includes(currRender, HUC_CER[0])) { // HuC-Cer line
		$('.huc-cer-atlas').attr('url', 'res/lineImages/transgenic/huc-cer/huc-cer_' + res + '.png');
	}
	if(includes(currRender, 'anatomy-1')) { // Full pajevic anatomy (glasbey, unused)
		$('.anatomy-1-atlas').attr('url', 'res/anatomy/anatomy-1/anatomy-1_' + res + '.png');
	}
	if(includes(currRender, 'anatomy-1-edges')) { // Full pajevic anatomy (edges)
		$('.anatomy-1-edges-atlas').attr('url', 'res/anatomy/anatomy-1-edges/anatomy-1_' + res + '.png');
	}
	if(includes(currRender, 'anatomy-2')) { // Full z-brain anatomy (glasbey, unused)
		$('.anatomy-2-atlas').attr('url', 'res/anatomy/anatomy-2/anatomy-2_' + res + '.png');
	}
	if(includes(currRender, 'anatomy-2-edges')) { // Full z-brain anatomy (edges)
		$('.anatomy-2-edges-atlas').attr('url', 'res/anatomy/anatomy-2-edges/anatomy-2_' + res + '.png');
	}
	
	// Changing button inset for actively selected resolution button
	// "active" class is a Bootstrap class used to specify whether a button is inset
	$('.res-button').removeClass('active');
	$('#' + srcID).addClass('active');
	
	// Updating the currently selected resolution
	currRes = res;
}
