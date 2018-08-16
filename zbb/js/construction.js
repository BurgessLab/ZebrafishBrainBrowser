/*
 * This script is used to append information to the page when it first loads, including anatomy data and the lines list in the Lines menu
 * Much of this appending is based on the data in data.js
 */

// Builds and appends anatomy volumes
// This function is all entirely hardcoded and does not rely on data from anywhere outside the function, always refer to this function when editing anatomy volumes
function buildAnatomyVolumes() {
	var xText = '';
	var yText = '';
	var zText = '';
	var vText = '';
	
	// Creating X3DOM volumes for ALL full anatomy volumes
	// Volumes with classes anatomy-1-edges-data and anatomy-2-edges-data refer to the full edge volumes shown when pressing "Show Full"
	// Volumes with classes anatomy-(id)-selectable-volume-(window) refer to volumes shown when shift-clicking a region, their image URLs are updated whenever a new region is selected
	// Volumes with classes anatomy-1-data and anatomy-2-data was used for old Glasbey anatomy volumes and are no longer used
	var xText = '<VolumeData class="anatomy-1-data" dimensions="1 0.598058 0.407767" render="false">' + 
					'<ImageTextureAtlas class="anatomy-1-atlas" containerField="voxels" url="res/anatomy/anatomy-1/anatomy-1_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-1-volume-x volume-x" isAnatomy="1.0" originLine="1 0 0" finalLine="-1 0 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-1-edges-data" dimensions="1 0.598058 0.407767" render="false">' +
					'<ImageTextureAtlas class="anatomy-1-edges-atlas" containerField="voxels" url="res/anatomy/anatomy-1-edges/anatomy-1_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-1-edges-volume-x volume-x" isAnatomy="1.0" isEdges="1.0" originLine="1 0 0" finalLine="-1 0 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-2-data" dimensions="1 0.598058 0.407767" render="false">' + 
					'<ImageTextureAtlas class="anatomy-2-atlas" containerField="voxels" url="res/anatomy/anatomy-2/anatomy-2_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-2-volume-x volume-x" isAnatomy="1.0" originLine="1 0 0" finalLine="-1 0 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-2-edges-data" dimensions="1 0.598058 0.407767" render="false">' + 
					'<ImageTextureAtlas class="anatomy-2-edges-atlas" containerField="voxels" url="res/anatomy/anatomy-2-edges/anatomy-2_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-2-edges-volume-x volume-x" isAnatomy="1.0" isEdges="1.0" originLine="1 0 0" finalLine="-1 0 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-1-selectable-data" dimensions="1 0.598058 0.407767" render="false">' + 
					'<ImageTextureAtlas class="anatomy-1-selectable-atlas" containerField="voxels" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-1-selectable-volume-x volume-x" isAnatomy="1.0" isEdges="1.0" originLine="1 0 0" finalLine="-1 0 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-2-selectable-data" dimensions="1 0.598058 0.407767" render="false">' + 
					'<ImageTextureAtlas class="anatomy-2-selectable-atlas" containerField="voxels" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-2-selectable-volume-x volume-x" isAnatomy="1.0" isEdges="1.0" originLine="1 0 0" finalLine="-1 0 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>';
	var yText = '<VolumeData class="anatomy-1-data" dimensions="1 1 0.407767" render="false">' +
					'<ImageTextureAtlas class="anatomy-1-atlas" containerField="voxels" url="res/anatomy/anatomy-1/anatomy-1_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-1-volume-y volume-y" isAnatomy="1.0" originLine="0 1 0" finalLine = "0 -1 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-1-edges-data" dimensions="1 1 0.407767" render="false">' +
					'<ImageTextureAtlas class="anatomy-1-edges-atlas" containerField="voxels" url="res/anatomy/anatomy-1-edges/anatomy-1_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-1-edges-volume-y volume-y" isAnatomy="1.0" isEdges="1.0" originLine="0 1 0" finalLine = "0 -1 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-2-data" dimensions="1 1 0.407767" render="false">' +
					'<ImageTextureAtlas class="anatomy-2-atlas" containerField="voxels" url="res/anatomy/anatomy-2/anatomy-2_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-2-volume-y volume-y" isAnatomy="1.0" originLine="0 1 0" finalLine = "0 -1 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-2-edges-data" dimensions="1 1 0.407767" render="false">' +
					'<ImageTextureAtlas class="anatomy-2-edges-atlas" containerField="voxels" url="res/anatomy/anatomy-2-edges/anatomy-2_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-2-edges-volume-y volume-y" isAnatomy="1.0" isEdges="1.0" originLine="0 1 0" finalLine = "0 -1 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-1-selectable-data" dimensions="1 1 0.407767" render="false">' +
					'<ImageTextureAtlas class="anatomy-1-selectable-atlas" containerField="voxels" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-1-selectable-volume-y volume-y" isAnatomy="1.0" isEdges="1.0" originLine="0 1 0" finalLine = "0 -1 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-2-selectable-data" dimensions="1 1 0.407767" render="false">' +
					'<ImageTextureAtlas class="anatomy-2-selectable-atlas" containerField="voxels" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-2-selectable-volume-y volume-y" isAnatomy="1.0" isEdges="1.0" originLine="0 1 0" finalLine = "0 -1 0" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>';
	var zText = '<VolumeData class="anatomy-1-data" dimensions="1 0.598058 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-1-atlas" containerField="voxels" url="res/anatomy/anatomy-1/anatomy-1_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-1-volume-z volume-z" isAnatomy="1.0" originLine="0 0 1" finalLine = "0 0 -1" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-1-edges-data" dimensions="1 0.598058 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-1-edges-atlas" containerField="voxels" url="res/anatomy/anatomy-1-edges/anatomy-1_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-1-edges-volume-z volume-z" isAnatomy="1.0" isEdges="1.0" originLine="0 0 1" finalLine = "0 0 -1" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-2-data" dimensions="1 0.598058 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-2-atlas" containerField="voxels" url="res/anatomy/anatomy-2/anatomy-2_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-2-volume-z volume-z" isAnatomy="1.0" originLine="0 0 1" finalLine = "0 0 -1" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-2-edges-data" dimensions="1 0.598058 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-2-edges-atlas" containerField="voxels" url="res/anatomy/anatomy-2-edges/anatomy-2_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-2-edges-volume-z volume-z" isAnatomy="1.0" isEdges="1.0" originLine="0 0 1" finalLine = "0 0 -1" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-1-selectable-data" dimensions="1 0.598058 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-1-selectable-atlas" containerField="voxels" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-1-selectable-volume-z volume-z" isAnatomy="1.0" isEdges="1.0" originLine="0 0 1" finalLine = "0 0 -1" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-2-selectable-data" dimensions="1 0.598058 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-2-selectable-atlas" containerField="voxels" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<MPRVolumeStyle class="anatomy-2-selectable-volume-z volume-z" isAnatomy="1.0" isEdges="1.0" originLine="0 0 1" finalLine = "0 0 -1" positionLine="0.25" lineColor="0 1 1" markerColor="0.545 0.271 0.075"></MPRVolumeStyle>' +
				'</VolumeData>';
	var vText = '<VolumeData class="anatomy-1-data" dimensions="2.4524 1.46667 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-1-atlas" containerField="voxels" url="res/anatomy/anatomy-1/anatomy-1_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<BoundaryEnhancementVolumeStyle class="anatomy-1-volume-full volume-full" isAnatomy="1.0"></BoundaryEnhancementVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-1-edges-data" dimensions="2.4524 1.46667 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-1-edges-atlas" containerField="voxels" url="res/anatomy/anatomy-1-edges/anatomy-1_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<BoundaryEnhancementVolumeStyle class="anatomy-1-edges-volume-full volume-full" isAnatomy="1.0"></BoundaryEnhancementVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-2-data" dimensions="2.4524 1.46667 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-2-atlas" containerField="voxels" url="res/anatomy/anatomy-2/anatomy-2_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<BoundaryEnhancementVolumeStyle class="anatomy-2-volume-full volume-full" isAnatomy="1.0"></BoundaryEnhancementVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-2-edges-data" dimensions="2.4524 1.46667 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-2-edges-atlas" containerField="voxels" url="res/anatomy/anatomy-2-edges/anatomy-2_2560.png" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<BoundaryEnhancementVolumeStyle class="anatomy-2-edges-volume-full volume-full" isAnatomy="1.0"></BoundaryEnhancementVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-1-selectable-data" dimensions="2.4524 1.46667 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-1-selectable-atlas" containerField="voxels" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<BoundaryEnhancementVolumeStyle class="anatomy-1-selectable-volume-full volume-full" isAnatomy="1.0" retainedOpacity="10.0"></BoundaryEnhancementVolumeStyle>' +
				'</VolumeData>' +
				'<VolumeData class="anatomy-2-selectable-data" dimensions="2.4524 1.46667 1" render="false">' +
					'<ImageTextureAtlas class="anatomy-2-selectable-atlas" containerField="voxels" numberOfSlices="100" slicesOverX="10" slicesOverY="10"></ImageTextureAtlas>' +
					'<BoundaryEnhancementVolumeStyle class="anatomy-2-selectable-volume-full volume-full" isAnatomy="1.0" retainedOpacity="10.0"></BoundaryEnhancementVolumeStyle>' +
				'</VolumeData>';
	
	$('.anatomy-x-container').append(xText);
	$('.anatomy-y-container').append(yText);
	$('.anatomy-z-container').append(zText);
	$('.anatomy-full-container').append(vText);
}

