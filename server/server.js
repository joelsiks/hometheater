
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const path = require("path");
const fs = require("fs");
const naturalCompare = require("string-natural-compare");

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
const movies_folder = config.movies_folder;
const shows_folder = config.shows_folder;

const subtitle_path = config.subtitle_path;

const static_path = "/_/";

const port = process.env.PORT || config.port || 4321;

let get_media_items = (_, res, next) => {

    let items_obj = {
        items: []
    };

    let movie_folders = fs.readdirSync(path.join(media_path, movies_folder));

    movie_folders.forEach(folder => {
        try {
            let media_content = fs.readdirSync(path.join(media_path, movies_folder, folder));

            items_obj.items.push({
                "type": "movie",
                "name": folder,
                "url": `${movies_folder}/${folder}/${media_content[0]}`,
            });

        } catch(error) {
            next(error);
        }
    });

    let shows_folders = fs.readdirSync(path.join(media_path, shows_folder));

    shows_folders.forEach(folder => {
        try {
            let media_content = fs.readdirSync(path.join(media_path, shows_folder, folder));

            items_obj.items.push({
                "type": "show",
                "name": folder,
                "url": `${shows_folder}/${folder}/${media_content[0]}`,
            });

        } catch(error) {
            next(error);
        }
    });

    res.locals.items = items_obj;
    next();
};

let get_specific_media_item = (req, res, next) => {
    let media_item = req.params.item;
    fs.readdir(path.join(media_path, shows_folder, media_item), (err, media_content) => {

        if(err) {
            res.sendStatus(400);
            return;
        }

        // Natural sort for alphanumeric strings. Example:
        // ["m100.mp4", "m98.mp4", "m99.mp4"] -> ["m98.mp4", "m99.mp4", ""m100.mp4"]
        media_content.sort(naturalCompare);

        let item_obj = {
            "name": media_item,
            "items": []
        }

        media_content.forEach(content => {
            // Skip subtitle files.
            if(content.includes(".vtt")) {
                return;
            }

            item_obj.items.push({
                "name": content,
                "url": `${shows_folder}/${media_item}/${content}`
            });
        });

        res.locals.item = item_obj;
        next();
    });
};

express.static.mime.define({
    "video/mp4": ["mkv"]
});

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
