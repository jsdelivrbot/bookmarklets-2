(function (window, document, req_version, callback, $, script, done, readystate) {

  // If jQuery isn't loaded, or is a lower version than specified, load the
  // specified version and call the callback, otherwise just call the callback.
  if (!($ = window.jQuery) || req_version > $.fn.jquery || callback($)) {

    // Create a script element.
    script = document.createElement('script');
    script.type = 'text/javascript';

    // Load the specified jQuery from the Google AJAX API server (minified).
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/' + req_version + '/jquery.min.js';

    // When the script is loaded, remove it, execute jQuery.noConflict( true )
    // on the newly-loaded jQuery (thus reverting any previous version to its
    // original state), and call the callback with the newly-loaded jQuery.
    script.onload = script.onreadystatechange = function () {
      if (!done && (!(readystate = this.readyState) || readystate == 'loaded' || readystate == 'complete')) {

        callback(($ = window.jQuery).noConflict(1), done = 1);

        $(script).remove();
      }
    };

    // Add the script element to either the head or body, it doesn't matter.
    document.documentElement.childNodes[0].appendChild(script);
  }

})(
  window,
  document,
  // Minimum jQuery version required. Change this as-needed.
  '3.1.1',
  //
  // Your jQuery code goes inside this callback. $ refers to the jQuery object,
  // and L is a boolean that indicates whether or not an external jQuery file
  // was just "L"oaded.
  function ($, L) {
    doWork($);
  });

var doWork = function($) {
    function addcss(css) {
      var head = document.getElementsByTagName('head')[0];
      var s = document.createElement('style');
      s.setAttribute('type', 'text/css');
      if (s.styleSheet) {   // IE
        s.styleSheet.cssText = css;
      } else {              // the world
        s.appendChild(document.createTextNode(css));
      }
      head.appendChild(s);
    }

    var cssStyle = `
      #feedlyFrame {
        margin-left: 0px !important;
      }

      #feedlyTabsHolder.unpinned {
        display: none;
      }

      #feedlyFrame.hidden {
        display: none !important;
      }

      #feedlyTabsHolder.pinned {
        width: 100%;
      }

      #feedlyTabsHolder.pinned #feedlyTabs {
        width: 80%;
      }

      .pro {
        display: none;
      }

      div.hercule-search input {
        font-size: .7rem !important;
      }

      search-bar-right-col {
        float: none;
      }

      div.profile-bubble, i.feedly-logo {
        display: none !important;
      }

      #searchBarFX {
        width: 100% !important;
      }

      #headerBarFX {
        left: 0px !important;
        top: auto !important;
      }

      #customMenuButtonContainer {
        width: 52px;
        height: 52px;
        background: #2A2B2F;
        z-index: 5;
        position: fixed;
        left: 0px;
        top: 0px;
        cursor: pointer;
        cursor: hand;
      }

      #customMenuButton {
        color: white;
        width: 100%;
        height: 100%;
        background-image: url('https://s3.feedly.com/production/head/images/icon-feedly-white.png');
      }

      #customMenuButtonContainer.hidden {
        display: none;
      }

      #feedlyTabsUnpin {
        display: none !important;
      }
  `;

    addcss(cssStyle);

    $('#feedlyTabsUnpin').click();

    $(document).on(
      'click',
      'div.entry',
      function(event) {
        var elem = $(this);
        window.location.href = elem.attr('data-alternate-link');
        return false;
      }
    );

    $('#feedlyTabsHolder').on(
      'click',
      '.header div.label, .feedIndex',
      function(event) {
        closeMenu($);
        return true;
      }
    );

    var pageUpdate = function($) {
      var pageHeader = $('#feedlyPageFX h1');

      if (pageHeader.hasClass('col-xs-8')) {
        pageHeader.removeClass('col-xs-8');
        pageHeader.addClass('col-xs-12');
      }

      var pageHeaderOptions = $('#feedlyPageFX div.extra');

      if (pageHeaderOptions.hasClass('col-xs-4')) {
        pageHeaderOptions.removeClass('col-xs-4');
        pageHeaderOptions.addClass('col-xs-12');
      }

      var body = $('body');

      if (body.find('#customMenuButtonContainer').length === 0) {
        console.log("Adding menu button...");
        body.append("<div id='customMenuButtonContainer'><div id='customMenuButton'></div></div>");
        $(document).on(
          'click',
          'div#customMenuButtonContainer',
          function(event) {
            openMenu($);
          }
        );
      }
    };

  pageUpdate($);

  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var observer = new MutationObserver(function(mutations) {
    pageUpdate($);
    return true;
  });

  var observerTarget = $('div#feedlyCenter').get(0);
  observer.observe(
    observerTarget,
    {
      subtree: true,
      attributes: true,
      characterData: true,
      childList: true
    }
  );
};

var openMenu = function($) {
  $('#feedlyFrame').addClass('hidden');
  $('#feedlyTabsPin').trigger("click");
  $('#customMenuButtonContainer').addClass('hidden');
};

var closeMenu = function($) {
  $('#feedlyFrame').removeClass('hidden');
  $('#feedlyTabsUnpin').trigger("click");
  $('#customMenuButtonContainer').removeClass('hidden');
};
