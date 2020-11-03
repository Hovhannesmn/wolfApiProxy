const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.listen(4000, function () {});

//Classes to import for wolfram api
const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI('2EKERY-L3LHKX35R2');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/v1/wolfram-api-chunk-data', function (req, res) {
  console.log(req.body.expression, 'expression');
  let expression = req.body.expression;

  if (!expression) {
    res.send('<html><body><h1>There was an error please refresh.</h1></body></html>');
  } else {
    waApi.getFull(expression).then((queryresult) => {
      const pods = queryresult.pods;
      console.log(queryresult, "qsdsadds");
      console.log(pods, "pods");

      const output = pods.map((pod) => {
        const subpodContent = pod.subpods.map(subpod =>
          `<img src="${subpod.img.src}" alt="${subpod.img.alt}">`
        ).join('\n');
        return `<h2>${pod.title}</h2>\n${subpodContent}`;
      }).join('\n');

      res.send(output);
    }).catch(console.error);
  }
});
