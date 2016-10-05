/**
 * Video
 * @type {Object}
 */
module.exports = {
    "properties": {
        "v_id": {
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
        "recorded": {
            "type": [
                "null",
                "string"
            ]
        }
    },
    "required": [
        "name",
        "url"
    ]
};
