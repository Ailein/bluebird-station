

/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 *
 */
function bubbleChart() {
  // Processed Data
  var pdata;
  var keywordArr = [];
  var colorArr = [];

  // Constants for sizing
  var width = 940;
  var height = 600;

  // tooltip for mouseover functionality
  //var tooltip = floatingTooltip('gates_tooltip', 240);

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = { x: width / 2, y: height / 2 };

  var keyWordCenters = {};

  // X locations of the year titles.
  var keyWordsTitleX = {};

  // Used when setting up force and
  // moving around nodes
  var damper = 0.102;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var nodes = [];

  // Charge function that is called for each node.
  // Charge is proportional to the diameter of the
  // circle (which is stored in the radius attribute
  // of the circle's associated data.
  // This is done to allow for accurate collision
  // detection with nodes of different sizes.
  // Charge is negative because we want nodes to repel.
  // Dividing by 8 scales down the charge to be
  // appropriate for the visualization dimensions.
  function charge(d) {
    return -Math.pow(d.radius, 2.0) / 8;
  }

  // Here we create a force layout and
  // configure it to use the charge function
  // from above. This also sets some contants
  // to specify how the force layout should behave.
  // More configuration is done below.
  var force = d3.layout.force()
    .size([width, height])
    .charge(charge)
    .gravity(-0.01)
    .friction(0.9);


  // Nice looking colors - no reason to buck the trend
  var fillColor = d3.scale.ordinal()
    .domain(keywordArr)
    .range(colorArr);

  // Sizes bubbles based on their area instead of raw radius
  var radiusScale = d3.scale.pow()
    .exponent(0.5)
    .range([2, 85]);

  /*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization values to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */
  function createNodes(rawData) {
    // Use map to convert each keywords data into usable node data
    var myNodes = [];
    for(var i=0; i<rawData.keywords.length; i++) {
      myNodes[i] = rawData.keywords[i].words.map(function(d) {
        console.log(i);
        return {
          id: rawData.keywords[i].keyText + '-' + d.text,
          value: d.occ,
          keyword: rawData.keywords[i].keyText,
          x: Math.random() * 900,
          y: Math.random() * 800
        };
      });
    };

    // Combine the data into one Array
    var nodes = [];
    for(var i=0; i<myNodes.length; i++) {
      nodes = nodes.concat(myNodes[i]);
    }

    console.log(nodes);

    // sort them to prevent occlusion of smaller nodes.
    nodes.sort(function (a, b) { return b.value - a.value; });

    pdata = nodes;

    return nodes;
  }

  function createKeywordArray(rawData) {
    var arr = [];
    for(var i=0; i<rawData.keywords.length; i++) {
      arr.push(rawData.keywords[i].keyText);
    }
    return arr;
  }

  function createColorArray(rawData) {
    var arr = [];
    for(var i=0; i<rawData.keywords.length; i++) {
      arr.push(rawData.keywords[i].color);
    }
    return arr;
  }

  function createKeywordCenters(rawData) {
    var length = rawData.keywords.length;
    var centers = {};
    for(var i=0; i<length; i++) {
      centers[rawData.keywords[i].keyText] = { x: (width / (length+1)) * (i+1), y: height / 2};
    }
    return centers;
  }

  function createKeywordTitleX(rawData) {
    var length = rawData.keywords.length;
    var titleX = {};
    for(var i=0; i<length; i++) {
      titleX[rawData.keywords[i].keyText] = (width / (length+1)) * (i+1);
    }
    return titleX;
  }

  function setWH(selector) {
    width = $(selector).width();
    height = $(selector).height();
    center = { x: width / 2, y: height / 2 };
  }


  /*
   * Main entry point to the bubble chart. This function is returned
   * by the parent closure. It prepares the rawData for visualization
   * and adds an svg element to the provided selector and starts the
   * visualization creation process.
   *
   * selector is expected to be a DOM element or CSS selector that
   * points to the parent element of the bubble chart. Inside this
   * element, the code will add the SVG continer for the visualization.
   *
   * rawData is expected to be an array of data objects as provided by
   * a d3 loading function like d3.csv.
   */
  var chart = function chart(selector, rawData) {
    console.log(rawData);

    setWH(selector);

    nodes = createNodes(rawData);

    // Use the max total_amount in the data as the max in the scale's domain
    // note we have to ensure the total_amount is a number by converting it
    // with `+`.
    var maxAmount = d3.max(nodes, function (d) { return +d.value; });
    radiusScale.domain([0, maxAmount]);

    // Set radius of each element
    for(var i=0; i<nodes.length; i++) {
      nodes[i].radius = radiusScale(nodes[i].value);
    }

    // Set node attribute arrays
    keywordArr = createKeywordArray(rawData);
    colorArr = createColorArray(rawData);
    keyWordCenters = createKeywordCenters(rawData);
    keyWordsTitleX = createKeywordTitleX(rawData);

    fillColor = d3.scale.ordinal()
    .domain(keywordArr)
    .range(colorArr);

    // Set the force's nodes to our newly created nodes array.
    force.nodes(nodes);

    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) { return fillColor(d.keyword); })
      .attr('stroke', function (d) { return d3.rgb(fillColor(d.keyword)).darker(); })
      .attr('stroke-width', 2);
