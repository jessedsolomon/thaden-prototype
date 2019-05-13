"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/// <reference path="../web/jquery.min.js"/>
var FX_LINK_SELECTOR = "[href]";
var FX_PARALLAX_SCALE = 50;

var FX =
/*#__PURE__*/
function () {
  function FX() {
    _classCallCheck(this, FX);
  }

  _createClass(FX, null, [{
    key: "onScroll",
    value: function onScroll() {
      this.backgroundElements.forEach(function (element) {
        var parent = element.parentElement;
        var boundingRect = parent.getBoundingClientRect();

        if (boundingRect.top > -boundingRect.height && boundingRect.top < innerHeight) {
          element.style.opacity = (1 / innerHeight * (boundingRect.height - Math.abs(boundingRect.top))).toString();
        } else element.style.opacity = "0";
      });
      this.parallaxElements.forEach(function (element) {
        var rect = element.getBoundingClientRect();
        if (rect.top > -rect.height && rect.top < innerHeight) $(element).css("--parallax-y", (1 / innerHeight * (rect.top + rect.height / 2) * 2 - 1) * parseInt(element.getAttribute("fx-parallax-y")) * FX_PARALLAX_SCALE + "px");
        $(element).css("--parallax-x", Math.abs((1 / innerHeight * (rect.top + rect.height / 2) * 2 - 1) * parseInt(element.getAttribute("fx-parallax-x")) * FX_PARALLAX_SCALE) + "px");
      });
    }
    /**
     * @param {string} href 
     * @param {string} color
     * @param {"fade" | "slide-left" | "slide-right"} style 
     */

  }, {
    key: "Navigate",
    value: function Navigate(href) {
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "fade";
      window.history.pushState("", "", href);
      var loadFrame = $("<fx-load-frame style=\"background-color: ".concat(color || document.body.getAttribute("load-color") || "white", "\" class=\"").concat(style, "\"></fx-load-frame>"));
      $(document.body).prepend(loadFrame);
      document.body.setAttribute("fx-loading", style);
      $.get(document.location.href, {
        "dynamic-load": true
      }).fail(function (error) {
        console.error(error);
      }).done(function (result) {
        document.body.removeAttribute("fx-loading");

        if (style == "fade") {
          $("body > *:not(fx-load-frame)").remove();
          $(document.body).append(result);
        } else {}

        setTimeout(function () {
          loadFrame.remove();
        }, 1000);
        $(document).trigger("load");
      });
    }
  }, {
    key: "onLoad",
    value: function onLoad() {
      var _this = this;

      /** @type {HTMLElement[]} */
      this.backgroundElements = [];
      /** @type {HTMLElement[]} */

      this.parallaxElements = [];
      $(FX_LINK_SELECTOR).on("click", function (event) {
        var href = this.getAttribute("href");

        if (href != null) {
          event.preventDefault();
          FX.Navigate(href);
        }
      });
      $("section[fx-background]").each(function () {
        var element = $(this);
        FX.backgroundElements.push($("<fx-background style=\"background-color: ".concat(element.attr("fx-background"), "\"></fx-background>")).prependTo(element)[0]);
      });

      function parseParallaxVaue(attr) {
        var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var value = fallback;

        switch (attr.trim().toLowerCase()) {
          case "near":
            return 3;

          case "medium":
            return 2;

          case "far":
            return 1;

          default:
            value = parseInt(attr);
            break;
        }

        if (isNaN(value)) value = fallback;
        return value;
      }

      $("[fx-parallax]").each(function () {
        FX.parallaxElements.push(this);
        var value = this.getAttribute("fx-parallax").split(",");
        var y = parseParallaxVaue(value[0] || "_");
        var x = parseParallaxVaue(value[1] || "_", 0);
        this.setAttribute("fx-parallax-y", y.toString());
        this.setAttribute("fx-parallax-x", x.toString());
      });

      if (this.backgroundElements.length > 0 || this.parallaxElements.length > 0) {
        $(window).on("scroll", function () {
          return _this.onScroll();
        });
        this.onScroll();
      }
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      $(window).on("popstate", function (event) {
        _this2.Navigate(location.href);
      });
      $(document).on("load", function () {
        return _this2.onLoad();
      });
      this.onLoad();
    }
  }]);

  return FX;
}();
"use strict";

/// <reference path="../web/jquery.min.js"/>
/// <reference path="./fx.js"/>
FX.init();
