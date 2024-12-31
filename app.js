const express = require('express');
const app = express();
const port = 3000;

// allows the use of the files in public dir to be served up to the front end
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})