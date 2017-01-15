(function(d3) {
    'use strict';

    var url = 'https://gist.githubusercontent.com/olehkazban/e9e3b919497561971e2db638036f6d07/raw/sample.json';

    var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2;

    var color;

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    var labelArc = d3.arc()
        .outerRadius(radius - 20)
        .innerRadius(radius - 20);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.value; });

    var svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var legendRectSize = 18;
    var legendSpacing = 4;

    function getColor() {
        color = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    }

    function getData(url) {
        d3.request(url)
            .mimeType('application/json')
            .response(function(xhr) {
                return JSON.parse(xhr.responseText);
            })
            .get(function(err, data) {
                if (err) {
                    throw err;
                }

                initChart(data);
            });

        // the same
        // d3.json(url, function(err, data) {
        //     if (err) {
        //         throw err;
        //     }

        //     initChart(data);
        // });
    }

    getData(url);

    function initChart(data) {
        getColor(data);

        var path = svg.selectAll('path')
            .data(pie(data))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return color(d.data.label);
            });

        var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color);

        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) {
                return d;
            });
    }

})(window.d3);