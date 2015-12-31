function pdist(p, p1, p2) {
    if (p1[0] == p2[0]) {
        return Math.abs(p[0] - p1[0]);
    }

    var k = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    var m = p1[1] - k * p1[0];
    return Math.abs(k * p[0] - p[1] + m) / Math.sqrt(Math.pow(k, 2) + 1);
}

function rdp(points, epsilon) {
    if (epsilon <= 0) {
        return points;
    }

    if (points.length < 3) {
        return points;
    }

    var dmax = 0.0,
        index = -1,
        dist,
        r1,
        r2;
    for (i = 1; i < points.length - 1; i++) {
        dist = pdist(points[i], points[0], points[points.length - 1]);
        if (dist > dmax) {
            index = i;
            dmax = dist;
        }
    }
    if (dmax > epsilon) {
        r1 = rdp(points.slice(0, index + 1), epsilon);
        r2 = rdp(points.slice(index), epsilon);
        return r1.slice(0, r1.length - 1).concat(r2);
    } else {
        return [points[0], points[points.length - 1]];
    }
    return result;
}


$(function () {
    var points = {
        color: "#ba2762",
        label: "Original",
        data: [[44, 95], [26, 91], [22, 90], [21, 90],
        [19, 89], [17, 89], [15, 87], [15, 86], [16, 85],
        [20, 83], [26, 81], [28, 80], [30, 79], [32, 74],
        [32, 72], [33, 71], [34, 70], [38, 68], [43, 66],
        [49, 64], [52, 63], [52, 62], [53, 59], [54, 57],
        [56, 56], [57, 56], [58, 56], [59, 56], [60, 56],
        [61, 55], [61, 55], [63, 55], [64, 55], [65, 54],
        [67, 54], [68, 54], [76, 53], [82, 52], [84, 52],
        [87, 51], [91, 51], [93, 51], [95, 51], [98, 50],
        [105, 50], [113, 49], [120, 48], [127, 48], [131, 47],
        [134, 47], [137, 47], [139, 47], [140, 47], [142, 47],
        [145, 46], [148, 46], [152, 46], [154, 46], [155, 46],
        [159, 46], [160, 46], [165, 46], [168, 46], [169, 45],
        [171, 45], [173, 45], [176, 45], [182, 45], [190, 44],
        [204, 43], [204, 43], [207, 43], [215, 40], [215, 38],
        [215, 37], [200, 37], [195, 41]]
    }

    var options = {
        series: {
            lines: { show: true },
            points: { show: true },
        },
        xaxis: {
            min: 0,
            max: 240,
            show: false
        },
        yaxis: {
            min: 20,
            show: false
        },
        legend: {
            show: true
        }
    };

    function on_change(event, ui) {
        var epsilon = $("#slider").slider("option", "value");
        var points2 = { color: "#659e5f", label: "Simplified",
            data: rdp(points["data"], epsilon) };
        $.plot($("#placeholder"), [ points, points2 ], options);
        $("#c1").text(points["data"].length);
        $("#c2").text(points2["data"].length);
    }

    function on_slide(event, ui) {
        var epsilon = $("#slider").slider("option", "value");
        $("#epsilon").text(epsilon);
    }

    $("#slider").slider({ min: 0, max: 5, step: 0.1, change: on_change, slide: on_slide});
    $.plot($("#placeholder"), [ points ], options);
});
