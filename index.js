const express = require('express');
const bodyParser = require('body-parser');
const MultiCropOpt_Version2 = require('./src/MultiCropOpt_Version2');
const Climate_data = require('./src/Climate_data');
const Crop_data =require('./src/Crop_data');

const app = express();
const port = 8001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/', (req, res) => {
  // console.log("index",MultiCropOpt_Version2(req.body.params));
  res.send(MultiCropOpt_Version2(req.body.params));
});

app.post('/FutureClimate', (req, res) => {
  // console.log(Climate_data());
  res.send(Climate_data());
});

app.post('/CropData', (req, res) => {
  // console.log(Crop_data());
  res.send(Crop_data());
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))





