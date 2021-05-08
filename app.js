const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const http = require("http");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const baseUrl = 'https://mesonetdetect.games';

var dataset = 0;
https.get(baseUrl + '/api/dataset-size/', (res) => {
  res.on('data', (data) => {
    const datasetJson = JSON.parse(data);
    dataset = datasetJson.size;
  })
})

app.get("/", function (req, res) {
  const qSize = req.query.size;
  if (qSize) {
    size = qSize;
  } else {
    size = 0;
  }

  url = baseUrl + "/api/available-models/";

  https.get(url, function (response) {
    response.on("data", function (data) {
      const models = JSON.parse(data);
      const modelLength = models.length;
      const modelName = [],
        id = [],
        desc = [],
        layers = [],
        layersLength = [],
        accuracy = [],
        clr = [],
        lossCurve = [];
      const clrCols = models[0].clr.columns;

      models.forEach( (model) => {
        layers.push(model.conv_layers);
        layersLength.push(model.conv_layers.length);
        modelName.push(model.model_name);
        id.push(model.model_id);
        desc.push(model.model_desc);
        accuracy.push(model.accuracy);
        clr.push(model.clr.rows);
        lossCurve.push(model.loss_curve);
      });

      res.render("index", {
        size: size,
        modelLength: modelLength,
        layers: layers,
        layersLength: layersLength,
        model: modelName,
        id: id,
        desc: desc,
        accuracy: accuracy,
        clr: clr,
        clrCols: clrCols,
        lossCurve: lossCurve,
        dataset: dataset,
      });
    });
  });
});

app.post("/", function (req, res) {
  images = req.body.images;
  modelId = req.body.models;
  let layers = req.body.layers;
  if (typeof layers === "undefined") {
    layers = "";
  } else if (layers.length > 1) {
    layers = layers.join("");
  }

  url = baseUrl + "/api/dataset-size/";

  https.get(url, (response) => {
    response.on("data", function (data) {
      const dataset = JSON.parse(data);
      const size = dataset.size;
      if (images > size) {
        var datasetSize = encodeURIComponent(size);
        res.redirect("/?size=" + datasetSize);
      } else {
        res.redirect("/predictions/" + images + "/" + modelId + "/" + layers);
      }
    });
  });
});

app.get("/predictions/:images/:modelId/:layers?", function (req, res) {
  images = req.params.images;
  modelId = req.params.modelId;
  layers = req.params.layers;
  let layersLen = 0;

  let url = baseUrl + "/api/predictions/" + modelId + "/" + images + "/";
  
  if (layers) {
    url = url + layers + "/";
    layersLen = layers.length;
  }

  https.get(url, (response) => {
    response.on("data", function (data) {
      const predictions = JSON.parse(data);
      const probability = [],
        imgUrl = [],
        real = [],
        predict = [],
        plots = [];

      predictions.forEach((pred) => {
        probability.push(pred.probability);
        real.push(pred.true_label);
        predict.push(pred.pred_label);
        imgUrl.push(pred.img_url);
        plots.push(pred.plots);
      });

      res.render("results", {
        images: images,
        prob: probability,
        baseUrl: baseUrl,
        url: imgUrl,
        real: real,
        pred: predict,
        plots: plots,
        layersLen: layersLen,
      });
    });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("listening on port 3000...");
});
