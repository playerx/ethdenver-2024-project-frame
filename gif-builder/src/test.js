
const fs = require('fs');

const imgList = fs.readdirSync('./images/');
const files = imgList.map(f => fs.readFileSync(`./images/${f}`))

const serializedImages = files.map(x => x.toString('base64'))

fetch('http://localhost:3000', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        width: 1200,
        height: 630,
        images: serializedImages,
    })
}).then(async res => {
    const buff = await res.arrayBuffer()
    fs.appendFileSync('./result.gif', Buffer.from(buff))
})
