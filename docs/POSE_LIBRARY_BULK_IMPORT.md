# Pose Library Bulk Import

To bulk import poses, upload a CSV or JSON file with the following fields:

## Required Fields
- **id**: Unique identifier for the pose
- **slug**: URL-friendly version of the pose name
- **name_en**: English name of the pose
- **name_sanskrit**: Sanskrit name of the pose
- **family_id**: Pose family (Standing, Seated, Backbend, etc.)
- **intensity**: Difficulty level (1-5)

## Optional Fields
- **icon_url**: URL to pose icon image
- **image_url**: URL to full pose image
- **thumbnail_url**: URL to thumbnail image
- **relationships**: JSON object with related poses
- **meta**: JSON object with additional metadata (anatomy, benefits, etc.)

## Example CSV Format
```csv
id,slug,name_en,name_sanskrit,family_id,intensity,icon_url,image_url,thumbnail_url,relationships,meta
1,downward-dog,Downward Dog,Adho Mukha Svanasana,Standing,2,https://example.com/icon1.jpg,https://example.com/image1.jpg,https://example.com/thumb1.jpg,"{""transitions"":[""plank"",""child""]}","{""benefits"":[""stretches hamstrings"",""strengthens arms""]}"
```

## Example JSON Format
```json
[
  {
    "id": "1",
    "slug": "downward-dog",
    "name_en": "Downward Dog",
    "name_sanskrit": "Adho Mukha Svanasana",
    "family_id": "Standing",
    "intensity": 2,
    "icon_url": "https://example.com/icon1.jpg",
    "image_url": "https://example.com/image1.jpg",
    "thumbnail_url": "https://example.com/thumb1.jpg",
    "relationships": {
      "transitions": ["plank", "child"]
    },
    "meta": {
      "benefits": ["stretches hamstrings", "strengthens arms"]
    }
  }
]
```

## Import Process
1. Prepare your data in CSV or JSON format
2. Validate required fields are present
3. Use the admin bulk import interface
4. Review import preview before confirming
5. Monitor import progress and resolve any errors