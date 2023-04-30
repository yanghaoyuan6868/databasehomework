var thisurl = "http://localhost:5000/"; //后端地址

// 初始化
window.onload = function () {
    loadl1();
}

// 左侧列表点击事件
function leftclick(e) {
    var id = $(e.target).attr("id");
    eval("load" + id + "()");
    $(".left_bottom_item.on").removeClass("on");
    $(e.target).addClass("on");
    $(".right_inner.nowselect").removeClass("nowselect");
    $("#r" + id.split("l")[1]).addClass("nowselect");
}

// 选择数据库
function dbon(e) {
    $(".db_button.on").removeClass("on");
    $(e.target).addClass("on");
    var table_list_area = $(e.target).parent().parent().next().children(".select");
    var id = table_list_area.attr("id").split("table_list")[1];
    table_list_area.empty();
    $(".tablearea").empty();
    $.ajax({
        url: thisurl + "getdb/dbon?db_name=" + $(e.target).text(),
        type: "GET",
        success: function (table_list) {
            var data = table_list.table_list;
            for (var i = 0; i < data.length; i++) {
                table_list_area.append("<div class='button table_button' onclick='tableon"+id+"(event)'>" + data[i][0] + "</div>");
            }
        }
    });
}

function insert(e) {
    var data = {};
    var table = $(e.target).parent().parent().parent().parent();
    var column_list = table.find(".inputs tr:nth-child(1) th input");
    var new_list = [];
    for (var i = 0; i < column_list.length; i++) {
        new_list[i] = column_list[i].value;
    }
    data.value_list = new_list;
    data.db_name = $(".db_button.on").text();
    data.table_name = $(".table_button.on").text();
    data = JSON.stringify(data);
    $.ajax({
        url: thisurl + "insert",
        type: "POST",
        data: data,
        success: function (data) {
            if(data.status=='error') {
                alert(data.error);
            } else {
                tableon2p();
            }
        }
    });
}

function find(e) {
    var data = {};
    var table = $(e.target).parent().parent().parent().parent();
    var column_list = table.find(".inputs tr:nth-child(1) th input");
    var new_list = [];
    for (var i = 0; i < column_list.length; i++) {
        new_list[i] = column_list[i].value;
    }
    data.value_list = new_list;
    data.db_name = $(".db_button.on").text();
    data.table_name = $(".table_button.on").text();
    data = JSON.stringify(data);
    $.ajax({
        url: thisurl + "find",
        type: "POST",
        data: data,
        success: function (data) {
            if(data.status=='error') {
                alert(data.error);
            } else {
                tableon3pp(data.table_content);
            }
        }
    });
}

function del(e) {
    var data = {};
    var tr = $(e.target).parent().parent()
    var value_list = tr.find("td");
    var new_list = [];
    for (var i = 0; i < value_list.length-1; i++) {
        new_list[i] = value_list[i].innerText;
    }
    data.value_list = new_list;
    data.db_name = $(".db_button.on").text();
    data.table_name = $(".table_button.on").text();
    data = JSON.stringify(data);
    $.ajax({
        url: thisurl + "delete",
        type: "POST",
        data: data,
        success: function (data) {
            if(data.status=='error') {
                alert(data.error);
            } else {
                tableon4p();
            }
        }
    });
}

function select(e) {
    $('.update').remove();
    var data = {};
    var tr = $(e.target).parent().parent()
    var value_list = tr.find("td");
    var new_list = [];
    for (var i = 0; i < value_list.length-1; i++) {
        new_list[i] = value_list[i].innerText;
    }
    data.value_list = new_list;
    data.db_name = $(".db_button.on").text();
    data.table_name = $(".table_button.on").text();
    data = JSON.stringify(data);
    $.ajax({
        url: thisurl + "getdb/tableon?db_name=" + $(".db_button.on").text() + "&table_name=" + $(".table_button.on").text(),
        type: "GET",
        success: function (data) {
            var column_list = data.column_list;
            var table = "<tr class='update'>";
            for (var i = 0; i < column_list.length; i++) {
                if (column_list[i][1] == "int") {
                    table += "<td><input type='number' value='"+new_list[i]+"' class='form-control' placeholder='"+ column_list[i][0] +"'></td>";
                } else {
                    table += "<td><input type='text' value='"+new_list[i]+"' class='form-control' placeholder='"+ column_list[i][0] +"'></td>";
                }
            }
            table += "<td><button onclick='update(event)' class='btn btn-primary'>更新</button></td></tr>";
            tr.after(table);
        }
    });
}

