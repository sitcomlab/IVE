/**
 * Location
 * @type {Object}
 */
module.exports = {
    "properties": {
        "l_id": {
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
        }
    },
    "required": [
        "name"
    ]
};
