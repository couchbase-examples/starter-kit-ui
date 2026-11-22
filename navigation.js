window.onload = function () {
    navigation(document.getElementById("navigation"));
}

/*
 * Probe a starter-kit API endpoint and report whether the backend can serve it.
 * Returns false (never throws) when the request fails, the response is not JSON,
 * the payload has no `context`, or the backend reports 'Not Connected', so the
 * sidebar always renders and falls back to the setup instructions link.
 */
async function probeBackend(url) {
    try {
        const response = await fetch(url, {headers: {"Content-Type": "application/json"}, method: "GET"});
        const json = await response.json();
        return json.context === undefined ? false : (json.context.length == 0 || json.context[0] !== 'Not Connected');
    } catch (e) {
        return false;
    }
}

async function navigation(selector) {

    html =
        '<div class="sidebar">' +
        '<div class="top-row ps-3 navbar navbar-dark" style="height:180px;width:170px;justify-content:left">' +
        '<a class="navbar-brand"  style="color:black"  href="http://www.couchbase.com" target="_blank">&nbsp;&nbsp;&nbsp;&nbsp;Couchbase</a>' +
        '<img src="favicon.ico"/>' +
        '</div>' +
        '<div class="@NavMenuCssClass nav-scrollable" @onclick="ToggleNavMenu">' +
        '<nav class="flex-column">' +
        '<div class="nav-item px-3">' +
        '<a class="nav-link"   style="color:black;" HREF="#" ' +
        'onClick="parent.right.location=\'welcome.html\'">Welcome</a>' +
        '</div>';

    let connected = await probeBackend('api/hotels/byid/hotel_10180/');

    if (connected) {
        html = html +
            '<div class="nav-item px-3">' +
            '<a class="nav-link"   style="color:black;" HREF="#" ' +
            'onClick="parent.right.location=\'keyvalue.html\'">Key Value</a>' +
            '</div>' +
            '<div class="nav-item px-3">' +
            '<a class="nav-link"   style="color:black;" HREF="#" ' +
            'onClick="parent.right.location=\'query.html\'">Query</a>' +
            '</div>';


        let hasFtsIndex = await probeBackend('api/hotels/pool/California/');

        if (hasFtsIndex) {
            html = html + ('<div class="nav-item px-3">' +
                '<a class="nav-link"   style="color:black;" HREF="#" ' +
                'onClick="parent.right.location=\'fts.html\'">Full Text</a>' +
                '</div>');
        } else {
            html = html +
                '<div class="nav-item px-3">' +
                '<a class="nav-link"   style="color:black;" href="https://github.com/couchbase-examples/starter-kit-java#getting-started" target="_blank">' +
                '<span class="oi oi-plus" aria-hidden="true"></span>No FTS Index<br>See instructions here' +
                '</a>' +
                '</div>';
        }
    } else {
        html = html +
            '<div class="nav-item px-3">' +
            '<a class="nav-link"   style="color:black;" href="https://github.com/couchbase-examples/starter-kit-java#getting-started" target="_blank">' +
            '<span class="oi oi-plus" aria-hidden="true"></span>Not Connected<br>See instructions here' +
            '</a>' +
            '</div>';
    }
    html = html + '</nav>' + // class=flex-column
        '</div>' + // class=@NavMenuCssClass
        '</div>';  // sidebar

    $(selector).html(html);
}
