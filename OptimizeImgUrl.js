function OptimizeImgUrl(url,isChangehttp,isWebp,isChangeSize,size) {
    if (isChangehttp) {
        url = url.replace("http:","https:");
    }
    if (isChangeSize) {
        url=app.getOptimizedImgUrl(url, size);
    } else {
        if (isWebp) {
            url = app.appendWebpForImgUrl(url);
        }
    }
    return url;
}