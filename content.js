browser.runtime.onMessage.addListener(request => {

    var body = document.body;

    if (!request.isGrayscale) {
        if (!body.style['filter']) {
            body.style['filter'] = 'grayscale(100)';
            body.style['-webkit-filter'] = 'grayscale(100)';
            body.style['filter'] = 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)';
        }
        return Promise.resolve({ info: "Turned on grayscale" });
    } else {
        if (body.style['filter']) {
            body.style['filter'] = null;
            body.style['-webkit-filter'] = null;
            body.style['filter'] = 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=0)';
        }
        return Promise.resolve({ info: "Turned off grayscale" });
    }
});