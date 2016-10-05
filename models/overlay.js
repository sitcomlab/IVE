/**
 * Overlay
 * @type {Object}
 */
module.exports = {
    "properties": {
        "o_id": {
            "type": [
                "null",
                "string"
            ]
        },
        "name": {
            "type": "string",
            "minLength": 1
        },
        "description": {
            "type": [
                "null",
                "string"
            ]
        },
        "url": {
            "type": "string",
            "minLength": 1
        },
        "category": {
            "type": "string",
            "enum": [
                "image",
                "video",
                "url"
            ]
        }
    },
    "required": [
        "name",
        "url",
        "category"
    ]
};
