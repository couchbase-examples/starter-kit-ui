
function setAction(form, url) {
    fetch(
        url, {headers: {"Content-Type": "application/json"}, method: "GET"})
        .then(response => response.json())
        .then((json) => {
            constructTable(json.data, document.getElementById("myoutput"));
            constructRows(json.context, document.getElementById("narrative"));
            codeLink(json.code, document.getElementById("code"));
        });
    return false;
}

function constructTable(list, selector) {
    $(selector).html("");
    if (list != null && list.length > 0) {
        var cols = Headers(list, selector);
        for (var i = 0; i < list.length; i++) {
            var clr = i % 2 == 0 ? "#F8B878" : "#EFA898";
            var row = $('<tr style="background-color:' + clr + '"/>');
            for (var colIndex = 0; colIndex < cols.length; colIndex++) {
                row.append($('<td/>').html(val = list[i][cols[colIndex]]));
            }
            $(selector).append(row);
        }
    } else {
        $(selector).append("no matches");
        return;
    }
}

function constructRows(list, selector) {
    $(selector).html("");
    for (var i = 0; i < list.length; i++) {
        var clr = "#DDDDDD";
        var row = $('<tr style="background-color:' + clr + '"/>');
        row.append($('<td/>').html(val = list[i]));
        $(selector).append(row);
    }
}

function Headers(list, selector) {
    var columns = [];
    var header = $('<tr/>');
    for (var i = 0; i < list.length; i++) {
        for (var k in list[i]) {
            if ($.inArray(k, columns) == -1) {
                columns.push(k);
                header.append($('<th/>').html(k));
            }
        }
    }
    $(selector).append(header);
    return columns;
}

function codeLink(list, selector) {
    if(list !== undefined){
      $(selector).html("");
      let a = document.createElement('a');
      a.appendChild(document.createTextNode("code"));
      a.href = list;
      a.target = "_blank";
      $(selector).append(a);
    }
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", async function (e) {
        var a, b, i, val = this.value;
        await checkAirport(val, arr);

        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i] != null && arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
