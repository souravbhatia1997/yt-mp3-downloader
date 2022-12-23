const express = require('express');
var router = express.Router();
const path = require('path');
const fs = require("fs");
const YoutubeMp3Downloader = require('youtube-mp3-downloader');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

router.post('/', (req, res) => {
  let queryPattern = /\?/;
  let { url } = req.body;

  const { socketid } = req.body;
  let videoId = '';

  if (queryPattern.test(url)) {
    let splitUrlByEqual = url.split('=');
    let eIndex = splitUrlByEqual.length - 1;
    videoId = splitUrlByEqual[eIndex];
  } else {
    let splitUrlBySlash = url.split('/');
    let index = splitUrlBySlash.length - 1;
    videoId = splitUrlBySlash[index];
  }
  console.log('videoId: ', videoId);

  let YD = new YoutubeMp3Downloader({
    outputPath: path.join(__dirname, '..', 'public', 'static', 'mp3'),
    // outputPath: path.join(__dirname, '..'),
    youtubeVideoQuality: 'highestaudio',
    queueParallelism: 2,
    progressTimeout: 2000,
    allowWebm: false,
  });

  YD.download(videoId);

  YD.on('finished', function (err, data) {
    console.log("finished:  ", data);
    // let encodedVideoTitle = encodeURI(data.videoTitle);
    // let base = path.join("public", "static", "mp3");
    // fs.rename(path.join(base, data.videoTitle) + ".mp3", path.join(base, encodedVideoTitle) + ".mp3", function(err) {
    //   if ( err ) console.log('ERROR: ' + err);
    // });
    // data.videoTitle = encodedVideoTitle;
    global.io.to(socketid).emit('progress', 100, data);
  });

  YD.on('error', function (error) {
    console.log(error);
  });

  YD.on('progress', function (progress) {
    // let stringifiedProgressData = JSON.stringify(progress);
    // console.log("progress body:  ", progress);
    let downloadProgressData = Math.round(progress.progress.percentage);
    console.log('Progress:   ', downloadProgressData);
    global.io.to(socketid).emit('progress', downloadProgressData);
  });
});

module.exports = router;
