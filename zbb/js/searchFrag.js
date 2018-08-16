/*
 * This file is ONLY used by Web Workers when performing a spatial search, handled by a single worker
 * It reports volume occupancy information for all lines in a single binary fragment file
 * See spatialSearch.js for more information about the context and purpose of this file
 * See corresponding Python script for more about how the binary fragment files are generated and structured
 */

// This function determines the index of a boundary within the fragment
// The boundary will always be 0 or fragSize - 1 (the edge of the fragment) unless this fragment contains one of the edges of the volume selected in the spatial search
// See function below this one for usage
// 		bound indicates one of the overall boundaries of the spatial search volume
// 		fragNum indicates the index of this fragment along the given dimension
// 		fragSize indicates the size of one side of the fragment (should always be the same)
// 		defaultVal is the value the boundary should be if this fragment is entirely occupied by the spatial search volume (will either be 0 or fragSize - 1)
function boundaryInFrag(bound, fragNum, fragSize, defaultVal) {
	return (bound >= fragNum * fragSize && bound < (fragNum + 1) * fragSize ? bound % fragSize : defaultVal);
}

// Function called when web worker message is posted
// See the Web Workers API for more information about how Web Workers and message posting works https://www.w3schools.com/html/html5_webworkers.asp
addEventListener('message', function(evt) {
	// Extracting data passed to web worker when message was posted (data passed from spatialSearch.js)
	var data = evt.data;
	
	// All of the data in the binary fragment file, stored as unsigned byte array
	var stack = new Uint8Array(data[0]);
	
	// Location index of fragment (depth, height, and width position)
	var fragD = data[1];
	var fragH = data[2];
	var fragW = data[3];
	
	// Specifies location/size of the selected volume subset (minimum and maximum corner points)
	// These values will be the same for every fragment in the spatial search being conducted
	var minW = data[4];
	var maxW = data[5];
	var minH = data[6];
	var maxH = data[7];
	var minD = data[8];
	var maxD = data[9];
	
	// Constant values (should NEVER change until binary fragment data is regenerated)
	// These values are stored as const values in spatialSearch.js
	var lineCount = data[10]; // Number of lines being searched
	var fragSize = data[11]; // Length of one side of the cubic fragment
	var stackWidth = data[12]; // Width of entire stack, this should be the width of the downsampled binary tif data in pixels
	var stackHeight = data[13]; // Height of entire stack, this should be the height of the downsampled binary tif data in pixels
	var stackDepth = data[14]; // Depth of entire stack, this should be the depth of the downsampled binary tif data in pixels
	var sums = new Array(lineCount + 1).join('0').split('').map(parseFloat); // Creates an empty array of length "lineCount" where every value is 0, this will contain sums to determine volume occupancy within the analyzed fragment
	
	// Calculating the start and end indices for every dimension within the fragment
	// These will always start at 0 and end at fragSize - 1 unless the selected spatial search volume only occupies part of the fragment (along the edges of the selected volume)
	var startW = boundaryInFrag(minW, fragW, fragSize, 0);
	var endW = boundaryInFrag(maxW, fragW, fragSize, fragSize - 1);
	var startH = boundaryInFrag(minH, fragH, fragSize, 0);
	var endH = boundaryInFrag(maxH, fragH, fragSize, fragSize - 1);
	var startD = boundaryInFrag(minD, fragD, fragSize, 0);
	var endD = boundaryInFrag(maxD, fragD, fragSize, fragSize - 1);
	
	// Looping through every applicable bit in the fragment data
	for(var d = startD; d <= endD; d++) {
		for(var h = startH; h <= endH; h++) {
			for(var w = startW; w <= endW; w++) {
				for(var l = 0; l < lineCount; l++) { // Looping through all lines (see Python script for order in which lines are stored)
					var index = fragSize * fragSize * l + fragSize * d + h; // Calculating current bit's byte index
					var encodedByte = stack[index]; // Accessing byte value from stack data
					var occupiedCell = (encodedByte >>> w) & 1; // Extracting relevant bit from the encoded byte using logical right bitshift, resulting value will either be 1 or 0
					sums[l] += occupiedCell; // Adding bit's value to sum for this line (1 if line is present in this location, 0 if not)
				}
			}
		}
	}
	
	// Sending sums for this fragment back to spatialSearch.js
	// These sums will be divided from total volume size to calculate each lines volume occupancy
	postMessage(sums);
}, false);
