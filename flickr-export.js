#!/usr/bin/env node

var fs = require('fs');
// var uuidv1 = require('uuid');
var path = require('path');

var jsonDir = process.env.npm_package_config_jsonDir || 'flickrData';
var imgDir = process.env.npm_package_config_imgDir || 'flickrData';
var exportDir = process.env.npm_package_config_exportDir || 'flickrExport';
console.log('You json directory of Flickr export:' + jsonDir);
console.log('You data (Photos + Video) directory of Flickr export:' + imgDir);
console.log('You export directory:' + exportDir);

var albums;
// open and parse albums
var data = fs.readFileSync(path.format({dir: jsonDir, base: 'albums.json'}), 'utf8');
if (data) {
    albums = JSON.parse(data);
}

var filenames = fs.readdirSync(imgDir);
if (filenames) {
    filenames.forEach(function (file) {
        var fileExt = path.parse(file).ext;
        // exclude json files
        if (fileExt !== '.json' && fileExt !== '.zip') {
            console.log(file);
            var flickrId = getFlickrId(file);

            var jsonFile = path.format({
                dir: jsonDir,
                base: 'photo_' + flickrId + '.json'
            });
            // open and parse JSON file for the the current photo
            fs.readFile(jsonFile, 'utf8', function read(err, data) {
                if (err) {
                    console.dir(err);
                } else {
                    // console.log(data);
                    var flickrData = JSON.parse(data);

                    if (!fs.existsSync(exportDir)) {
                        fs.mkdirSync(exportDir);
                    }

                    var album = checkInAlbums(flickrId);
                    var exportPath;
                    if (album && album.title) { // create dir based on Flickr Album
                        exportPath = path.format({
                            dir: exportDir,
                            base: album.title
                        });
                    } else { // create dir based on Photo date_created
                        var dateTaken = new Date(flickrData.date_taken);
                        exportPath = path.format({
                            dir: exportDir,
                            base: dateTaken.getFullYear() + ('0' + (dateTaken.getMonth() + 1)).slice(-2) + ('0' + dateTaken.getDate()).slice(-2)
                        });
                    }

                    if (!fs.existsSync(exportPath)) {
                        fs.mkdirSync(exportPath);
                    }

                    var oldFile = path.format({
                        dir: imgDir,
                        base: file
                    });
                    var newFileName = cleanFileName(file, ['_' + flickrId + '_o', '_' + flickrId]); // flickrData.name.endsWith(fileExt) ? flickrData.name : flickrData.name + fileExt; // flickrData.name can be different !!
                    var newFile = path.format({
                        dir: exportPath,
                        base: newFileName
                    });
                    fs.copyFileSync(oldFile, newFile);

                    // create .ts folder
                    var tsFolder = path.format({
                        dir: exportPath,
                        base: '.ts'
                    });
                    if (!fs.existsSync(tsFolder)) {
                        fs.mkdirSync(tsFolder);
                    }


                    var tags = [];
                    //export Geo tag
                    if (flickrData.geo && flickrData.geo.latitude && flickrData.geo.longitude) {
                        var tag = {};
                        tag.id = uuidv1();
                        tag.type = 'sidecar';
                        tag.title = (flickrData.geo.latitude / 1000000) +
                            (flickrData.geo.longitude > 0 ? '+' : '') +
                            (flickrData.geo.longitude / 1000000);
                        tags.push(tag);
                    }

                    //export Tags
                    if (flickrData.tags) {
                        flickrData.tags.forEach(function (flickrTag) {
                            if (flickrTag) {
                                var tag = {};
                                tag.id = uuidv1();
                                tag.type = 'sidecar';
                                tag.title = flickrTag.tag;
                                tags.push(tag);
                            }
                        });
                    }

                    // write exported TS json
                    var tsObj = {};
                    tsObj.appName = process.env.npm_package_name;
                    tsObj.appVersionUpdated = process.env.npm_package_version;
                    var description = flickrData.description;
                    if (flickrData.comments) {
                        flickrData.comments.forEach(function (comment) {
                            description += "\n " + comment.user + ': ' + comment.comment;
                        });
                    }
                    tsObj.description = description;
                    tsObj.lastUpdated = new Date().toJSON();
                    tsObj.tags = tags;

                    var tsJson = path.format({
                        dir: tsFolder,
                        base: newFileName + '.json'
                    });

                    fs.writeFile(tsJson, JSON.stringify(tsObj), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        // console.log("The file was saved!");
                    });
                }
            });
        }
    });
}

function getFlickrId(file) {
    // var flickrData = {};
    if (file) {
        var filename = path.parse(file).name; //file.substring(0, file.lastIndexOf('.')) || file;
        var data = filename.split('_');
        for (var i = data.length - 1; i >= 0; --i) {
            if (data[i] === 'o') {
                // flickrData.original = '';
            }
            else if (/^\d+$/.test(data[i])) {
                // if(!flickrData.id) {
                // flickrData.id = data[i];
                return data[i];
                // break;
                // }
            }
        }
    }
    return undefined;
}

function checkInAlbums(flickrId) {
    if (albums && albums.albums) {
        for (var i = albums.albums.length - 1; i >= 0; --i) {
            var album = albums.albums[i];
            if (album.photos) {
                if (album.photos.indexOf(flickrId) !== -1) {
                    return album;
                }
            }
        }
    }
    return undefined;
}

function cleanFileName(filename, arrToRemove) {
    arrToRemove.forEach(function (toRemove) {
        filename = filename.replace(toRemove, '');
    });
    return filename;
}

function uuidv1() {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}
