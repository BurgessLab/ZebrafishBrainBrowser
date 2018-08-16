"""
    This file generates binary fragment data required for the spatial search feature
    Be sure your input folder ONLY contains the binary tif data for all of the included lines, and the output folder is empty
    This script must be run to regenerate spatial search data whenever a new line is added to the Zebrafish Brain Browser
"""

from PIL import Image
import numpy as np
import os
import time
import math

start_time = time.time()
np.set_printoptions(threshold=np.nan)

# WARNING: Spatial search feature will not work properly if the lines lists below are not the same as the lines lists in data.js
# Lines in each list should also be in the SAME ORDER as those in data.js
TRANSGENIC = ['ath5-gfp','bactin-gfp','brn3c-gfp','chata-gal4','chx10-gal4','cxcr4b-gal4','dat-gfp','dbh-gal4','dbx1a-gal4','dmbx1b-gal4','drd2a-gal4','eng1b-gal4','evx2-gal4','flk-gfp','foxb1a-gal4','gad1b-gal4','gad1b-gfp','gad1b-gfpor','galn-gal4','gata1-dsred','gfap-gfp','glyt2-gfp','gsx1-gfp','hcrt-rfp','hcrtr-gal4','huc-brain','huc-nls-mcar','isl1-gfp','isl2b-gfp','j1229-gfp','kctd15a-gfp','mnx1-gfp','neurod-gfp','neurog1-gfp','olig2-gfp','otpba-gal4','otx1b-gal4','oxtl-gfp','pet1-gfp','phox2b-gfp','ptf1a-gal4','qrfp-gfp','shox2-gal4','sox10-gfp','sst3-gal4','th-gal4','tph2-gal4','tuba-mcar','vglut-dsred','vmat2-gfp'];
GAL4 = ['s1156t-gal4','s1181t-gal4','y234-gal4','y236-gal4','y237-gal4','y240-gal4','y241-gal4','y242-gal4','y244-gal4','y245-gal4','y249-gal4','y252-gal4','y255-gal4','y256-gal4','y264-gal4','y265-gal4','y269-gal4','y270-gal4','y271-gal4','y274-gal4','y275-gal4','y279-gal4','y293-gal4','y294-gal4','y295-gal4','y296-gal4','y297-gal4','y298-gal4','y299-gal4','y300-gal4','y301-gal4','y302-gal4','y303-gal4','y304-gal4','y305-gal4','y306-gal4','y307-gal4','y308-gal4','y309-gal4','y310-gal4','y311-gal4','y312-gal4','y313-gal4','y314-gal4','y315-gal4','y316-gal4','y317-gal4','y318-gal4','y319-gal4','y320-gal4','y321-gal4','y322-gal4','y323-gal4','y324-gal4','y325-gal4','y326-gal4','y327-gal4','y328-gal4','y329-gal4','y330-gal4','y331-gal4','y332-gal4','y333-gal4','y334-gal4','y336-gal4','y337-gal4','y338-gal4','y339-gal4','y341-gal4','y342-gal4','y345-gal4','y347-gal4','y348-gal4','y350-gal4','y351-gal4','y352-gal4','y353-gal4','y354-gal4','y355-gal4','y356-gal4','y357-gal4','y358-gal4','y359-gal4','y364-gal4','y365-gal4','y372-gal4','y373-gal4','y375-gal4','y387-gal4','y388-gal4','y393-gal4','y394-gal4','y396-gal4','y397-gal4','y401-gal4','y405-gal4','y407-gal4','y412-gal4','y416-gal4','y417-gal4','y420-gal4','y421-gal4','y423-gal4','y425-gal4','y433-gal4','y436-gal4','y441-gal4','y444-gal4','y467-gal4','y468-gal4','y469-gal4','y470-gal4','y471-gal4','y472-gal4','y473-gal4','y477-gal4','y511-gal4','y512-gal4','y514-gal4','y515-gal4','y532-gal4','y533-gal4','y564-gal4','y565-gal4','y566-gal4','y567-gal4','y575-gal4','y576-gal4','zc1016c-gal4','zc1022b-gal4','zc1023b-gal4','zc1024a-gal4','zc1025b-gal4','zc1031a-gal4','zc1033a-gal4','zc1044a-gal4','zc1063b-gal4','zc1075a-gal4'];
CRE = ['y371-cre','y378-cre','y379-cre','y380-cre','y381-cre','y382-cre','y383-cre','y384-cre','y385-cre','y445-cre','y456-cre','y457-cre','y458-cre','y459-cre','y478-cre','y479-cre','y480-cre','y481-cre','y483-cre','y484-cre','y485-cre','y486-cre','y487-cre','y488-cre','y489-cre','y490-cre','y492-cre','y493-cre','y494-cre','y495-cre','y519-cre','y520-cre','y521-cre','y523-cre','y524-cre','y526-cre','y527-cre','y528-cre','y541-cre','y542-cre','y543-cre','y544-cre','y545-cre','y546-cre','y547-cre','y548-cre','y549-cre','y550-cre','y551-cre','y552-cre','y553-cre','y554-cre','y555-cre','y556-cre','y557-cre','y558-cre','y559-cre','y568-cre','y569-cre','y570-cre','y571-cre','y574-cre'];
MISC = ['anti-5ht','anti-gad67','anti-gfap','anti-glyr','anti-hnk1','anti-syt2','anti-terk','anti-th','anti-zn1','anti-zrf2','huc-campari','huc-gcamp5g','huc-h2b-rfp','huc-lynrfp','huc-mcardinal','huc-nls-mcar1','huc-syp-rfp','rspinal1','rspinal2','tph2-ntr-mch','ventricles','vglut-gfp-14x','y227-ntr-mch','y446-ntr-mch','y460-ntr-mch'];

