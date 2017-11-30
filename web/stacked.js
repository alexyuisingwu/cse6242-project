//NEEDS A CSV WITH SCENES IN ORDER, scene as first column
function makeGraph(path){
  var svg = d3.select("svg"),
      margin = {top: 20, right: 20, bottom: 20, left: 40},
      width = svg.attr("width") - margin.left - margin.right,
      height = svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleLinear().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      z = d3.scaleOrdinal(["#e41a1c","#4daf4a","#984ea3","#ffff33","#377eb8","#ff7f00","white"]);

  var stack = d3.stack();
  var sceneMax = 1;
  var area = d3.area()
      .x(function(d, i) { return x((d.data.scene-1)/sceneMax); })
      .y0(function(d) { return y(d[0]); })
      .y1(function(d) { return y(d[1]); });

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(path, norm, function(error, data) {
      if (error) throw error;
      var keys = data.columns.slice(1);
      sceneMax = d3.extent(data, function(d) { return d.scene; })[1]- 1;
      x.domain([0,1]);
      z.domain(keys);
      stack.keys(keys);


      var layer = g.selectAll(".layer")
        .data(stack(data))
        .enter().append("g")
          .attr("class", "layer");

      layer.append("path")
          .attr("class", "area")
          .style("fill", function(d) { return z(d.key); })
          .attr("d", area);

      /*layer.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
        .append("text")
          .attr("x", width - 6)
          .attr("y", function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
          .attr("dy", ".35em")
          .style("font", "10px sans-serif")
          .style("text-anchor", "end")
          .text(function(d) { return d.key; });*/

      g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).ticks(10, "%"));

      g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y).ticks(10, "%"));
    });
}

function norm(d, i, columns) {
  sum = 0
  for (thing in d){
    if(thing!="scene"){
      sum += +d[thing];
    }
  }
  if (sum !== 0) {
      for (thing in d) {
        if(thing!="scene") {
            d[thing] = +d[thing]/sum;
        }
      }
  }
  d["scene"] = +d["scene"];
  return d;
}
//call makeGraph(csvfilepath) externally with whateever your formatted data values are
makeGraph("../film_sentiment_predictions/Boyhood.csv");