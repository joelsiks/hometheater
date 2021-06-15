
![movie night](https://raw.githubusercontent.com/joelsiks/hometheater/main/client/src/movie-night.png)

# Hometheater

A simple client/server combination for serving a folder with media on a website.

## Installation & Running

Clone the repo and navigate to the `server` folder.

```
# First you need to download any dependencies
npm install

# Run this to start the webserver with the default port (2277)
npm run start

# Or with your own port
PORT=1337 npm run start
```

## Config

In `config.json` you may configure where your media is stored and where the subtitles may be located. 

Defining what port to run the server on goes in the following order:
environment variable `PORT` || config.json key `port` || 4321

# Client

A built version of the website client is provided, but you can/may rebuild it with any changes you desire.

In the `client` folder you can do the following:
```
# If you haven't already, you need to download any dependencies
npm install

# Run this to start the live development version on localhost:3000
npm run start

# Or this to build a deployment ready version in client/build (which will be used by the webserver)
npm run build
```

## Folder structure

The `media_directory` specified in the server must have the following structure:

- Only folders are allowed in the media directory
- In each folder there can be one or more media file(s). 

Here is an example of what the folder structure could look like.
```
├── Clips Summer 2019
│   ├── Me.and.The.Boys.mp4
│   └── Me.at.the.slip.n.slide.mp4
├── Rainbow Six Siege Clips
│   ├── Maestro.Worst.Aim.EU.mp4
│   └── 1v5ACE.OMG.mp4
└── CSGO Montage
    └── CSGO.Montage.mp4
```

The format/encoding of the media file is dependent on what your choice of browser supports. H.264/AVC along with AAC in a mp4 container is always a safe bet since most browsers don't support H.265/HEVC.

Too see what media formats/encodings are supported for your browser, check [this](https://en.wikipedia.org/wiki/HTML5_video#Browser_support) wikipedia article.

## Subtitles

Any subtitles must be placed in `[media_directory]/subtitles`. Any given file can only have one matching `.vtt` file in the subtitles folder.
This implies that you cannot have two files named the same in two different folders with both having a subtitle file.
