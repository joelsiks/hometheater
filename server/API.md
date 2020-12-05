
## API

### Get all items in media directory

***Definition***
`GET /items`

***Response***
- `200 OK` on success

```json
{
	"items": [
		{
			"type": "movie",
			"name": "Ant-Man And The Wasp",
			"url": "Ant-Man And The Wasp/Ant-Man.And.The.Wasp.2018.1080p.mp4",
		},
		{
			"type": "serie",
			"name": "Attack on Titan",
			"url": "",
		},
		...
	]
}
```

### Get all items for specific item in media directory

***Definition***
`GET /items/:item`

***Response***
- `200 OK` on success
- `400 Bad Request` when `:item` is not a valid item in the media directory

```json
{
	"item": [
		{
			"name": "Shingeki No Kyojin",
			"items": [
				{
					"name": "SHINGEKI.NO.KYOJIN-S01E01.mp4",
					"url": "Shingeki No Kyojin/SHINGEKI.NO.KYOJIN-S01E01.mp4"
				},
				{
					"name": "SHINGEKI.NO.KYOJIN-S01E02.mp4",
					"url": "Shingeki No Kyojin/SHINGEKI.NO.KYOJIN-S01E02.mp4"
				},
				...
			]
		}
	]
}
```
