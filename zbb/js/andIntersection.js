/*
 * This file manages behavior of the AND intersection feature
 */

// Constant used to identify the AND intersection
// This ID is solely used by the key toggle feature, see keyToggle.js
const AND_VIS_ID = 'and-intersection';

// IDs of first and second lines selected for intersection
// These values will always be empty ('') whenever no intersection is currently selected
var firstLineBeingIntersected = '';
var secondLineBeingIntersected = '';

// Appends AND intersection controls to the individual settings menu
// Note that these controls are different from the regular line controls and do not support things like contrast or brightness
function appendANDControls() {
	// Gets toggle index of AND intersection if space if available
	var toggleIndex = storeSelection(AND_VIS_ID);
	
	// Constructing controls HTML
	var controlsText = 	'<div id="and-controls-container" class="container-fluid no-padding individual-settings">' +
							// Title label
							'<h5 class="and-controls-header">' + firstLineBeingIntersected + ' AND ' + secondLineBeingIntersected + '</h5>' +
							// X button to remove AND intersection
							'<button class="line-deselect-btn close" type="button" onclick="hideAND()">&times;</button>' +
							// Visiblity toggle button and label
							(toggleIndex > -1 ? '<button id="' + AND_VIS_ID + '-toggle-btn" class="btn btn-xs btn-default individual-settings-toggle" type="button" onclick="toggleSelection(' + toggleIndex + ')"></button>' : '') +
							'<p class="toggle-num">' + (toggleIndex > -1 ? toggleIndex + 1 : '') + '</p>' +
						'</div>';
	
	$('.individual-settings-container').append(controlsText);
}

// Function used to generate and show AND intersection when "Create AND intersection" button is pressed
function showAND() {
	var firstLine = ''; // ID of first line being intersected
	var firstType = ''; // Type of first line being intersected (transgenic, gal4, cre, or misc)
	var secondLine = ''; // ID of second line being intersected
	var secondType = ''; // Type of second line being intersected (transgenic, gal4, cre, or misc)
	var tooMany = false; // Used to determine if more than two lines are selected when attempting to intersect
	
	// Finding all current selected lines that are candidates for intersection
	$.each(currRender, function(i, id) {
		var isLine = id == HUC_CER[0] || TRANSGENIC.includes(id) || GAL4.includes(id) || CRE.includes(id) || MISC.includes(id); // Checks to see if id is that of a line (not anatomy, etc.)
		var isWhite = $('.' + id + '-volume-z').attr('baseColor') == COL_3 || $('.' + id + '-volume-z').attr('baseColor') == '1.0 1.0 1.0' || $('.' + id + '-volume-z').attr('baseColor') == '1 1 1'; // Checks if line is white (white lines are ignored)
		var visibleIndex = firstSelected.indexOf(id);
		var isVisible = visibleIndex < 0 || !toggled[visibleIndex]; // Checking if line is currently visible (invisible lines are ignored)
		
		// Ignoring IDs that don't belong to a line, are white, or are invisible (Note that custom-loaded lines are also ignored, as they are not in the listed line data in data.js)
		if(isLine && !isWhite && isVisible) {
			if(firstLine == '') {
				firstLine = id; // Setting first-found line for intersection
				
				// Getting line's type
				if(id == HUC_CER[0] || TRANSGENIC.includes(id)) {
					firstType = 'transgenic';
				} else if(GAL4.includes(id)) {
					firstType = 'gal4';
				} else if(CRE.includes(id)) {
					firstType = 'cre';
				} else {
					firstType = 'misc';
				}
			} else if(secondLine == '') {
				secondLine = id; // Setting second-found line for intersection
				
				// Getting line's type
				if(id == 'huc-cer' || TRANSGENIC.includes(id)) {
					secondType = 'transgenic';
				} else if(GAL4.includes(id)) {
					secondType = 'gal4';
				} else if(CRE.includes(id)) {
					secondType = 'cre';
				} else {
					secondType = 'misc';
				}
			} else {
				tooMany = true; // Marked true if more than two applicable lines are found, meaning an intersection cannot be performed
			}
		}
	});
	
	if(secondLine == '' || tooMany) { // Not performing an intersection if more or less than two applicable lines are selected
		alert('Exactly two non-white lines must be selected and visible to perform an AND intersection.');
	} else {
		// Mapping each line's texture atlas to the other's
		setTransferFunction(firstLine, firstType, secondLine, secondType);
		setTransferFunction(secondLine, secondType, firstLine, firstType);
		
		// Setting global ID variables
		firstLineBeingIntersected = firstLine;
		secondLineBeingIntersected = secondLine;
		
		// Appending intersection controls to individual settings panel
		appendANDControls();
		
		// Swapping "Create" button with "Remove" button
		$('#showANDBtn').css('display', 'none');
		$('#hideANDBtn').css('display', 'initial');
	}
}

// Binds one intersected line's texture atlas to the other's for reading
function setTransferFunction(first, firstType, second, secondType) {
	// Sets transfer function's URL to other line's atlas
	var transferURL = 'res/lineImages/' + secondType + '/' + second + '/' + second + '_2560.png';
	$('.' + first + '-transfer-atlas').attr('url', transferURL);
	
	// Sets threshold value of other line, used to calculate where intersection occurs
	var otherThreshold = $('.' + second + '-volume-z').attr('threshold');
	$('.' + first + '-volume-x').attr('otherThreshold', otherThreshold);
	$('.' + first + '-volume-y').attr('otherThreshold', otherThreshold);
	$('.' + first + '-volume-z').attr('otherThreshold', otherThreshold);
	
	// Showing AND intersection for this line
	$('.' + first + '-volume-x').attr('showAND', 1);
	$('.' + first + '-volume-y').attr('showAND', 1);
	$('.' + first + '-volume-z').attr('showAND', 1);
}

// Hides AND intersection that currently exists
function hideAND() {
	// Disassociates texture atlases
	removeTransferFunction(firstLineBeingIntersected);
	removeTransferFunction(secondLineBeingIntersected);
	
	// Resets currently intersected lines
	firstLineBeingIntersected = '';
	secondLineBeingIntersected = '';
	
	// Removes controls panel from individual settings menu
	$('#and-controls-container').remove();
	
	// Swapping "Remove" button with "Create" button
	$('#hideANDBtn').css('display', 'none');
	$('#showANDBtn').css('display', 'initial');
	
	// Removes AND intersection from key toggle list, this done so AND intersection isn't bound multiple times when multiple AND intersections are made over time
	var andIndex = firstSelected.indexOf(AND_VIS_ID);
	if(andIndex > -1) {
		firstSelected[andIndex] = '';
		toggled[andIndex] = false;
	}
}

// This function simply turns off the AND intersection for the specified volume (doesn't actually affect the transfer function)
function removeTransferFunction(line) {
	$('.' + line + '-volume-x').attr('showAND', 0);
	$('.' + line + '-volume-y').attr('showAND', 0);
	$('.' + line + '-volume-z').attr('showAND', 0);
}