function update(e) {
    var data = {};
    var tr = $(e.target).parent().parent();
    var column_list = tr.find("td input");
    var new_list = [];
    for (var i = 0; i < column_list.length; i++) {
        new_list[i] = column_list[i].value;
    }
    data.value_list = new_list;
    var trp = tr.prev();
    var value_listp = trp.find("td");
    var new_listp = [];
    for (var i = 0; i < value_listp.length-1; i++) {
        new_listp[i] = value_listp[i].innerText;
    }
    data.value_listp = new_listp;
    data.db_name = $(".db_button.on").text();
    data.table_name = $(".table_button.on").text();
    data = JSON.stringify(data);
    $.ajax({
        url: thisurl + "update",
        type: "POST",
        data: data,
        success: function (data) {
            if(data.status=='error') {
                alert(data.error);
            } else {
                tableon5p();
            }
        }
    });
}

function tableon1(e) {
    $(".table_button.on").removeClass("on");
    $(e.target).addClass("on");
    $(".tablearea").empty();
    $.ajax({
        url: thisurl + "getdb/tableon?db_name=" + $(".db_button.on").text() + "&table_name=" + $(".table_button.on").text(),
        type: "GET",
        success: function (data) {
            var table_content = data.table_content;
            var column_list = data.column_list;
            var table = "<table class='table table-striped table-responsive'>";
            table += "<thead><tr>";
            for (var i = 0; i < column_list.length; i++) {
                table += "<th>" + column_list[i][0] + "</th>";
            }
            table += "</tr></thead><tbody>";
            for (var i = 0; i < table_content.length; i++) {
                table += "<tr>";
                for (var j = 0; j < table_content[i].length; j++) {
                    table += "<td>" + table_content[i][j] + "</td>";
                }
                table += "</tr>";
            }
            table += "</tbody></table>";
            $(".tablearea").append(table);
        }
    });
}

function tableon2(e) {
    $(".table_button.on").removeClass("on");
    $(e.target).addClass("on");
    tableon2p();
}

function tableon2p() {
    $(".tablearea").empty();
    $.ajax({
        url: thisurl + "getdb/tableon?db_name=" + $(".db_button.on").text() + "&table_name=" + $(".table_button.on").text(),
        type: "GET",
        success: function (data) {
            var table_content = data.table_content;
            var column_list = data.column_list;
            var table = "<table class='table table-striped table-responsive'><thead class='inputs'><tr>";
            for (var i = 0; i < column_list.length; i++) {
                if (column_list[i][1] == "int") {
                    table += "<th><input type='number' class='form-control' placeholder='"+ column_list[i][0] +"'></th>";
                } else {
                    table += "<th><input type='text' class='form-control' placeholder='"+ column_list[i][0] +"'></th>";
                }
            }
            table += "</tr><tr>";
            for (var i = 0; i < column_list.length-1; i++) {
                table += "<th></th>"
            }
            table += "<th><button onclick='insert(event)' class='btn btn-primary'>录入</button></th></tr></thead><thead><tr>";
            for (var i = 0; i < column_list.length; i++) {
                table += "<th>" + column_list[i][0] + "</th>";
            }
            table += "</tr></thead><tbody>";
            for (var i = 0; i < table_content.length; i++) {
                table += "<tr>";
                for (var j = 0; j < table_content[i].length; j++) {
                    table += "<td>" + table_content[i][j] + "</td>";
                }
                table += "</tr>";
            }
            table += "</tbody></table>";
            $(".tablearea").append(table);
        }
    });
}

function tableon3(e) {
    $(".table_button.on").removeClass("on");
    $(e.target).addClass("on");
    tableon3p();
}

function tableon3p() {
    $(".tablearea").empty();
    $.ajax({
        url: thisurl + "getdb/tableon?db_name=" + $(".db_button.on").text() + "&table_name=" + $(".table_button.on").text(),
        type: "GET",
        success: function (data) {
            var column_list = data.column_list;
            var table = "<table class='table table-striped table-responsive'><thead class='inputs'><tr>";
            for (var i = 0; i < column_list.length; i++) {
                if (column_list[i][1] == "int") {
                    table += "<th><input type='number' class='form-control' placeholder='"+ column_list[i][0] +"'></th>";
                } else {
                    table += "<th><input type='text' class='form-control' placeholder='"+ column_list[i][0] +"'></th>";
                }
            }
            table += "</tr><tr>";
            for (var i = 0; i < column_list.length-1; i++) {
                table += "<th></th>"
            }
            table += "<th><button onclick='find(event)' class='btn btn-primary'>查询</button></th></tr></thead><thead><tr>";
            for (var i = 0; i < column_list.length; i++) {
                table += "<th>" + column_list[i][0] + "</th>";
            }
            table += "</tr></thead></table>";
            $(".tablearea").append(table);
        }
    });
}

function tableon3pp(table_content) {
    $(".tbody3").remove();
    table = "<tbody class='tbody3'>";
    for (var i = 0; i < table_content.length; i++) {
        table += "<tr>";
        for (var j = 0; j < table_content[i].length; j++) {
            table += "<td>" + table_content[i][j] + "</td>";
        }
        table += "</tr>";
    }
    table += "</tbody>";
    $(".table").append(table);
}

