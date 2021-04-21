var layers = JSON.parse($("#layersData").text());
var layersLength = JSON.parse($("#layersLengthData").text());
var model = JSON.parse($("#modelData").text());
var accuracy = JSON.parse($("#accuracyData").text());
var id = JSON.parse($("#idData").text());
var desc = JSON.parse($("#descData").text());
var lossCurve = JSON.parse($("#lossData").text());
var clr = JSON.parse($("#clrData").text());
var clrCols = JSON.parse($("#clrColsData").text());
$(
  "#layersLengthData, #layersData, #modelData, #accuracyData, #lossData, #descData, #clrData, #clrColsData, #idData"
).remove();

$(document).ready(function () {
  $('input[type="radio"]').one("click", function () {
    var id = this.id;
    var index = id.slice(5);

    for (var i = 0; i < layersLength[index - 1]; ++i) {
      $("#checkboxes")
        .append(
          $(document.createElement("input")).prop({
            id: "myCheckBox",
            name: "layers",
            value: i,
            type: "checkbox",
            class: "form-check-input checkbox model" + index,
          })
        )
        .append(
          $(document.createElement("label"))
            .prop({
              for: "myCheckBox",
              class: "form-check-label checkbox model" + index,
            })
            .html(
              '<p class="options">Convolutional Layer ' +
                (i + 1) +
                " (" +
                layers[index - 1][i][0] +
                " filters of size " +
                layers[index - 1][i][1][0] +
                " x " +
                layers[index - 1][i][1][1] +
                ")<p/>"
            )
        )
        .append(
          $(document.createElement("br")).prop("class", "br model" + index)
        );
    }
  });
});

$(document).ready(function () {
  $('input[type="radio"]').one("click", function () {
    var id = this.id;
    var index = id.slice(5);
    $("div .sidenav")
      .find(".model" + index)
      .prop("id", "sidebar" + index);
    $(".model-name" + index).append("<span>" + model[index - 1] + "</span>");
    $(".model-desc" + index).append(
      '<p class="desc-text">' + desc[index - 1] + "</p>"
    );
    $(".model-img" + index).prop("src", lossCurve[index - 1]);

    row = clr[index - 1];
    for (var i = 0; i < row.length; ++i) {
      $("<tr />", { id: index + i, scope: "row", text: row[i][0] }).appendTo(
        "#tbody" + index
      );
      for (var r = 1; r < row[i].length; ++r) {
        $("<td />", {
          text: row[i][r],
        }).appendTo("#" + index + i);
      }
    }

    // row.forEach(function(r){
    //   $('#tbody' + index).append('<tr id='+ r[0] + '>'+ r[0] +'</tr>');
    //   console.log(r);
    //   r.forEach(function(x){
    //     $('#tbody' + index + ' tr').append('<td>'+ x +'</td>');
    //   });
    //   });

    $(".accuracy" + index).append(accuracy[index - 1] + "%");
  });
});

$(document).ready(function () {
  $('input[type="radio"]').change(function () {
    var id = this.id;
    var index = id.slice(5);
    $(".checkbox").not(id).hide();
    $(".sidebar").not(id).hide();
    $(".br").not(id).hide();
    $("." + id).show();
    $("#sidebar" + index).css("width", "27rem");
  });
});

function closeNav() {
  $(".sidebar").css("width", "0");
}
