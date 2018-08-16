/*
 * This file contains helper functions for modifying volume attributes such as contrast, brightness, etc.
 */

// IDs of all currently rendered volumes (including line volumes, anatomy volumes, etc.)
// This array is very useful for determining what's currently visible to the user
var currRender = [HUC_CER[0]]; // HuC-Cer always on at start

// Changes the value of an attribute for all currently rendered lines in all slicer views and the 3D view
function changeOverallAttrib(attrib, value) {
	$.each(currRender, function(i, val) {
		// The following specify that if the attribute "renderLines" is being set, projection volumes will not be affected
		$('.' + val + '-volume-x' + (attrib == 'renderLines' ? ':not(.proj-x)' : '')).attr(attrib, value);
		$('.' + val + '-volume-y' + (attrib == 'renderLines' ? ':not(.proj-y)' : '')).attr(attrib, value);
		$('.' + val + '-volume-z' + (attrib == 'renderLines' ? ':not(.proj-z)' : '')).attr(attrib, value);
		$('.' + val + '-volume-full').attr(attrib, value);
	});
}

// Changes the value of an attribute for one line
function changeIndividualAttrib(id, attrib, value) {
	$('.' + id + '-volume-x').attr(attrib, value);
	$('.' + id + '-volume-y').attr(attrib, value);
	$('.' + id + '-volume-z').attr(attrib, value);
	$('.' + id + '-volume-full').attr(attrib, value);
	
	// Deprecated functionality
	//swapInfoView(id);
}

// Changes the value of an attribute for one line in only the slicer views
function changeSlicerAttrib(id, attrib, value) {
	$('.' + id + '-volume-x').attr(attrib, value);
	$('.' + id + '-volume-y').attr(attrib, value);
	$('.' + id + '-volume-z').attr(attrib, value);
}

// Changes the value of an attribute for one line in only the 3D volume view
function changeVolumeAttrib(id, attrib, value) {
	$('.' + id + '-volume-full').attr(attrib, value);
	
	// Deprecated functionality
	//swapInfoView(id);
}

// Turns projection depth coding on/off
function toggleDepthCoding(enabled) {
	$('.proj-x, .proj-y, .proj-z').attr('depthCoded', enabled ? 1.0 : 0.0);
}
