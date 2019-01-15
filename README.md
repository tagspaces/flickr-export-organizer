# flickerexport
Organizing the files from the flickr export in folders by the date when they was taken or imported

## Steps for export process

- Export your photos from flicker, learn how to do it here:
- Extract all files from all exports in one folders
- Start the script

## Steps for the algorithm

The script will go through all *dddddddd_o.* files doing the following:
- load and parse the corresponding JSON file photo_dddddddd.json
- extract the date when the photos was taken from date_taken or date_imported if taken not available
- check if folder with the name of the date alreay exist, if not created it.  
- move the file in this folder
- create .ts folder in thos folder
- create .json file in the .ts folder containing:
  - extracted description
  - extracted comment in the description user -> comment \n
  - extracted tags
  - extracted geo tag if geo info available
  
  
## Installation

Extract (unzip) Flickr data and copy all data Photos and JSON files (albums.json) in flickrData folder.

Download flickr-export.js and place it next to the flickrData folder.

Download and install Node.js https://nodejs.org/en/#download

Right click on flickr-export.js and choose Open With... (/Program Files/node.exe)

Alternatively run in console: Windows cmd or Linux terminal
```
node flickr-export.js
```
 


