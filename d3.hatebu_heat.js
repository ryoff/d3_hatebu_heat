(function() {
  d3.hatebu_heat = function() {
    var hatebu_heat = {},
        url = 'http://www.hatena.ne.jp/',
        svg_w = 800,
        svg_h = 500,
        svg_parent = '#svg';

    // option
    hatebu_heat.url = function(_) {
      if (!arguments.length) return url;
      url = _;
      return hatebu_heat;
    };
    hatebu_heat.svg_w= function(_) {
      if (!arguments.length) return svg_w;
      svg_w = _;
      return hatebu_heat;
    };
    hatebu_heat.svg_h= function(_) {
      if (!arguments.length) return svg_h;
      svg_h = _;
      return hatebu_heat;
    };
    hatebu_heat.svg_parent= function(_) {
      if (!arguments.length) return svg_parent;
      svg_parent = _;
      return hatebu_heat;
    };

    // setdata
    hatebu_heat.graph= function() {
      $.getJSON('http://b.hatena.ne.jp/entry/jsonlite/?url=' + encodeURIComponent(url) + '&callback=?', cb);
      return hatebu_heat;
    };

    function cb(json) {
      if (!json) return false;
      // jsonあれば
      var svg = d3.select(svg_parent)
                  .append('svg')
                  .attr('width', svg_w)
                  .attr('height', svg_h);
//      // first : 最初のbookmark
//      var first = json.bookmarks[0];
//      // last : 最後のbookmark
//      var last = json.bookmarks[json.bookmarks.length - 1];
//      // 棒の数
//      var rect_n = svg_w / 10;
      
      // x軸は、今からさかのぼって、30日間
      // y軸は、24時間とする

      var tm = {};
      // 今日から30日前のdtを取得
      var dt = new Date();
      dt.setTime(dt.getTime() - (1000 * 60 * 60 * 24 * 30)); // 1日sec * 30days
      console.log(dt);
      var day = 30,
          hour = 24,
          x = 0;
      var limit = day * hour;
      for (var i = 0; i < limit; i++) {
        tm[dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + '-' + dt.getHours()] = {
          x: x,
          y: dt.getHours(),
          cnt: 0,
          dt: new Date(dt.getTime()),
        };
        if (hour - 1 == dt.getHours()) x++;
        dt.setTime(dt.getTime() + (1000 * 60 * 60));
      }

      json.bookmarks.forEach(function(e, i, a){
        edt = new Date(e.timestamp);
        key = edt.getFullYear() + '-' + (edt.getMonth() + 1) + '-' + edt.getDate() + '-' + edt.getHours();
        if (tm[key]) tm[key].cnt++;
      });
      console.log(d3.values(tm));

      svg.selectAll('circle')
         .data(d3.values(tm))
         .enter()
         .append('circle')
         .attr({
           cx: function(d, i) { return d.x * 20 ; },
           cy: function(d, i) { return d.y * 20 ; },
           r: function(d, i) { return d.cnt / 5; },
           fill: "red"
         })
         .transition()
         .delay(function(d, i) {
           return i * 30;
         })
         .duration(1000)
         .ease("bounce");

    };



    // last
    return hatebu_heat;
  };
})();