# Dimensions of binary tif stacks (downsampled 4x)
TIF_WIDTH = 257
TIF_HEIGHT = 154
TIF_DEPTH = 105

# Side length of each fragment (DO NOT CHANGE)
FRAG_SIZE = 8

# Binary tif input folder and fragment binaries output folder, edit these where necessary
IN_FOLDER = 'zbb-bitmaps/'
OUT_FOLDER = 'spatialSearchBinaries/'

files = os.listdir(IN_FOLDER)
file_count = len(files)
transgenic_parts = []
gal4_parts = []
cre_parts = []
misc_parts = []
huc_name = []
for f in files:
    name = f.lower().split('.')[0]
    if name in TRANSGENIC:
        transgenic_parts.append(f)
    elif name in GAL4:
        gal4_parts.append(f)
    elif name in CRE:
        cre_parts.append(f)
    elif name in MISC:
        misc_parts.append(f)
    elif name == 'huc-cer':
        huc_name.append(f)
    else:
        print 'Unexpected file name "%s"' % f

stack_names = huc_name + transgenic_parts + gal4_parts + cre_parts + misc_parts
stacks = np.zeros((file_count, TIF_DEPTH, TIF_HEIGHT, TIF_WIDTH), np.uint8)
index = 1
for name in stack_names:
    print 'Loading stack %s/%s' % (index, file_count)
    img = Image.open(IN_FOLDER + name)
    for f in range(TIF_DEPTH):
        img.seek(f)
        stacks[index - 1][f] = np.array(img)
    index += 1

depth_index = 0
num_frags_depth = math.ceil(TIF_DEPTH / float(FRAG_SIZE))
num_frags_height = math.ceil(TIF_HEIGHT / float(FRAG_SIZE))
num_frags_width = math.ceil(TIF_WIDTH / float(FRAG_SIZE))
while depth_index < num_frags_depth:
    height_index = 0
    while height_index < num_frags_height:
        width_index = 0
        while width_index < num_frags_width:
            print 'Creating binaries for file %s-%s-%s' % (width_index, height_index, depth_index)
            data = []
            for s in range(len(stacks)):
                for d in range(FRAG_SIZE):
                    for h in range(FRAG_SIZE):
                        compressed_byte = 0
                        for w in range(FRAG_SIZE):
                            this_d = depth_index * FRAG_SIZE + d
                            this_h = height_index * FRAG_SIZE + h
                            this_w = width_index * FRAG_SIZE + w

                            if this_d < TIF_DEPTH and this_h < TIF_HEIGHT and this_w < TIF_WIDTH:
                                stack_data = stacks[s][this_d][this_h][this_w]
                            else:
                                stack_data = 0

                            if stack_data != 0:
                                compressed_byte = compressed_byte | (1 << w)
                        if compressed_byte != 0:
                            print 'Appending non-zero byte %s' % compressed_byte
                        data.append(compressed_byte)

            byte_arr = bytearray(data)
            fil = open(OUT_FOLDER + ('frag-%s-%s-%s.bin' % (width_index, height_index, depth_index)), 'wb')
            fil.write(byte_arr)
            fil.close()

            width_index += 1
        height_index += 1
    depth_index += 1

end_time = time.time()
print 'Program executed in %s seconds' % (end_time - start_time)
