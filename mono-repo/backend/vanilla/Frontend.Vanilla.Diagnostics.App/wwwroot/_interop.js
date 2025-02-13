function scrollToElementId(elementId) {
    var element = document.getElementById(elementId);
    if (!element) {
        console.warn('element was not found', elementId);
        return;
    }
    element.scrollIntoView();
}
