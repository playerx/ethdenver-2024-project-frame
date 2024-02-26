const express = require('express');

const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage } = require('canvas');

const validAuthTokens = process.env.AUTH_TOKENS?.split(',') ?? ['test_auth_token']

const app = express();

app.use((req, res, next) => {
    if (req.method === 'POST') {
        const authToken = req.headers['authorization']?.replace('bearer ', '')?.replace('Bearer ', '')

        if (!validAuthTokens.includes(authToken)) {
            res.writeHead(401, { 'Content-Type': 'text/html' });
            res.end('INVALID_AUTH_TOKEN')
            return
        }
    }

    return next()
})

app.use(express.json({ limit: '300mb' }));

app.get('/', (_, res) => {
    res.end('Welcome to GIF Builder. Please visit jok.io for more information.');
})

app.post('/', async (req, res) => {
    const width = req.body.width
    const height = req.body.height
    const images = req.body.images.map(x => Buffer.from(x, 'base64'))

    const buff = await generateGif(width, height, images)

    res.writeHead(200, { 'Content-Type': 'image/gif' });
    res.end(buff);
})

app.listen(3000, () => {
    console.log(`Server running at http://localhost:${3000}/`);
});


async function generateGif(width, height, inputImages) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const encoder = new GIFEncoder(width, height);
    const readStream = encoder.createReadStream() //.pipe(fs.createWriteStream('./result.gif'));
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(500);
    encoder.setQuality(10);

    const res = readableStreamToBuffer(readStream)

    await inputImages.forEach(async (f) => {
        const image = await loadImage(f);
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
        encoder.addFrame(ctx);
    });

    encoder.finish();

    // const buff = await encoder.out.getData();



    // return buff
    return res
}

function readableStreamToBuffer(readStream) {
    return new Promise((resolve, reject) => {
        const bufs = [];
        let buffer
        readStream.on('data', (d) => { bufs.push(d); });
        readStream.on('end', () => {
            buffer = Buffer.concat(bufs);
            resolve(buffer)
        })
        readStream.on('error', (err) => {
            reject(err)
        })
    })
}