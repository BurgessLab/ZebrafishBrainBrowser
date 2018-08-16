"""
    This file is used to generate all of the data arrays for data.js
    Note that it does not generate the data for HuC-Cer, whose changes should be made manually in data.js
    Only the line IDs in one of the lists below will be included in the data arrays, so be sure to add the line ID here after adding its information to defaults.csv
"""

import csv

IN_FILE = 'defaults.csv'  # Input csv file containing default values

# Add line IDs (lowercase) here after adding them to defaults.csv
TRANSGENIC = 	   ['ath5-gfp','bactin-gfp','brn3c-gfp','chata-gal4','chx10-gal4','cxcr4b-gal4','dat-gfp','dbh-gal4','dbx1a-gal4','dmbx1b-gal4','drd2a-gal4','eng1b-gal4','evx2-gal4','flk-gfp','foxb1a-gal4','gad1b-gal4',
                    'gad1b-gfp','gad1b-gfpor','galn-gal4','gata1-dsred','gfap-gfp','glyt2-gfp','gsx1-gfp','hcrt-rfp','hcrtr-gal4','huc-brain','huc-nls-mcar','isl1-gfp','isl2b-gfp','j1229-gfp','kctd15a-gfp',
                    'mnx1-gfp','neurod-gfp','neurog1-gfp','olig2-gfp','otpba-gal4','otx1b-gal4','oxtl-gfp','pet1-gfp','phox2b-gfp','ptf1a-gal4','qrfp-gfp','shox2-gal4','sox10-gfp','sst3-gal4','th-gal4','tph2-gal4',
                    'tuba-mcar','vglut-dsred','vmat2-gfp']
GAL4 = 	   ['s1156t-gal4','s1181t-gal4','y234-gal4','y236-gal4','y237-gal4','y240-gal4','y241-gal4','y242-gal4','y244-gal4','y245-gal4','y249-gal4','y252-gal4','y255-gal4','y256-gal4','y264-gal4','y265-gal4',
            'y269-gal4','y270-gal4','y271-gal4','y274-gal4','y275-gal4','y279-gal4','y293-gal4','y294-gal4','y295-gal4','y296-gal4','y297-gal4','y298-gal4','y299-gal4','y300-gal4','y301-gal4','y302-gal4',
            'y303-gal4','y304-gal4','y305-gal4','y306-gal4','y307-gal4','y308-gal4','y309-gal4','y310-gal4','y311-gal4','y312-gal4','y313-gal4','y314-gal4','y315-gal4','y316-gal4','y317-gal4','y318-gal4',
            'y319-gal4','y320-gal4','y321-gal4','y322-gal4','y323-gal4','y324-gal4','y325-gal4','y326-gal4','y327-gal4','y328-gal4','y329-gal4','y330-gal4','y331-gal4','y332-gal4','y333-gal4','y334-gal4',
            'y336-gal4','y337-gal4','y338-gal4','y339-gal4','y341-gal4','y342-gal4','y345-gal4','y347-gal4','y348-gal4','y350-gal4','y351-gal4','y352-gal4','y353-gal4','y354-gal4','y355-gal4','y356-gal4',
            'y357-gal4','y358-gal4','y359-gal4','y364-gal4','y365-gal4','y372-gal4','y373-gal4','y375-gal4','y387-gal4','y388-gal4','y393-gal4','y394-gal4','y396-gal4','y397-gal4','y401-gal4','y405-gal4',
            'y407-gal4','y412-gal4','y416-gal4','y417-gal4','y420-gal4','y421-gal4','y423-gal4','y425-gal4','y433-gal4','y436-gal4','y441-gal4','y444-gal4','y467-gal4','y468-gal4','y469-gal4','y470-gal4',
            'y471-gal4','y472-gal4','y473-gal4','y477-gal4','y511-gal4','y512-gal4','y514-gal4','y515-gal4','y532-gal4','y533-gal4','y564-gal4','y565-gal4','y566-gal4','y567-gal4','y575-gal4','y576-gal4',
            'zc1016c-gal4','zc1022b-gal4','zc1023b-gal4','zc1024a-gal4','zc1025b-gal4','zc1031a-gal4','zc1033a-gal4','zc1044a-gal4','zc1063b-gal4','zc1075a-gal4']
CRE =  ['y371-cre','y378-cre','y379-cre','y380-cre','y381-cre','y382-cre','y383-cre','y384-cre','y385-cre','y445-cre','y456-cre','y457-cre','y458-cre','y459-cre','y478-cre','y479-cre',
        'y480-cre','y481-cre','y483-cre','y484-cre','y485-cre','y486-cre','y487-cre','y488-cre','y489-cre','y490-cre','y492-cre','y493-cre','y494-cre','y495-cre','y519-cre','y520-cre',
        'y521-cre','y523-cre','y524-cre','y526-cre','y527-cre','y528-cre','y541-cre','y542-cre','y543-cre','y544-cre','y545-cre','y546-cre','y547-cre','y548-cre','y549-cre','y550-cre',
        'y551-cre','y552-cre','y553-cre','y554-cre','y555-cre','y556-cre','y557-cre','y558-cre','y559-cre','y568-cre','y569-cre','y570-cre','y571-cre','y574-cre']
