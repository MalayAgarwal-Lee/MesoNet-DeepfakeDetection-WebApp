const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const http = require("http");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  const qSize = req.query.size;
  if (qSize) {
    size = qSize;
  } else {
    size = 0;
  }

  url = "http://127.0.0.1:8000/api/available-models/";

  http.get(url, function (response) {
    response.on("data", function (data) {
      const models = JSON.parse(data);
      const modelLength = models.length;
      const modelName = [],
        id = [], desc = [],
        layers = [],
        layersLength = [],
        accuracy = [],
        clr = [],
        lossCurve = [];
        

      models.forEach(function (model) {
        const conv_layer = JSON.parse(model.conv_layers);
        layers.push(conv_layer);
        layersLength.push(conv_layer.length);
        modelName.push(model.model_name);
        id.push(model.model_id);
        desc.push(model.model_desc);
        accuracy.push(model.accuracy);
        clr.push(model.clr);
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
        lossCurve: lossCurve,
      });
    });
  });
});

app.post("/", function (req, res) {
  images = req.body.images;
  modelId = req.body.models;
  layers = req.body.layers.join("");
  url = "http://127.0.0.1:8000/api/dataset-size/";

  http.get(url, function (response) {
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

app.get("/predictions/:images/:modelId/:layers", function (req, res) {
  images = req.params.images;
  modelId = req.params.modelId;
  layers = req.params.layers;
  layersLen = layers.length;
  baseUrl = "http://127.0.0.1:8000";
  url =
    baseUrl + "/api/predictions/" + modelId + "/" + images + "/" + layers + "/";

  http.get(url, function (response) {
    response.on("data", function (data) {
      const predictions = JSON.parse(data);
      const imgs = Object.entries(predictions);

      const probability = [],
        imgUrl = [],
        real = [],
        pred = [],
        plots = [];

      for (var i = 0; i < images; ++i) {
        let imgObj = imgs[i][1];
        probability.push(imgObj.probability);
        imgUrl.push(imgObj.img_url);
        real.push(imgObj.true_label);
        pred.push(imgObj.pred_label);
        plots.push(imgObj.plots);
      }

      res.render("results", {
        prob: probability,
        baseUrl: baseUrl,
        url: imgUrl,
        real: real,
        pred: pred,
        plots: plots,
        layersLen: layersLen,
      });
    });
  });
});

app.listen(3000, function () {
  console.log("listening on port 3000...");
});
