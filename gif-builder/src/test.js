
const fs = require('fs');

const imgList = fs.readdirSync('./images/');
const files = imgList.map(f => fs.readFileSync(`./images/${f}`))

const serializedImages = files.map(x => x.toString('base64'))

// const url = 'https://gif-builder.jok.io'
const url = 'http://localhost:3000'

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test_auth_token'
    },
    body: JSON.stringify({
        width: 1200,
        height: 630,
        images: serializedImages,
    })
}).then(async res => {
    if (res.status === 200) {
        const buff = await res.arrayBuffer()
        fs.appendFileSync('./result.gif', Buffer.from(buff))
    }
    else {
        const result = await res.text()
        throw new Error(result)
    }
})