MISC = 	   ['anti-5ht','anti-gad67','anti-gfap','anti-glyr','anti-hnk1','anti-syt2','anti-terk','anti-th','anti-zn1','anti-zrf2','huc-campari','huc-gcamp5g','huc-h2b-rfp','huc-lynrfp','huc-mcardinal','huc-nls-mcar1',
            'huc-syp-rfp','rspinal1','rspinal2','tph2-ntr-mch','ventricles','vglut-gfp-14x','y227-ntr-mch','y446-ntr-mch','y460-ntr-mch']

TRANSGENIC_LINE = [''] * len(TRANSGENIC)
GAL4_LINE = [''] * len(GAL4)
CRE_LINE = [''] * len(CRE)
MISC_LINE = [''] * len(MISC)

TRANSGENIC_BRIGHTNESS = [0] * len(TRANSGENIC)
GAL4_BRIGHTNESS = [0] * len(GAL4)
CRE_BRIGHTNESS = [0] * len(CRE)
MISC_BRIGHTNESS = [0] * len(MISC)

TRANSGENIC_CONTRAST = [1] * len(TRANSGENIC)
GAL4_CONTRAST = [1] * len(GAL4)
CRE_CONTRAST = [1] * len(CRE)
MISC_CONTRAST = [1] * len(MISC)

TRANSGENIC_THRESHOLD = [0] * len(TRANSGENIC)
GAL4_THRESHOLD = [0] * len(GAL4)
CRE_THRESHOLD = [0] * len(CRE)
MISC_THRESHOLD = [0] * len(MISC)

TRANSGENIC_PUBLISHED = [''] * len(TRANSGENIC)
GAL4_PUBLISHED = [''] * len(GAL4)
CRE_PUBLISHED = [''] * len(CRE)
MISC_PUBLISHED = [''] * len(MISC)

TRANSGENIC_PUBMED = [''] * len(TRANSGENIC)
GAL4_PUBMED = [''] * len(GAL4)
CRE_PUBMED = [''] * len(CRE)
MISC_PUBMED = [''] * len(MISC)

TRANSGENIC_INTEGRATION_SITE = [''] * len(TRANSGENIC)
GAL4_INTEGRATION_SITE = [''] * len(GAL4)
CRE_INTEGRATION_SITE = [''] * len(CRE)
MISC_INTEGRATION_SITE = [''] * len(MISC)

TRANSGENIC_ZFIN_FEATURE = [''] * len(TRANSGENIC)
GAL4_ZFIN_FEATURE = [''] * len(GAL4)
CRE_ZFIN_FEATURE = [''] * len(CRE)
MISC_ZFIN_FEATURE = [''] * len(MISC)

TRANSGENIC_ANATOMY = [''] * len(TRANSGENIC)
GAL4_ANATOMY = [''] * len(GAL4)
CRE_ANATOMY = [''] * len(CRE)
MISC_ANATOMY = [''] * len(MISC)

TRANSGENIC_SCANNED = [''] * len(TRANSGENIC)
GAL4_SCANNED = [''] * len(GAL4)
CRE_SCANNED = [''] * len(CRE)
MISC_SCANNED = [''] * len(MISC)

TRANSGENIC_SPUBMED = [''] * len(TRANSGENIC)
GAL4_SPUBMED = [''] * len(GAL4)
CRE_SPUBMED = [''] * len(CRE)
MISC_SPUBMED = [''] * len(MISC)

