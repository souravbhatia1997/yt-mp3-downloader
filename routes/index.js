const express = require('express');
const path = require("path");
const YoutubeMp3Downloader = require('youtube-mp3-downloader');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
var router = express.Router();

router.post('/', (req, res) => {
  let payloadData = req.body;
  console.log("payloadData:  ", payloadData);
  let url = payloadData.url;
  let splitedUrlArray = url.split("/");
  let index = splitedUrlArray.length - 1;
  let videoId = splitedUrlArray[index];
  console.log("videoId: ", videoId);

  let YD = new YoutubeMp3Downloader({
    outputPath: path.join(__dirname, "..", "public", "static", "mp3"),
    youtubeVideoQuality: 'highestaudio',
    queueParallelism: 2,
    progressTimeout: 2000,
    allowWebm: false
  });

  YD.download(videoId);

  YD.on('finished', function (err, data) {
    console.log(JSON.stringify(data));
  });

  YD.on('error', function (error) {
    console.log(error);
  });

  YD.on('progress', function (progress) {
    console.log(JSON.stringify(progress));
  });
});

module.exports = router;
