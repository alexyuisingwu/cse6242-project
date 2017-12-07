var gran = 20;
var barPad = 0.05;

var svg = d3.select("svg"),
    margin = {top: 30, right: 90, bottom: 50, left: 90},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0+margin.left/3)
.attr("x",0 -(height / 2))
.attr("dy", "1em")
.style("text-anchor", "middle")
.text("Percent of Scenes Displaying Emotion");

svg.append("text")
.attr("transform",
      "translate(" + (width/2 + margin.left) + " ," +
                     (height + margin.top + 35) + ")")
.style("text-anchor", "middle")
.text("Percent Through Movie By Scene");

svg.append("text")
.attr("class", "title")
.attr("transform",
      "translate(" + (width/2 + margin.left) + " ," +
                     20 + ")")
.style("text-anchor", "middle")
.text("Top Grossing - Avatar");


var z = d3.scaleOrdinal(["#e41a1c","#4daf4a","#984ea3","#ffff33","#377eb8","#ff7f00","white"]);

var ds0 = "grossing";
var ds1 = sentimentFolder + "Avatar.csv";
var ds2 = sentimentFolder + "Spider-Man.csv";
var ds3 = sentimentFolder + "Pirates-of-the-Caribbean.csv";
var ds4 = sentimentFolder + "Frozen.csv";
var ds5 = sentimentFolder + "Star-Wars-Revenge-of-the-Si.csv";
var ds6 = sentimentFolder + "Star-Wars-The-Force-Awakens.csv";
var ds7 = sentimentFolder + "Lord-of-the-Rings-Return-of-the-King.csv";
var ds8 = sentimentFolder + "Mission-Impossible.csv";
var ds9 = sentimentFolder + "Shrek-the-Third.csv";
var ds10 = "rated";
var ds11 = sentimentFolder + "Boyhood.csv";
var ds12 = sentimentFolder + "Lost-in-Translation.csv";
var ds13 = sentimentFolder + "12-Years-a-Slave.csv";
var ds14 = sentimentFolder + "Social-Network,-The.csv";
var ds15 = sentimentFolder + "Zero-Dark-Thirty.csv";
var ds16 = sentimentFolder + "Wall-E.csv";
var ds17 = sentimentFolder + "Sideways.csv";
var ds18 = sentimentFolder + "Amour.csv";
var ds19 = sentimentFolder + "Crouching-Tiger,-Hidden-Dragon.csv";
var ds20 = sentimentFolder + "Hudson-Hawk.csv";
var ds21 = sentimentFolder + "Catwoman.csv";


var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(barPad)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

    g.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(function(d) {return d + "%"; }));

    g.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(y).ticks(10, "%"));




var keys = ["anger","disgust","fear","joy","sadness","surprise","neutral"];

var legend = g.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
  .selectAll("g")
  .data(keys)
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
    .attr("x", width+ margin.left -19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", z)
     .style("stroke", "black");

legend.append("text")
    .attr("x", width + margin.left - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function(d) { return d; });


function readCSV(filename,callback){
  d3.csv(filename, function(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    //d.total = t;
    //remove
    d.scene = +d.scene
    return d;

  }, function(error, data) {
    if (error) throw error;

    //var keys = data.columns.slice(1);
    sceneMax = d3.max(data, function(d) { return d.scene; })
    for (var point in data){
        percentile = Math.ceil(gran*data[point].scene/sceneMax)*(100/gran);
        if(!o[percentile]){o[percentile] = {"p":percentile};};
        for (var prop in data[point]) {
            if (/anger|disgust|sadness|surprise|fear|joy|neutral/.test(prop) ) {
              if (o[percentile][prop]){
                o[percentile][prop] += data[point][prop];
              } else {o[percentile][prop] = data[point][prop]}
              //console.log(data[point][prop]);
            };
        }
    };
    callback(null);
  }
)

}

var div = d3.select("body").append("div")
    .attr("class", "tooltip")


function makeGraph(path, title){

  svg.selectAll(".title").text(title);

  q = d3.queue();

  percList ={};
  newData = [];
  o = {};

  path.forEach(function(d) {
    q.defer(readCSV, d);
  })

  q.awaitAll(function(error) {
    if (error) throw error;
    for (item in o){
      if(o[item].p){
        newData.push(o[item]);
      }
    }
    //console.log(o);

    for (bar in newData){
      t=0;
      for (val in newData[bar]) {
        t+=newData[bar][val];
      }
       t-= newData[bar].p;
      newData[bar].total = t;
      for (val in newData[bar]) {
        if(val != "p"){
          newData[bar][val] /= t ;
        }
      }

    }


    x.domain(newData.map(function(d) { return d.p; }));
    y.domain([0, d3.max(newData, function(d) { return  d.anger +d.sadness + d.surprise +d.joy+d.disgust+d.fear; })]).nice();
    z.domain(keys);

    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(newData))
      .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.p); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())
        //.style("stroke", "black")
        ;



      svg.selectAll(".yaxis")
      .call(d3.axisLeft(y).ticks(10, "%"));

      svg.selectAll(".xaxis")
      .call(d3.axisBottom(x).tickFormat(function(d) {return ""+d-(100/gran)+"-"+d + "%"; }));



  });


};

d3.select('#opts')
  .on('change', function() {

    title = this.options[this.selectedIndex].innerHTML;

    if(eval(d3.select(this).property('value')) == "grossing"){
      scripts = [ds1,ds2,ds3,ds4,ds5,ds6,ds7,ds8,ds9];
      makeGraph(scripts, title);
    }
    else if (eval(d3.select(this).property('value')) == "rated") {
      scripts = [ds11,ds12,ds13,ds14,ds15,ds16,ds17,ds18,ds19];
      makeGraph(scripts, title);
    }
    else {
      var newData = eval(d3.select(this).property('value'));
      makeGraph([newData], title);
    }

});


makeGraph([ds1], 'Top Grossing - Avatar');