tsv = open(IN_FILE)
header = True
for line in csv.reader(tsv, dialect='excel-tab'):
    if header:
        header = False
    else:
        iden = line[0].lower()
        print line[0]
        pub = line[4].split(',')[0]
        med = line[4].split(',')[1].split(':')[1] if len(line[4].split(',')) > 1 else ''
        scanned = line[8].split(',')[0]
        smed = line[8].split(',')[1].split(':')[1] if len(line[8].split(',')) > 1 else ''
        if iden in TRANSGENIC:
            index = TRANSGENIC.index(iden)
            TRANSGENIC_LINE[index] = line[0]
            TRANSGENIC_BRIGHTNESS[index] = float(line[1]) / 255.0
            TRANSGENIC_CONTRAST[index] = float(line[2])
            TRANSGENIC_THRESHOLD[index] = float(line[3]) / 255.0
            TRANSGENIC_PUBLISHED[index] = pub
            TRANSGENIC_PUBMED[index] = med
            TRANSGENIC_INTEGRATION_SITE[index] = line[5]
            TRANSGENIC_ZFIN_FEATURE[index] = line[6]
            TRANSGENIC_ANATOMY[index] = line[7]
            TRANSGENIC_SCANNED[index] = scanned
            TRANSGENIC_SPUBMED[index] = smed
        elif iden in GAL4:
            index = GAL4.index(iden)
            GAL4_LINE[index] = line[0]
            GAL4_BRIGHTNESS[index] = float(line[1]) / 255.0
            GAL4_CONTRAST[index] = float(line[2])
            GAL4_THRESHOLD[index] = float(line[3]) / 255.0
            GAL4_PUBLISHED[index] = pub
            GAL4_PUBMED[index] = med
            GAL4_INTEGRATION_SITE[index] = line[5]
            GAL4_ZFIN_FEATURE[index] = line[6]
            GAL4_ANATOMY[index] = line[7]
            GAL4_SCANNED[index] = scanned
            GAL4_SPUBMED[index] = smed
        elif iden in CRE:
            index = CRE.index(iden)
            CRE_LINE[index] = line[0]
            CRE_BRIGHTNESS[index] = float(line[1]) / 255.0
            CRE_CONTRAST[index] = float(line[2])
            CRE_THRESHOLD[index] = float(line[3]) / 255.0
            CRE_PUBLISHED[index] = pub
            CRE_PUBMED[index] = med
            CRE_INTEGRATION_SITE[index] = line[5]
            CRE_ZFIN_FEATURE[index] = line[6]
            CRE_ANATOMY[index] = line[7]
            CRE_SCANNED[index] = scanned
            CRE_SPUBMED[index] = smed
        elif iden in MISC:
            index = MISC.index(iden)
            MISC_LINE[index] = line[0]
            MISC_BRIGHTNESS[index] = float(line[1]) / 255.0
            MISC_CONTRAST[index] = float(line[2])
            MISC_THRESHOLD[index] = float(line[3]) / 255.0
            MISC_PUBLISHED[index] = pub
            MISC_PUBMED[index] = med
            MISC_INTEGRATION_SITE[index] = line[5]
            MISC_ZFIN_FEATURE[index] = line[6]
            MISC_ANATOMY[index] = line[7]
            MISC_SCANNED[index] = scanned
            MISC_SPUBMED[index] = smed
        else:
            print 'Found a line not in any category...'

print 'Transgenic Names: ' + TRANSGENIC_LINE
print 'Gal4 Names: ' + GAL4_LINE
print 'Cre Names: ' + CRE_LINE
print 'Misc Names: ' + MISC_LINE
print
print 'Transgenic Brightnesses: ' + TRANSGENIC_BRIGHTNESS
print 'Gal4 Brightnesses: ' + GAL4_BRIGHTNESS
print 'Cre Brightnesses: ' + CRE_BRIGHTNESS
print 'Misc Brightnesses: ' + MISC_BRIGHTNESS
print
print 'Transgenic Contrasts: ' + TRANSGENIC_CONTRAST
print 'Gal4 Contrasts: ' + GAL4_CONTRAST
print 'Cre Contrasts: ' + CRE_CONTRAST
print 'Misc Contrasts: ' + MISC_CONTRAST
print
print 'Transgenic Thresholds: ' + TRANSGENIC_THRESHOLD
print 'Gal4 Thresholds: ' + GAL4_THRESHOLD
print 'Cre Thresholds: ' + CRE_THRESHOLD
print 'Misc Thresholds: ' + MISC_THRESHOLD
print
print 'Transgenic Published: ' + TRANSGENIC_PUBLISHED
print 'Gal4 Published: ' + GAL4_PUBLISHED
print 'Cre Published: ' + CRE_PUBLISHED
print 'Misc Published: ' + MISC_PUBLISHED
print
print 'Transgenic Pubmed: ' + TRANSGENIC_PUBMED
print 'Gal4 Pubmed: ' + GAL4_PUBMED
print 'Cre Pubmed: ' + CRE_PUBMED
print 'Misc Pubmed: ' + MISC_PUBMED
print
print 'Transgenic Integration Site: ' + TRANSGENIC_INTEGRATION_SITE
print 'Gal4 Integration Site: ' + GAL4_INTEGRATION_SITE
print 'Cre Integration Site: ' + CRE_INTEGRATION_SITE
print 'Misc Integration Site: ' + MISC_INTEGRATION_SITE
print
print 'Transgenic ZFIN Feature: ' + TRANSGENIC_ZFIN_FEATURE
print 'Gal4 ZFIN Feature: ' + GAL4_ZFIN_FEATURE
print 'Cre ZFIN Feature: ' + CRE_ZFIN_FEATURE
print 'Misc ZFIN Feature: ' + MISC_ZFIN_FEATURE
print
print 'Transgenic Anatomy: ' + TRANSGENIC_ANATOMY
print 'Gal4 Anatomy: ' + GAL4_ANATOMY
print 'Cre Anatomy: ' + CRE_ANATOMY
print 'Misc Anatomy: ' + MISC_ANATOMY
print
print 'Transgenic Scanned By: ' + TRANSGENIC_SCANNED
print 'Gal4 Scanned By: ' + GAL4_SCANNED
print 'Cre Scanned By: ' + CRE_SCANNED
print 'Misc Scanned By: ' + MISC_SCANNED
print
print 'Transgenic Scanned Pubmed: ' + TRANSGENIC_SPUBMED
print 'Gal4 Scanned Pubmed: ' + GAL4_SPUBMED
print 'Cre Scanned Pubmed: ' + CRE_SPUBMED
print 'Misc Scanned Pubmed: ' + MISC_SPUBMED