/*      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);*/

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    // Set initial layout to single group.
    groupBubbles();
  };

// Single Group Mode
  function groupBubbles() {
    hideKeyWords();

    force.on('tick', function (e) {
      bubbles.each(moveToCenter(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  }

  function moveToCenter(alpha) {
    return function (d) {
      d.x = d.x + (center.x - d.x) * damper * alpha;
      d.y = d.y + (center.y - d.y) * damper * alpha;
    };
  }

// Split By Keyword Mode
  function splitBubbles() {
    showKeyWords();

    force.on('tick', function (e) {
      bubbles.each(moveToKeywords(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  }

  function moveToKeywords(alpha) {
    return function (d) {
      var target = keyWordCenters[d.keyword];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  function hideKeyWords() {
    svg.selectAll('.keyword').remove();
  }

  function showKeyWords() {
    var keywordsData = d3.keys(keyWordsTitleX);
    var keywords = svg.selectAll('.keyword')
      .data(keywordsData);
    keywords.enter().append('text')
      .attr('class', 'keyword')
      .attr('x', function (d) { return keyWordsTitleX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black');

    var content = '<span class="name">Title: </span><span class="value">' +
                  d.name +
                  '</span><br/>' +
                  '<span class="name">Amount: </span><span class="value">$' +
                  addCommas(d.value) +
                  '</span><br/>' +
                  '<span class="name">Year: </span><span class="value">' +
                  d.year +
                  '</span>';
    tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('stroke', d3.rgb(fillColor(d.group)).darker());

    tooltip.hideTooltip();
  }

  /*
   * Externally accessible function (this is attached to the
   * returned chart function). Allows the visualization to toggle
   * between "single group" and "split by year" modes.
   *
   * displayName is expected to be a string and either 'year' or 'all'.
   */
  chart.toggleDisplay = function (displayName) {
    if (displayName === 'split') {
      splitBubbles();
    } else {
      groupBubbles();
    }
  };


  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

var myBubbleChart = bubbleChart();

/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
function display(error, data) {
  if (error) {
    console.log(error);
  }
  console.log('called');
  myBubbleChart('#vis', data);
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
/*function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });
}*/

/*
 * Helper function to convert a number into a string
 * and add commas to it to improve presentation.
 */
function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

/*d3.json("http://localhost:3000/api/datasets/5759d626ee5b02b419ea27c0", function(error, data) {
    console.log(data);
    display(error, data);
});*/

/*// setup the buttons.
setupButtons();*/
