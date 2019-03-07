function createHrefElement(value, link, className, onClickFunc) {
    var hyperLink = document.createElement('a');
    hyperLink.innerHTML = value;
    hyperLink.className = className;
    hyperLink.href = link;
    if (typeof onClickFunc === 'function') {
        hyperLink.onclick = hyperLink;
    }
    return hyperLink;
}