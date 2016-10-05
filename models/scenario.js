/**
 * Scenario
 * @type {Object}
 */
module.exports = {
    "properties": {
        "s_id": {
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
