/*
 * This file manages the text search feature in the Search menu
 */

// The maximum number of characters on either side of the matching part of the search
const SIDE_CHARACTERS = 15;

// Hides spatial search panel and switches to text search panel
// This function's name is not indicative of exactly what it does
function startTextSearch() {
	$('#ss-show-btn').removeClass('active');
	$('#text-search-start-btn').addClass('active');
	$('#spatial-search-div').css('display', 'none');
	$('#text-search-div').css('display', 'block');
}

// Finds search matches of a given search string against a list of data
function findSearchMatches(list, type, cat, search) {
	// Empty array used to store results, including name of ID corresponding to result, location of result in info window, and formatted result for HTML appending
	var results = [[], [], []];
	
	if(search != '') { // Not performing search if search string is empty
		for(var i = 0; i < list.length; i++) { // Looping through all data in the list
			var str = list[i];
			var strLower = str.toLowerCase(); // Converting the data to lowercase just like the search string, as to ignore capitalization
			var index = strLower.indexOf(search); // Finding location of search string in data string
			
			if(index > -1) { // Case where search is found in the data text
				var name = '';
				var id = '';
				
				// Finding name and id of result's line
				if(type == 'transgenic') {
					name = TRANSGENIC_NAMES[i];
					id = TRANSGENIC[i];
				} else if(type == 'gal4') {
					name = GAL4_NAMES[i];
					id = GAL4[i];
				} else if(type == 'cre') {
					name = CRE_NAMES[i];
					id = CRE[i];
				} else if(type == 'misc') {
					name = MISC_NAMES[i];
					id = MISC[i];
				} else if(type == 'huc-cer') {
					name = HUC_CER_NAME[0];
					id = HUC_CER[0];
				}
				
				var loc = name + ' - ' + cat; // Location string
				var result = ''; // Used to store HTML code representing search result
				
				// Adding ellipsis to front of result string if more than SIDE_CHARACTERS characters exist before it
				if(index > SIDE_CHARACTERS) {
					result += '...';
				}
				
				result += str.substring(index - SIDE_CHARACTERS, index); // Adding characters before search string to result
				result += '<mark>'; // Adding mark tag to highlight search string in result
				result += str.substring(index, index + search.length); // Adding search string found in result
				result += '</mark>'; // Closing mark tag
				
				if(str.length > index + search.length) { // Checking if data string extends beyond search string in result
					if(str.length > index + SIDE_CHARACTERS) {
						// Adding SIDE_CHARACTERS characters to end of result with ellipsis if more than SIDE_CHARACTERS characters exist after the search string
						result += str.substring(index + search.length, index + search.length + SIDE_CHARACTERS);
						result += '...';
					} else {
						// Adding rest of string to result if less than SIDE_CHARACTERS characters are present after result string
						result += str.substring(index + search.length, str.length);
					}
				}
				
				// Adding result to results array
				results[0].push(loc);
				results[1].push(result);
				results[2].push(id);
			}
		}
	}
	
	return results;
}

// Constructs HTML code to present one an array of results data in the results table
function constructSearchResults(data) {
	var content = '';
	
	// Looping through all results in this array
	for(var i = 0; i < data[0].length; i++) {
		var loc = data[0][i]; // Categorical location of result in line info window (e.g. Published, Integration Site, ZFIN Feature, etc.)
		var result = data[1][i]; // Result string (already formatted with highlighting, text cropping, etc.)
		var id = data[2][i]; // Line ID associated with the result
		
		// HTML to be appended
		content += 	'<tr>' +
						'<td>' + '<input class="' + id + '-ss-checkbox float-left" type="checkbox" onchange="$(\'#' + id + '-checkbox\').trigger(\'click\');" ' + (includes(currRender, id) ? 'checked' : '') + ' /><label class="settings-label float-left ss-label" for="' + id + '-ss-checkbox">' + loc + '</label></td>' +
						'<td>' + result + '<button class="btn btn-xs btn-default text-search-info-btn" onclick="buildInfoWindow(\'' + id + '\')"></button></td>' +
					'</tr>';
	}
	
	return content;
}

