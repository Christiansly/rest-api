const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema(
    {
        title: {
            required: true,
            type: String
        },
        imageUrl: {
            required: true,
            type: String
        },
        content: {
            required: true,
            type: String
        },
        creator: {
            required: true,
            type: Object
        }
    }, {
        timestamps: true
    }
)

module.exports = mongoose.model('Post', postSchema)