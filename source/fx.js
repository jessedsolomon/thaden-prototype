/// <reference path="../web/jquery.min.js"/>

const FX_LINK_SELECTOR = "[href]";
const FX_PARALLAX_SCALE = 50;

class FX {
	static onScroll() {
		this.backgroundElements.forEach(element => {
			let parent = element.parentElement;
			const boundingRect = parent.getBoundingClientRect();
			
			if (boundingRect.top > -boundingRect.height && boundingRect.top < innerHeight) {
				element.style.opacity = ((1 / innerHeight) * (boundingRect.height - Math.abs(boundingRect.top))).toString();
			} else element.style.opacity = "0";
		});

		this.parallaxElements.forEach(element => {
			const rect = element.getBoundingClientRect();

			if (rect.top > -rect.height && rect.top < innerHeight)
				$(element).css("--parallax-y", (((1 / innerHeight) * (rect.top + (rect.height / 2))) * 2 - 1) * parseInt(element.getAttribute("fx-parallax-y")) * FX_PARALLAX_SCALE + "px");
				$(element).css("--parallax-x", Math.abs((((1 / innerHeight) * (rect.top + (rect.height / 2))) * 2 - 1) * parseInt(element.getAttribute("fx-parallax-x")) * FX_PARALLAX_SCALE) + "px");
		});
	}

	/**
	 * @param {string} href 
	 * @param {string} color
	 * @param {"fade" | "slide-left" | "slide-right"} style 
	 */
	static Navigate(href, color = null, style = "fade") {
		window.history.pushState("", "", href);

		let loadFrame = $(`<fx-load-frame style="background-color: ${color || document.body.getAttribute("load-color") || "white"}" class="${style}"></fx-load-frame>`);
		$(document.body).prepend(loadFrame);
		document.body.setAttribute("fx-loading", style);

		$.get(document.location.href, {
			"dynamic-load": true
		})
		.fail(error => {
			console.error(error);
		})
		.done((result) => {
			document.body.removeAttribute("fx-loading");

			if (style == "fade") {
				$("body > *:not(fx-load-frame)").remove();
				$(document.body).append(result);
			}
			else {

			}
			
			setTimeout(() => {
				loadFrame.remove();
			}, 1000);

			$(document).trigger("load");
		});
	}

	static onLoad() {
		/** @type {HTMLElement[]} */
		this.backgroundElements = [];
		/** @type {HTMLElement[]} */
		this.parallaxElements = [];

		$(FX_LINK_SELECTOR).on("click", function(event) {
			let href = this.getAttribute("href");
			
			if (href != null) {
				event.preventDefault();
				FX.Navigate(href);
			}
		});

		$("section[fx-background]").each(function() {
			let element = $(this);
			FX.backgroundElements.push($(`<fx-background style="background-color: ${element.attr("fx-background")}"></fx-background>`).prependTo(element)[0]);
		});

		function parseParallaxVaue(attr, fallback = 1) {
			let value = fallback;

			switch(attr.trim().toLowerCase()) {
				case "near": return 3;
				case "medium": return 2;
				case "far": return 1;
				default:
				value = parseInt(attr);
				break;
			}

			if (isNaN(value)) value = fallback;

			return value;
		}

		$("[fx-parallax]").each(function() {
			FX.parallaxElements.push(this);
			let value = this.getAttribute("fx-parallax").split(",");
			let y = parseParallaxVaue(value[0] || "_");
			let x = parseParallaxVaue(value[1] || "_", 0);

			this.setAttribute("fx-parallax-y", y.toString());
			this.setAttribute("fx-parallax-x", x.toString());
		});

		if (this.backgroundElements.length > 0 || this.parallaxElements.length > 0) {
			$(window).on("scroll", () => this.onScroll());
			this.onScroll();
		}
	}

	static init() {
		$(window).on("popstate", event => {
			this.Navigate(location.href)
		});
		$(document).on("load", () => this.onLoad());

		this.onLoad();
	}
}
