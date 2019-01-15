# flickr-export-organizer
This script will organize the files exported from the Flickr service in folders, trying to extract tags and other meta data.

## Motivation
According to the recent announcement from Flickr, the free users will lose most of their photos in they don't want to update to a paid plan. Thankfully Flickr is providing a way to export all of your photos and videos together with some meta data including useful  things such as tags and albums. The purpose of this script is to  extracted that data and saved in format, which can be later recognized by our open source file  management software [TagSpaces](https://github.com/tagspaces/tagspaces). The script iterates thought all the media files in the export folder and copies the found files in folders. If file is part of album, a folder with the album's name is create and the file is copied there. If this is not the case the script create a folder, which name corresponds to the date when the image was taken, and copies it there.

## Flickr export process

- Export your photos from flicker, learn how to do it [here](https://www.macworld.com/article/3153944/photography/how-to-download-your-flickr-photo-library-and-transfer-it-to-google-photos-or-icloud-photo-library.html#toc-1)

## Prerequirements
You will need a running Node.js environment, which can be easily achieved on Windows, macOS or Linux by just installing Node.js from https://nodejs.org/en/download/

## Installation and running

- Extract all files from all exports in a folder called flickerData.

- Extract (unzip) Flickr data and copy all data Photos and JSON files (albums.json) in flickrData folder.

- Download flickr-export.js and place it next to the flickrData folder.

- Under Windows you can right click on flickr-export.js and choose Open With... (path to nodejs/node.exe)

- Alternatively you can run the script in a Windows, Linux or macOS terminal like this:
```
node flickr-export.js
```

## Resulting structure

The folder structure after successful running of the script will look like this:

    TBD


<!--
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
-->