// Builds list of lines in one of the Lines menu tabs
function buildLineList(type, lines, names, published, pubmed, scanned, spubmed) {
	var listText = '';
	
	// Looping through each line
	$.each(lines, function(i, val) {
		var pubInfo = '';
		var pmedLink = '';
		
		// Displaying publication information if available, otherwise displaying scanned information
		// If neither are available, nothing is displayed
		if(published[i] != '') {
			pubInfo = published[i];
			pmedLink = pubmed[i];
		} else if(scanned[i] != '') {
			pubInfo = scanned[i];
			pmedLink = spubmed[i];
		}
		
		// Building list text for this line
		listText += 	'<div class="container-fluid lines-selection-container">' +
							// Checkbox input to turn line on/off
							'<input id="' + val + '-checkbox" class="float-left" type="checkbox" onchange="setRender(\'' + val + '\', this)" />' +
							// Name of line
							'<label class="settings-label float-left" for="' + val + '-checkbox">' + (names[i] == '' ? val : names[i]) + '</label>' +
							// Publication and pubmed link, if applicable
							'<p class="pub-info">' + (pmedLink == '' ? '' : '<a class="pub-info-link" href="https://www.ncbi.nlm.nih.gov/pubmed/' + pmedLink + '" target="_blank">') + pubInfo + (pmedLink == '' ? '' : '</a>') + '</p>' +
						'</div>';
	});
	
	$('#' + type + '-list').append(listText);
}

// Constructs information on page
// This function is called from ready.js when the page first loads
function constructPage() {
	// Building line lists for all 4 tabs
	buildLineList('transgenic', TRANSGENIC, TRANSGENIC_NAMES, TRANSGENIC_PUBLISHED, TRANSGENIC_PUBMED, TRANSGENIC_SCANNED, TRANSGENIC_SPUBMED);
	buildLineList('gal4', GAL4, GAL4_NAMES, GAL4_PUBLISHED, GAL4_PUBMED, GAL4_SCANNED, GAL4_SPUBMED);
	buildLineList('cre', CRE, CRE_NAMES, CRE_PUBLISHED, CRE_PUBMED, CRE_SCANNED, CRE_SPUBMED);
	buildLineList('misc', MISC, MISC_NAMES, MISC_PUBLISHED, MISC_PUBMED, MISC_SCANNED, MISC_SPUBMED);
	
	// Building anatomy volumes
	buildAnatomyVolumes();
	
	// Resetting anatomy and general line settings (names do not accurately reflect what they do, see resets.js)
	resetOverall();
	resetAdvanced();
}
