/*
 * This file manages the key toggle feature, where the first 9 selected lines can be toggled on/off with hotkeys 1-9
 */

// The opacity of the line settings panels when lines are toggled OFF
const TOGGLED_OFF_OPACITY = 0.25;

// This array records the IDs of the lines bound to key toggles
var firstSelected = [HUC_CER[0], '', '', '', '', '', '', '', ''];

// This keeps track of whether the toggleable lines in the array above are actually toggled off
// Lines in the array above and values in this array are associated by index (i.e. HuC-Cer is bound to the first value in this array)
// Note: A value of "true" in the array below means the corresponding line is toggled OFF and is invisible
var toggled = [false, false, false, false, false, false, false, false, false];

// This value keeps track of how many lines have been bound to keys
var selectedCount = 1;

// Toggles the visiblility of a line based on its toggle index
function toggleSelection(index) {
	if(firstSelected[index] == AND_VIS_ID) { // Checking if toggle index corresponds to the AND intersection ID, which is a separate case
		toggled[index] = !toggled[index];

		// Adjusting the "showAND" value of the intersected lines based on the toggle value
		// Note that this process is different when toggling normal lines, in which case the "keyDisabled" attribute is adjusted
		// The firstLineBeingIntersected and secondLineBeingIntersected variables store the IDs of the lines currently being intersected, and can be found in andIntersection.js
		$('.' + firstLineBeingIntersected + '-volume-x, .' + firstLineBeingIntersected + '-volume-y, .' + firstLineBeingIntersected + '-volume-z, .' + firstLineBeingIntersected + '-volume-full').attr('showAND', toggled[index] ? 0.0 : 1.0);
		$('.' + secondLineBeingIntersected + '-volume-x, .' + secondLineBeingIntersected + '-volume-y, .' + secondLineBeingIntersected + '-volume-z, .' + secondLineBeingIntersected + '-volume-full').attr('showAND', toggled[index] ? 0.0 : 1.0);

		// Changing the intersection's settings bar opacity
		$('#and-controls-container').css('opacity', toggled[index] ? TOGGLED_OFF_OPACITY : '1.0');

		// Changing visibility icon
		if(toggled[index]) {
			$('#' + firstSelected[index] + '-toggle-btn').css('background-image', 'url(res/vis-off.png)');
		} else {
			$('#' + firstSelected[index] + '-toggle-btn').css('background-image', 'url(res/vis-on.png)');
		}
	} else if(firstSelected[index] != '' && includes(currRender, firstSelected[index])) { // Making sure the key is bound to a line and the line is currently being rendered
		toggled[index] = !toggled[index];

		// Adjusting the "keyDisabled" volume attribute for the line being toggled
		var id = firstSelected[index];
		$('.' + id + '-volume-x, .' + id + '-volume-y, .' + id + '-volume-z, .' + id + '-volume-full').attr('keyDisabled', toggled[index] ? 1.0 : 0.0);

		// Changing the line's settings bar opacity
		$('#' + id + '-settings').css('opacity', toggled[index] ? TOGGLED_OFF_OPACITY : '1.0');

		// Changing visiblity icon
		if(toggled[index]) {
			$('#' + firstSelected[index] + '-toggle-btn').css('background-image', 'url(res/vis-off.png)');
			$('#' + firstSelected[index] + '-color-key').css('visibility', 'hidden');
		} else {
			$('#' + firstSelected[index] + '-toggle-btn').css('background-image', 'url(res/vis-on.png)');
			$('#' + firstSelected[index] + '-color-key').css('visibility', 'visible');
		}
	}
}

// Maps a line ID to a toggle key when the line is first turned on
function storeSelection(id) {
	if(selectedCount < firstSelected.length && !includes(firstSelected, id)) { // Checks that not all lines have already been bound and line id passed has not already been bound
		firstSelected[selectedCount] = id;
		findIndex();
		var toggleIndex = selectedCount++;
		return toggleIndex; // Returns index of bound key
							// Note that the index will always be 1 less than the key binding (i.e. key binding for HuC-Cer is 1, but its toggle index is 0)
	}

	return -1; // Returning a negative number if all keys are already bound or if line has already been bound
}

// Resets all lines to be toggled ON, this is called when the Settings reset button is clicked
function resetToggles() {
	for(var i = 0; i < toggled.length; i++) {
		if(toggled[i]) { // Only toggling back on if line is currently toggled OFF
			toggleSelection(i);
		}
	}
}

//Removes from selection when deselected
function removeSelection(id) {
	for(var i = 0; i < firstSelected.length; i++) {
		if(firstSelected[i] == id) {
			firstSelected.splice(i, 1);
			toggled.splice(i, 1);
			firstSelected.push('');
			toggled.push(false);
			selectedCount--;
		}
	}
}

//Finds the key at which the line is located
function findIndex() {
	for(var i = 0; i < firstSelected.length; i++) {
		if(firstSelected[i] != "") {
			$('#' + firstSelected[i] + '-toggle-num').text(i+1);
		}
	}
}
