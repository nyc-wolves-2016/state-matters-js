function setupListeners() {
  console.log("we runnin dis");

  'use strict';

  // define variables
  var items = document.querySelectorAll(".timeline li");

  // check if an element is in viewport
  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function toggleAppearance() {
    // debugger;
    for (var i = 0; i < items.length; i++) {
      if (isElementInViewport(items[i])) {
        items[i].classList.add("in-view");
        console.log("sth's in view");
      } else {
        items[i].classList.remove("in-view");
      }
    }
  }

  // listen for events
  window.addEventListener("load", toggleAppearance);
  window.addEventListener("resize", toggleAppearance);
  window.addEventListener("scroll", toggleAppearance);

}

export default setupListeners;
