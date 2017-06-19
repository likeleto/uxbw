var pubDateCountChart;
var categoryCountChart;
var treemapChart
var typeCountChart;
var keywordsChart;
var itemsCount;
var itemsTable;

function getTops(source_group) {
    return {
        all: function() {
            return source_group.top(5);
        }
    };
}

function sel_stack(i) {
    return function(d) {
        console.log(d)
        return d.value[i] ? d.value[i].count : 0;
    };
}

var formatTime = function(input, formatOutput) {
    var dateFormat = d3.time.format(formatOutput);
    return dateFormat(input);
};

function processJson(data) {
    pubDateCountChart = dc.lineChart('#pubdate-count-chart');
    categoryCountChart = dc.rowChart('#category-count-chart');

    //
    domainCountChart = dc.rowChart('#domain-count-chart');
    //
    //
    //

    treemapChart = dc.treeMap('#treemap-chart');
    //barChart = dc.barChart('#bar-chart');

    keywordsChart = dc.rowChart('#keywords-count-chart');
    itemsCount = dc.dataCount('.dc-data-count');
    itemsTable = dc.dataGrid('.dc-data-grid');
    $('#content').show();

    var dateFormat = d3.time.format('%Y-%m-%dT%H:%M:%S');
    var numberFormat = d3.format('.2f');
    var topDir = 10;
    var totalWidth = 990;
    var height = 300;

    var maxYear = new Date().getFullYear();
    var minYear = maxYear;

    data.forEach(function(d) {

        d.pubDate = dateFormat.parse(d.pubDate);
        d.month = d3.time.month(d.pubDate);
        d.year = d3.time.year(d.pubDate);
        d.volume = 1;

    });
    /*var data2 = data.reduce(function(acc, topic) {
        for (var word in topic.w_keywords) {
            acc.push({
                category: topic.category,
                link: topic.link,
                month: topic.month,
                pubDate: topic.pubDate,
                title: topic.title,
                type: topic.type,
                volume: topic.volume,
                year: topic.year,
                w_keywords: topic.w_keywords[word],
                frequency: 1
            });
        }
        return acc;
    }, []);
*/
    var ratings = crossfilter(data);
    var all = ratings.groupAll();
    var yearlyDimension = ratings.dimension(function(d) {
        return d.year;
    });


    // Dimension by month
    var monthlyDimension = ratings.dimension(function(d) {
        return d.month;
    });

    var volumeByMonthGroup = monthlyDimension.group().reduce(
        function(p, v) {
            ++p.count;
            p.total += 1;
            return p;
        },
        function(p, v) {
            --p.count;
            p.total -= 1;
            return p;
        },
        function() {
            return {
                count: 0,
                total: 0
            };
        }
    );

    var pubDateDimension = ratings.dimension(function(d) {
        return d.pubDate;
    });

    var categoryDimension = ratings.dimension(function(d) {
        return d.category;
    });

    var domainDimension = ratings.dimension(function(d) {
        return d.domain;
    });

    var titleDimension = ratings.dimension(function(d) {
        return d.title;
    });

    var keywords = ratings.dimension(function(d) {
        return d.keywords;
    }, true);

    var keywordsGroup = keywords.group().reduceCount();
    //var keywordsGroup = keywords.groupAll().reduce(reduceAdd, reduceRemove, reduceInitial).value();
    var conceptsDimension = ratings.dimension(function(d) {
        return d.concepts;

    }, true);

    var companiesDimension = ratings.dimension(function(d) {
        return d.companies;
    }, true);
    var personsDimension = ratings.dimension(function(d) {
        return d.persons;
    }, true);
    var jobtitlesDimension = ratings.dimension(function(d) {
        return d.jobtitles;
    }, true);

    var domainGroup = domainDimension.group().reduceCount();




    var keywordsTreeGroup = keywords.group().reduceCount();

    var monthlyGroup = monthlyDimension.group().reduceCount();

    var yearlyGroup = yearlyDimension.group().reduceCount();

    var categoryGroup = categoryDimension.group().reduceCount();

    langCountChart = dc.rowChart('#lang-count-chart');

    var languageDimension = ratings.dimension(function(d) {
        return d.language;
    });

    var languageGroup = languageDimension.group().reduceCount();

    langCountChart
        .width($('sidebar-left').width())
        .height(60)
        .margins({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        })
        .colors("rgba(107,174,214,0.5)")
        .dimension(languageDimension)
        .group(languageGroup)
        .data(function(group) {
            return group.top(3);
        })
        //  .ordinalColors(d3.scale.category10().range())
        .title(function(d) {
            return d.value;
        })
        .elasticX(true)
        .xAxis().ticks(0).tickFormat(d3.format("d"));
    /*
        .height(200)
        .width($('sidebar-left').width())
        .dimension(languageDimension)
        .ordinalColors(d3.scale.category10().range())
        .renderLabel(true)
        .ordering(function(d) {
            return -d.key;
        })
        .group(languageGroup)
        .slicesCap(5)
        .innerRadius(50)
        .externalLabels(0)
        .minAngleForLabel(0)
        .externalRadiusPadding(20);*/
    //.drawPaths(true);
    //.legend(dc.legend());

    langCountChart.on('pretransition', function(chart) {
        chart.selectAll('.dc-legend-item text')
            .text('')
            .append('tspan')
            .text(function(d) {
                return d.name;
            })
            .append('tspan')
            .attr('x', 100)
            .attr('text-anchor', 'end')
            .text(function(d) {
                return d.data;
            });
    });
    categoryCountChart
        .width(($('sidebar-left').width()))
        .height(600)
        .margins({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        })
        .dimension(categoryDimension)
        .group(categoryGroup)
        .data(function(group) {
            return group.top(50);
        })
        //  .ordinalColors(d3.scale.category10().range())
        .colors("rgba(107,174,214,0.5)")
        .title(function(d) {
            return d.value;
        })
        .elasticX(true)
        .xAxis(0).ticks(0).tickFormat(d3.format("d"));

    authorsCountChart = dc.rowChart('#authors-count-chart');
    var authorsDimension = ratings.dimension(function(d) {
        return d.authors;

    }, true);
    var authorsGroup = authorsDimension.group().reduceCount();

    authorsCountChart
        .width($('sidebar-left').width())
        .height(400)
        .margins({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        })
        .dimension(authorsDimension)
        .group(authorsGroup)
        .data(function(group) {
            return group.top(20);
        })
        //  .ordinalColors(d3.scale.category10().range())
        .colors("rgba(107,174,214,0.5)")
        .title(function(d) {
            return d.value;
        })
        .elasticX(true)
        .xAxis().ticks(0).tickFormat(d3.format("d"));

    domainCountChart
        .width($('sidebar-left').width())
        .height(400)
        .margins({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        })
        .dimension(domainDimension)
        .group(domainGroup)
        .data(function(group) {
            return group.top(20);
        })
        //  .ordinalColors(d3.scale.category10().range())
        .title(function(d) {
            return d.value;
        })
        .elasticX(true)
        .colors("rgba(107,174,214,0.5)")
        .xAxis().ticks(0).tickFormat(d3.format("d"));

    typeCountChart = dc.rowChart('#type-count-chart');
    var typeDimension = ratings.dimension(function(d) {
        return d.type;
    });
    var typeGroup = typeDimension.group().reduceCount();
    typeCountChart
        .width($('sidebar-left').width())
        .height(160)
        .margins({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        })
        .colors("rgba(107,174,214,0.5)")
        .dimension(typeDimension)
        .group(typeGroup)
        .data(function(group) {
            return group.top(10);
        })
        //  .ordinalColors(d3.scale.category10().range())
        .title(function(d) {
            return d.value;
        })
        .elasticX(true)
        .xAxis().ticks(0).tickFormat(d3.format("d"));

    conceptsCountChart = dc.rowChart('#concepts-count-chart');

    var conceptsGroup = conceptsDimension.group().reduceCount();

    conceptsCountChart
        .width($('sidebar-left').width())
        .height(400)
        .margins({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        })
        .dimension(conceptsDimension)
        .group(conceptsGroup)
        .data(function(group) {
            return group.top(20);
        })
        //  .ordinalColors(d3.scale.category10().range())
        .title(function(d) {
            return d.value;
        })
        .elasticX(true)
        .colors("rgba(107,174,214,0.5)")
        .xAxis().ticks(0).tickFormat(d3.format("d"));
    companiesCountChart = dc.rowChart('#companies-count-chart');

    var companiesGroup = companiesDimension.group().reduceCount();

    companiesCountChart
        .width($('sidebar-left').width())
        .height(400)
        .margins({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        })
        .dimension(companiesDimension)
        .group(companiesGroup)
        .data(function(group) {
            return group.top(20);
        })
        //  .ordinalColors(d3.scale.category10().range())
        .title(function(d) {
            return d.value;
        })
        .elasticX(true)
        .colors("rgba(107,174,214,0.5)")

        .xAxis().ticks(0).tickFormat(d3.format("d"));
    personsCountChart = dc.rowChart('#persons-count-chart');

    var personsGroup = personsDimension.group().reduceCount();
    personsCountChart
        .width($('sidebar-left').width())
        .height(400)
        .margins({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        })
        .dimension(personsDimension)
        .group(personsGroup)
        .data(function(group) {
            return group.top(20);
        })
        //  .ordinalColors(d3.scale.category10().range())
        .title(function(d) {
            return d.value;
        })
        .elasticX(true)
        .colors("rgba(107,174,214,0.5)")

        .xAxis().ticks(0).tickFormat(d3.format("d"));
    jobtitlesCountChart = dc.rowChart('#jobtitles-count-chart');

    var jobtitlesGroup = jobtitlesDimension.group().reduceCount();
    jobtitlesCountChart
        .width($('sidebar-left').width())
        .height(400)
        .margins({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        })
        .dimension(jobtitlesDimension)
        .group(jobtitlesGroup)
        .data(function(group) {
            return group.top(20);
        })
        //  .ordinalColors(d3.scale.category10().range())
        .title(function(d) {
            return d.value;
        })
        .elasticX(true)
        .colors("rgba(107,174,214,0.5)")
        .xAxis().ticks(0).tickFormat(d3.format("d"));
    keywordsChart
        .width($('sidebar-left').width())
        .height(400)
        .margins({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        })
        .dimension(keywords)
        .group(keywordsGroup)
        .data(function(group) {
            return group.top(20);
        })
        .title(function(d) {
            return d.value;
        })
        .ordering(function(d) {
            return -d.value;
        })
        .elasticX(true)
        .colors("rgba(107,174,214,0.5)")

        .xAxis().ticks(0)
        .tickFormat(d3.format("d"));
    //.ordinalColors(d3.scale.category10().range())

    /*  .filterHandler(function(dimension, filter) {

          dimension.filter(function(d) {
              return keywordsChart.filter() != null ? d.indexOf(keywordsChart.filter()) >= 0 : true;
          });
          return filter;
      })*/
    //keywordsTree = ratings.dimension(function (d) { return [d.category, d.w_keywords]; }),
    //keywordsTreeGroup = keywordsTree.group().reduceSum(function (d) { return 1; });
    //debugger;
    var treeDimension = ratings.dimension(function(d) {
        return d.keywords;
    }, true);
    var treeGroup = treeDimension.group().reduceCount();
    treemapChart
        .dimension(treeDimension)
        .group(treeGroup)
        .data(function(group) {
            return group.top(60);
        })
        .ordering(function(d) {
            return -d.value;
        })
        .keyAccessor([
            function(d) {
                return d.key;
            }
        ])

        /*.filterHandler(function(dimension, filter) {
            dimension.filter(function(d) {
                return treemapChart.filter() != null ? d.indexOf(treemapChart.filter()) >= 0 : true;
            });
            return filter;
        })*/
        .renderLabel(true)
        .colorAccessor(treemapChart.valueAccessor());

    treemapChart.on("postRender", function(chart) {

        treemapChart.svg().selectAll("g.children rect")
            .on("click.sync", function(d) {
                keywordsChart.filter(d.key);
                keywordsChart.redraw();
                treemapChart.redraw();
                itemsCount.redraw();
                itemsTable.redraw();
                typeCountChart.redraw();
                langCountChart.redraw();
                categoryCountChart.redraw();
                authorsCountChart.redraw();
                domainCountChart.redraw();
                conceptsCountChart.redraw();
                companiesCountChart.redraw();
                personsCountChart.redraw();
                jobtitlesCountChart.redraw();
                pubDateCountChart.redraw();
                return false;
                //treemapChart.redraw();
            });
    });
    treemapChart.on("filtered", function(chart) {

        treemapChart.svg().selectAll("g.children rect")
            .on("click.sync", function(d) {
                keywordsChart.filter(d.key);
                keywordsChart.redraw();
                treemapChart.redraw();
                itemsCount.redraw();
                itemsTable.redraw();
                typeCountChart.redraw();
                langCountChart.redraw();
                categoryCountChart.redraw();
                authorsCountChart.redraw();
                domainCountChart.redraw();
                conceptsCountChart.redraw();
                companiesCountChart.redraw();
                personsCountChart.redraw();
                jobtitlesCountChart.redraw();
                pubDateCountChart.redraw();
                return false;
                //treemapChart.redraw();
            });
    });

    /*
        var addValueGroup = function(reducer, key) {
        	reducer
          	.value(key)
            .filter(function(d) { return d.w_keywords.indexOf(key) !== -1; })
            .count(true)
        }

        // Reductio nest to break down states by item
        var reducer = reductio().count(true)
        //addValueGroup(reducer, "time")
        //addValueGroup(reducer, "people")
        //addValueGroup(reducer, "UX")
        //addValueGroup(reducer, "app")
        keywordsGroup.top(20).forEach(function(field, i) {
          //debugger;
            addValueGroup(reducer, field.key)
        });
        reducer(categoryGroup);

        barChart.width(2200).height(600)
           .dimension(categoryDimension)
           .group(categoryGroup, 'time', sel_stack('time'))
           .renderHorizontalGridLines(true)
           //.renderLabel(true)
           .legend(dc.legend())
           .gap(0)
           .yAxisLabel("count")
           .x(d3.scale.ordinal())
           .elasticY(true)
           .xUnits(dc.units.ordinal);
           keywordsGroup.top(20).forEach(function(field, i) {
            // debugger;
               barChart.stack(categoryGroup, field.key, sel_stack(field.key));
           });
           */
           var chartheat = dc.heatMap("#test");

               runDim = ratings.dimension(function(d) { return [ d.digest,d.category]; }),
               runGroup = runDim.group().reduceSum(function(d) { return 1  ; });

           chartheat
             .width(45 * 20 + 80)
             .height(45 * 20 + 40)
             .dimension(runDim)
             .group(runGroup)
             .keyAccessor(function(d) { return d.key[0]; })
             .valueAccessor(function(d) { return d.key[1]; })
             .colorAccessor(function(d) { return d.value; })
             .title(function(d) {
                 return "Digest:   " + d.key[0] + "\n" +
                        "Category:  " + d.key[1] + "\n" +
                        "Count: " +  d.value;})
             .colors(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"])
             .calculateColorDomain();

           chartheat.render();

    itemsCount /* dc.dataCount('.dc-data-count', 'chartGroup'); */
        .dimension(ratings)
        .group(all)
        .html({
            some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'\'>Reset All</a>',
            all: 'All records selected. Please click on the graph to apply filters.'
        });

    itemsTable
        .dimension(pubDateDimension)
        .group(function(d) {
            return "";
        })
        .size(8000)
        .html(function(d) {
//<p class="mb-1">' + d.summary + '</p>
            return '<a href="'+d.link+'" target="blank" class="list-group-item list-group-item-action align-items-start "><div class="mb-1">' + d.title + '</div><br/><small>' + formatTime(d.pubDate, "%b-%Y")+ " " + d.type + '</small></a>';
        })
        .sortBy(function(d) {
            return d.pubDate;
        })
        .order(d3.descending);

    pubDateCountChart
        .dimension(monthlyDimension)
        .group(volumeByMonthGroup)
        .renderArea(true)
        .height(110)
        .x(d3.scale.linear().domain([minYear - 7, maxYear]))
        .filterPrinter(function(filters) {
            var filter = filters[0],
                s = '';
            s += numberFormat(filter[0]) + ' -> ' + numberFormat(filter[1]);
            return s;
        })
        .xUnits(d3.time.months)
        .x(d3.time.scale())
        .round(d3.time.month.round)
        .elasticY(true)
        .elasticX(true)
        .clipPadding(10);
    pubDateCountChart.yAxis().ticks(0).tickFormat(d3.format('.3s'));

    function calc_domain(chart) {
        var min = d3.min(pubDateCountChart.group().all(), function(kv) {
                return kv.key;
            }),
            max = d3.max(pubDateCountChart.group().all(), function(kv) {
                return kv.key;
            });
        max = d3.time.month.offset(max, 1);
        chart.x().domain([min, max]);
    }
    pubDateCountChart.on('preRender', calc_domain);
    pubDateCountChart.on('preRedraw', calc_domain);

    pubDateCountChart.valueAccessor(function(kv) {
        return kv.value.total;
    });

    dc.renderAll();

}

function readCsvFromFile(evt) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var f = evt.target.files[0];
        var reader = new FileReader();
        reader.onload = (function(theFile) {

            return function(e) {
                loadCsv(e.target.result);
            };
        })(f);
        reader.readAsDataURL(f);
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}

function titleCase(str) {
    var newstr = str.split(" ");
    for (i = 0; i < newstr.length; i++) {
        var copy = newstr[i].substring(1).toLowerCase();
        newstr[i] = newstr[i][0].toUpperCase() + copy;
    }
    newstr = newstr.join(" ");
    return newstr;
}

$('#csvFile').on('change', readCsvFromFile);
$('#csvFile').on('click', function() {
    $(this).val("")
});