function tableon4(e) {
    $(".table_button.on").removeClass("on");
    $(e.target).addClass("on");
    tableon4p();
}

function tableon4p() {
    $(".tablearea").empty();
    $.ajax({
        url: thisurl + "getdb/tableon?db_name=" + $(".db_button.on").text() + "&table_name=" + $(".table_button.on").text(),
        type: "GET",
        success: function (data) {
            var table_content = data.table_content;
            var column_list = data.column_list;
            var table = "<table class='table table-striped table-responsive'>";
            table += "<thead><tr>";
            for (var i = 0; i < column_list.length; i++) {
                table += "<th>" + column_list[i][0] + "</th>";
            }
            table += "</tr></thead><tbody>";
            for (var i = 0; i < table_content.length; i++) {
                table += "<tr>";
                for (var j = 0; j < table_content[i].length; j++) {
                    table += "<td>" + table_content[i][j] + "</td>";
                }
                table += "<td><button onclick='del(event)' class='btn btn-danger'>删除</button></td>";
                table += "</tr>";
            }
            table += "</tbody></table>";
            $(".tablearea").append(table);
        }
    });
}

function tableon5(e) {
    $(".table_button.on").removeClass("on");
    $(e.target).addClass("on");
    tableon5p();
}

function tableon5p() {
    $(".tablearea").empty();
    $.ajax({
        url: thisurl + "getdb/tableon?db_name=" + $(".db_button.on").text() + "&table_name=" + $(".table_button.on").text(),
        type: "GET",
        success: function (data) {
            var table_content = data.table_content;
            var column_list = data.column_list;
            var table = "<table class='table table-striped table-responsive'>";
            table += "<thead><tr>";
            for (var i = 0; i < column_list.length; i++) {
                table += "<th>" + column_list[i][0] + "</th>";
            }
            table += "</tr></thead><tbody>";
            for (var i = 0; i < table_content.length; i++) {
                table += "<tr>";
                for (var j = 0; j < table_content[i].length; j++) {
                    table += "<td>" + table_content[i][j] + "</td>";
                }
                table += "<td><button onclick='select(event)' class='btn btn-primary'>修改此项</button></td>";
                table += "</tr>";
            }
            table += "</tbody></table>";
            $(".tablearea").append(table);
        }
    });
}

// 初始化浏览数据页面
function loadl1() {
    $("#db_list1").empty();
    $("#table_list1").empty();
    $(".tablearea").empty();
    $.ajax({
        url: thisurl + "getdb",
        type: "GET",
        dataType: "json",
        success: function (db_list) {
            var data = db_list.db_list;
            for (let i = 0; i < data.length; i++) {
                $("#db_list1").append('<div class="button db_button" onclick="dbon(event)">' + data[i][0] + '</div>');
            }
        }
    });
}

function loadl2() {
    $("#db_list2").empty();
    $("#table_list2").empty();
    $(".tablearea").empty();
    $.ajax({
        url: thisurl + "getdb",
        type: "GET",
        dataType: "json",
        success: function (db_list) {
            var data = db_list.db_list;
            for (let i = 0; i < data.length; i++) {
                $("#db_list2").append('<div class="button db_button" onclick="dbon(event)">' + data[i][0] + '</div>');
            }
        }
    });
}

function loadl3() {
    $("#db_list3").empty();
    $("#table_list3").empty();
    $(".tablearea").empty();
    $.ajax({
        url: thisurl + "getdb",
        type: "GET",
        dataType: "json",
        success: function (db_list) {
            var data = db_list.db_list;
            for (let i = 0; i < data.length; i++) {
                $("#db_list3").append('<div class="button db_button" onclick="dbon(event)">' + data[i][0] + '</div>');
            }
        }
    });
}

function loadl4() {
    $("#db_list4").empty();
    $("#table_list4").empty();
    $(".tablearea").empty();
    $.ajax({
        url: thisurl + "getdb",
        type: "GET",
        dataType: "json",
        success: function (db_list) {
            var data = db_list.db_list;
            for (let i = 0; i < data.length; i++) {
                $("#db_list4").append('<div class="button db_button" onclick="dbon(event)">' + data[i][0] + '</div>');
            }
        }
    });
}

function loadl5() {
    $("#db_list5").empty();
    $("#table_list5").empty();
    $(".tablearea").empty();
    $.ajax({
        url: thisurl + "getdb",
        type: "GET",
        dataType: "json",
        success: function (db_list) {
            var data = db_list.db_list;
            for (let i = 0; i < data.length; i++) {
                $("#db_list5").append('<div class="button db_button" onclick="dbon(event)">' + data[i][0] + '</div>');
            }
        }
    });
}