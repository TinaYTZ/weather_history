
var express=require('express'),
    app = express(),
    server= require('http').createServer(app);
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('./public/'));

server.listen(process.env.PORT ||8080);
console.log('server running...');


exports.helloworld= function (req,res){
  res.send('helloworld');

}
// The project ID to use, e.g. "your-project-id"
const projectId = "weather-past2weeks";
// Imports the Google Cloud client library
const BigQuery = require('@google-cloud/bigquery');

// The project ID to use, e.g. "your-project-id"
// const projectId = "your-project-id";

// The SQL query to run
const sqlQuery = `SELECT
  date,
  MAX(prcp) AS prcp,
  MAX(tmin) AS tmin,
  MAX(tmax) AS tmax
FROM (
  SELECT
    STRING(wx.date) AS date,
    IF (wx.element = 'PRCP', wx.value/10, NULL) AS prcp,
    IF (wx.element = 'TMIN', wx.value/10, NULL) AS tmin,
    IF (wx.element = 'TMAX', wx.value/10, NULL) AS tmax
  FROM
    [bigquery-public-data:ghcn_d.ghcnd_2017] AS wx
  WHERE
    id = 'USW00094846'
    AND DATEDIFF(CURRENT_DATE(), date) < 15 
    )
GROUP BY
  date
ORDER BY
  date ASC`;

// Instantiates a client
const bigquery = BigQuery({
  projectId: projectId
});

// Query options list: https://cloud.google.com/bigquery/docs/reference/v2/jobs/query
const options = {
  query: sqlQuery,
  useLegacySql: true // Use standard SQL syntax for queries.
};

// Runs the query
bigquery
  .query(options)
  .then((results) => {
    const rows = results[0];
    res.send(rows);
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });

