const YoutubeMp3Downloader = require('youtube-mp3-downloader')
const ffmpeg = require('@ffmpeg-installer/ffmpeg')
const fs = require('fs')
const { isURL } = require('validator')
const config = require('./config.json')
// Configure YoutubeMp3Downloader with your settings
const YD = new YoutubeMp3Downloader({
	ffmpegPath: ffmpeg.path, // FFmpeg binary location
	outputPath: config.folderName, // Output file location (default: the home directory)
	youtubeVideoQuality: 'highestaudio', // Desired video quality (default: highestaudio)
	queueParallelism: 5, // Download parallelism (default: 1)
	progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
	allowWebm: false // Enable download from WebM sources (default: false)
})

// Download video and save as MP3 file

YD.on('finished', function (err, data) {
	const logObj = {
		videoId: data.videoId,
		videoName: data.videoTitle
	}
	if (err) {
		console.log('An Error Occurred')
	}
	console.log('Download complete', JSON.stringify(data))
	console.log('Download complete', JSON.stringify(logObj))
})

YD.on('error', function (error) {
	console.log(error)
})

YD.on('progress', function (progress) {
	const logObj = {
		videoId: progress.videoId,
		completePercentage: progress.progress.percentage.toPrecision(5),
		eta: progress.progress.eta
	}
	//console.log(JSON.stringify(logObj))
	console.log('progress',JSON.stringify(progress))
})
const fileName = config.textFileName

const fd = fs.readFileSync(fileName, 'utf-8')
let vidIds = fd.split(/\r?\n/)
vidIds = vidIds.map((vid) => {
	if (vid.startsWith('#') || vid.startsWith('//')) { return undefined }
	if (isURL(vid)) {
		const url = new URL(vid)
		const v = url.searchParams.get('v')
		return v
	} else {
		return vid
	}
	}).filter((vid) => {
		return vid
	})
console.log(JSON.stringify(vidIds))

vidIds.forEach((vid) => {
	YD.download(vid)
})
