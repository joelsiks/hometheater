
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const path = require("path");
const fs = require("fs");

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

const config = require("./config.json");

if(config.media_path === undefined || config.subtitle_path === undefined) {
	console.log("Could not find json keys for 'media_path' and/or 'subtitle_path'");
	process.exit(1);
}

const media_path = config.media_path;
const subtitle_path = config.subtitle_path;
const static_path = "/_/";

const port = process.env.PORT || config.port || 4321;

let get_media_items = (_, res, next) => {
	fs.readdir(media_path, (err, media_folders) => {

		if(err) {
			res.sendStatus(500);
			return;
		}

		let items_obj = {
			items: []
		};

		media_folders.forEach(folder => {
			if(folder != "subtitles") {
				try {
					let media_content = fs.readdirSync(path.join(media_path, folder));

					let has_multiple_files = media_content.length > 1;

					items_obj.items.push({
						"type": (has_multiple_files ? "serie" : "movie"),
						"name": folder,
						"url": !has_multiple_files ? `${folder}/${media_content[0]}` : "",
					});
				} catch(error) {
					next(error);
				}
			}
		});

		res.locals.items = items_obj;
		next();
	});
};

let get_specific_media_item = (req, res, next) => {
	let media_item = req.params.item;
	fs.readdir(path.join(media_path, media_item), (err, media_content) => {

		if(err) {
			res.sendStatus(400);
			return;
		}

		let item_obj = {
			"name": media_item,
			"items": []
		}

		media_content.forEach(content => {
			item_obj.items.push({
				"name": content,
				"url": `${media_item}/${content}`
			});
		});

		res.locals.item = item_obj;
		next();
	});
};

app.use(static_path, express.static(media_path));
app.use("/", express.static(path.resolve("../client/build/")));

app.get("/metadata", (_, res) => {
	res.json({
		subtitle_path,
		static_path,
	});
});

app.get("/items", get_media_items, (_, res) => {
	res.json(res.locals.items);
});

app.get("/items/:item", get_specific_media_item, (_, res) => {
	res.json(res.locals.item);
});

app.get('*', (_, res) =>{
	res.sendFile(path.resolve("../client/build/index.html"));
});

app.use((error, _, res) => {
	res.json({
		message: error.message
	});
});

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});
