
import React from 'react';
import Plyr from 'plyr';
import '../plyr.css';

class Watch extends React.Component {

	constructor(props) {
		super(props);

		let video_url = "";
		let video_name = "";
		let subtitle_url = "";

		const paths = window.location.pathname.split("/").splice(2);
		const folder = decodeURI(paths[0]);

		if(paths.length < 2) {
			this.props.history.push("/index/" + paths[1]);
		} else {
			const media = paths[2];

			video_url = folder + "/" + paths[1] + "/" + media;
            subtitle_url = video_url.replace(".mp4", ".vtt");
			video_name = paths[1];
		}

		const video_src = {
			src: `/_/${video_url}`,
			caption: `/_/${subtitle_url}`,
			type: "video/mp4",
		}


		let video_options = {
			title: video_name,
			captions: {
				active: true,
			},
			fullscreen: {
				enabled: true,
				fallback: false,
			},
			controls: [
				"play",
				"progress",
				"current-time",
				"mute",
				"volume",
				"settings",
				"captions",
				"fullscreen",
			]
		}

		this.state = {
			video_src: video_src,
			video_options: video_options,
		}

		// Update the title in case the client was not redirected from an index page.
		this.props.updateDocumentTitle(folder);
	}

	subtitleExists(subtitle_file) {
		fetch("/_/Subtitles/" + subtitle_file)
			.then(response => {
				return response === 200;
			}).catch(_ => {
				return false;
			}) 
	}

	componentDidMount() {
		const player = new Plyr("#plyr-player", this.state.video_options);

		// TODO: Double click with native plyr throws error. Might be fixed in later versions?
		document.getElementById("plyr-player").addEventListener("dblclick", _ => {
			player.fullscreen.toggle();
		})

		window.onkeyup = (e) => {
			e.preventDefault();
			switch (e.key) {
				// Rewind
				case "j":
					player.rewind();
					break;

				// Play/pause
				case "k":
					player.playing ? player.pause() : player.play();
					break;

				// Forward
				case "l":
					player.forward();
					break;

				// Mute toggle
				case "m":
					player.muted = !player.muted;
					break;

				// Fullscreen toogle
				case "f":
					player.fullscreen.toggle();
					break;

				case " ":
					player.togglePlay();
					break;
				default:
			}
		}
	}

	render() {
		return (
			<div>
				<video id="plyr-player" autoPlay controls>
					<source src={this.state.video_src.src}  type={this.state.video_src.type} />
					<track src={this.state.video_src.caption} kind="captions" srclang="en" label="English" default />
				</video>
			</div>
		);
	}
}

export default Watch;
