const express = require('express');
var router = express.Router();
const path = require('path');
const YoutubeMp3Downloader = require('youtube-mp3-downloader');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

router.post('/', (req, res) => {
  let queryPattern = /\?/;
  let { url } = req.body;

  const { socketid } = req.body;
  // let videoIds = [];
  let videoId = '';

  if (queryPattern.test(url)) {
    let splitUrlByEqual = url.split('=');
    let eIndex = splitUrlByEqual.length - 1;
    // videoIds.push(splitUrlByEqual[eIndex]);
    videoId = splitUrlByEqual[eIndex];
  } else {
    let splitUrlBySlash = url.split('/');
    let index = splitUrlBySlash.length - 1;
    // videoIds.push(splitUrlBySlash[index]);
    videoId = splitUrlBySlash[index];
  }

  // let result = false;
  // console.log('videoIds: ', videoIds);
  // const pattern = /^[a-zA-Z0-9-_]{11}$/;
  // for (let i in videoIds) {
  //   console.log('videoIds[i]:  ', videoIds[i]);
  //   result = pattern.test(videoIds[i]);
  //   if (result === true) {
  //     videoId = videoIds[i];
  //     break;
  //   }
  // }
  console.log('videoId: ', videoId);

  // if (result === true) {
  let YD = new YoutubeMp3Downloader({
    outputPath: path.join(__dirname, '..', 'public', 'static', 'mp3'),
    youtubeVideoQuality: 'highestaudio',
    queueParallelism: 2,
    progressTimeout: 2000,
    allowWebm: false,
  });

  YD.download(videoId);

  YD.on('finished', function (err, data) {
    console.log(JSON.stringify(data));
  });

  YD.on('error', function (error) {
    console.log(error);
  });

  YD.on('progress', function (progress) {
    // let stringifiedProgressData = JSON.stringify(progress);
    let downloadProgressData = Math.round(progress.progress.percentage);
    console.log("Progress:   ", downloadProgressData);
    global.io.to(socketid).emit('progress', downloadProgressData);
  });
  // }
});

module.exports = router;
