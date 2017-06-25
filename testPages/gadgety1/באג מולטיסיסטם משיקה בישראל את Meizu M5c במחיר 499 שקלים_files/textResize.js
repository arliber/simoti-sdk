function resizeTextNow(e) {
    var t = getCookie("cfont"),
        i = getCookie("cheight");
    if ("" != t) {
        var s = t + "px",
            c = i + "px";
        $(".resizableText").css("font-size", s), $(".resizableText").css("line-height", c)
    }
}

function textResize(e) {
    var t = $(".resizableText").css("font-size"),
        i = t.replace("px", ""),
        s = $(".resizableText").css("line-height"),
        c = s.replace("px", "");
    i = parseInt(i) + e, c = parseInt(c) + 2 * e, 0 == e ? ($(".resizableText").css("font-size", "17px"), $(".resizableText").css("line-height", "30px"), document.cookie = "cfont=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/", document.cookie = "cheight=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/") : i > 12 && 24 > i && ($(".resizableText").css("font-size", i + "px"), $(".resizableText").css("line-height", c + "px"), document.cookie = "cfont=" + i + "; path=/", document.cookie = "cheight=" + c + "; path=/")
}
$(document).ready(resizeTextNow), $(document).ready(function() {
	//alert("dddd");
    $("#resize-big").click(function() {
        textResize(1)
    }), $("#resize-small").click(function() {
        textResize(-1)
    }), $("#resize-zero").click(function() {
        textResize(0)
    })
});