// The main function for performing the text search
// This function is bound to the text search input field in ready.js
// Note: all data searched in this function is stored in ready.js
function searchInfo() {
	// Getting the searched string, converting to lowercase for case insensitivity
	var search = $('#text-search-text').val().toLowerCase();
	
	// Searching HuC-Cer info
	var hucName = findSearchMatches(HUC_CER_NAME, 'huc-cer', 'Line', search);
	var hucPub = findSearchMatches(HUC_CER_PUBLISHED, 'huc-cer', 'Published', search);
	var hucSite = findSearchMatches(HUC_CER_INTEGRATION_SITE, 'huc-cer', 'Integration Site', search);
	var hucZfin = findSearchMatches(HUC_CER_ZFIN_FEATURE, 'huc-cer', 'ZFIN Feature', search);
	var hucAnat = findSearchMatches(HUC_CER_ANATOMY, 'huc-cer', 'Anatomy', search);
	var hucScanned = findSearchMatches(HUC_CER_SCANNED, 'huc-cer', 'Scanned By', search);
	
	// Searching transgenic line info
	var transNames = findSearchMatches(TRANSGENIC_NAMES, 'transgenic', 'Line', search);
	var transPub = findSearchMatches(TRANSGENIC_PUBLISHED, 'transgenic', 'Published', search);
	var transSite = findSearchMatches(TRANSGENIC_INTEGRATION_SITE, 'transgenic', 'Integration Site', search);
	var transZfin = findSearchMatches(TRANSGENIC_ZFIN_FEATURE, 'transgenic', 'ZFIN Feature', search);
	var transAnat = findSearchMatches(TRANSGENIC_ANATOMY, 'transgenic', 'Anatomy', search);
	var transScanned = findSearchMatches(TRANSGENIC_SCANNED, 'transgenic', 'Scanned By', search);
	
	// Searching gal4 line info
	var gal4Names = findSearchMatches(GAL4_NAMES, 'gal4', 'Line', search);
	var gal4Pub = findSearchMatches(GAL4_PUBLISHED, 'gal4', 'Published', search);
	var gal4Site = findSearchMatches(GAL4_INTEGRATION_SITE, 'gal4', 'Integration Site', search);
	var gal4Zfin = findSearchMatches(GAL4_ZFIN_FEATURE, 'gal4', 'ZFIN Feature', search);
	var gal4Anat = findSearchMatches(GAL4_ANATOMY, 'gal4', 'Anatomy', search);
	var gal4Scanned = findSearchMatches(GAL4_SCANNED, 'gal4', 'Scanned By', search);
	
	// Searching cre line info
	var creNames = findSearchMatches(CRE_NAMES, 'cre', 'Line', search);
	var crePub = findSearchMatches(CRE_PUBLISHED, 'cre', 'Published', search);
	var creSite = findSearchMatches(CRE_INTEGRATION_SITE, 'cre', 'Integration Site', search);
	var creZfin = findSearchMatches(CRE_ZFIN_FEATURE, 'cre', 'ZFIN Feature', search);
	var creAnat = findSearchMatches(CRE_ANATOMY, 'cre', 'Anatomy', search);
	var creScanned = findSearchMatches(CRE_SCANNED, 'cre', 'Scanned By', search);
	
	// Searching misc line info
	var miscNames = findSearchMatches(MISC_NAMES, 'misc', 'Line', search);
	var miscPub = findSearchMatches(MISC_PUBLISHED, 'misc', 'Published', search);
	var miscSite = findSearchMatches(MISC_INTEGRATION_SITE, 'misc', 'Integration Site', search);
	var miscZfin = findSearchMatches(MISC_ZFIN_FEATURE, 'misc', 'ZFIN Feature', search);
	var miscAnat = findSearchMatches(MISC_ANATOMY, 'misc', 'Anatomy', search);
	var miscScanned = findSearchMatches(MISC_SCANNED, 'misc', 'Scanned By', search);
	
	// Contains the HTML code that will be appended to the results table
	var results = '';
	
	// Constructing HuC-Cer results
	results += constructSearchResults(hucName);
	results += constructSearchResults(hucPub);
	results += constructSearchResults(hucSite);
	results += constructSearchResults(hucZfin);
	results += constructSearchResults(hucAnat);
	results += constructSearchResults(hucScanned);
	
	// Constructing transgenic line results
	results += constructSearchResults(transNames);
	results += constructSearchResults(transPub);
	results += constructSearchResults(transSite);
	results += constructSearchResults(transZfin);
	results += constructSearchResults(transAnat);
	results += constructSearchResults(transScanned);
	
	// Constructing gal4 line results
	results += constructSearchResults(gal4Names);
	results += constructSearchResults(gal4Pub);
	results += constructSearchResults(gal4Site);
	results += constructSearchResults(gal4Zfin);
	results += constructSearchResults(gal4Anat);
	results += constructSearchResults(gal4Scanned);
	
	// Constructing cre line results
	results += constructSearchResults(creNames);
	results += constructSearchResults(crePub);
	results += constructSearchResults(creSite);
	results += constructSearchResults(creZfin);
	results += constructSearchResults(creAnat);
	results += constructSearchResults(creScanned);
	
	// Constructing misc line results
	results += constructSearchResults(miscNames);
	results += constructSearchResults(miscPub);
	results += constructSearchResults(miscSite);
	results += constructSearchResults(miscZfin);
	results += constructSearchResults(miscAnat);
	results += constructSearchResults(miscScanned);
	
	// Appending search results to results table
	$('#text-search-table-body').html(results);
}
