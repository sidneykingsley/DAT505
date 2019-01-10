var FLOATING_TEXT = (function () {

	if(!window.jQuery) {
		console.error("Floating_text can't work : JQuery is not present !");
		return;
	}


	var version = '0.2';

	var KEYFRAMES_NAMES = [
		"float_top",
		"float_bottom",
		"float_left",
		"float_right",
		"float_left-top",
		"float_right-top",
		"float_left-bottom",
		"float_right-bottom"
	];

	var HTML_VALUES = {
		FLOAT_CLASS_NAME: 'floating_text',
		FLOAT_CLASS_ACTIVE: 'run-animation',
		CHAR_DOM: 'span',
		CHAR_CLASS_NAME: 'floating_text_char'
	};

	var ANIMATION_VALUES = {
		DURATION: 1.0,
		TRANSLATE_VAL: 2.0
	};

	var DATA_NAMES = {
		DURATION: 'float-duration',
		TRANSLATE_VAL: 'float-translate'
	};

	var ANIMATION_TRANSLATE_VALUES_USED = [];

	var is_initialized = false;

	var sheet;

	var css_prefix = ['-webkit-', '-moz-', '-o-', '-ms-', ''];


	this.float = function (dom, recursive = false) {
		if (arguments.length === 0) {
			return float($('body'), true);
		}

		if (!is_initialized)
			init();

		var classes = '.' + HTML_VALUES.FLOAT_CLASS_NAME + '.' + HTML_VALUES.FLOAT_CLASS_ACTIVE;

		if (recursive) {
			$(dom).find(classes).each(function () {
				float(this, false);
			});
		}

		if (!$(dom).is(classes))
			return;

		apply_floating_text(dom);
	};

	this.isInitialized = function () {
		return is_initialized;
	};

	this.changeHTMLvalues = function (values) {
		if (isInitialized())
			return error_change("changeHTMLvalues");
		changeValues(HTML_VALUES, values);
	};

	this.changeANIMATIONvalues = function (values) {
		if (isInitialized())
			return error_change("changeANIMATIONvalues");
		changeValues(ANIMATION_VALUES, values);
	};

	this.changeDATAnames = function (values) {
		if (isInitialized())
			return error_change("changeDATAnames");
		changeValues(DATA_NAMES, values);
	};

	this.getVersion = function () {
		return version;
	};


	function getDelays(duration) {
		var delays = "";
		for (var i = 0; i < KEYFRAMES_NAMES.length; i++) {
			if (i !== 0)
				delays += ",";
			delays += (i * duration) + "s";
		}
		return delays;
	}

	function changeValues(default_values, values) {
		for (var propertyName in values) {
			if (default_values.hasOwnProperty(propertyName)) {
				default_values[propertyName] = values[propertyName];
			}
		}
	}

	function error_change(name_function) {
		var message = "FLOATING_TEXT." + name_function + " : you can't call this function. FLOATING_TEXT is already initialized. Please call " + name_function + " BEFORE the first call of FLOATING_TEXT.float() !";
		console.error(message);
		return null;
	}

	function init() {
		is_initialized = true;

		sheet = new_stylesheet();

		defineSheetFirstRules();
	}

	function defineSheetFirstRules() {
		var float = "." + HTML_VALUES.FLOAT_CLASS_NAME;
		var chars = float + " ." + HTML_VALUES.CHAR_CLASS_NAME;
		var chars_run = float + "." + HTML_VALUES.FLOAT_CLASS_ACTIVE + " ." + HTML_VALUES.CHAR_CLASS_NAME;
		var chars_not_run = float + ":not(." + HTML_VALUES.FLOAT_CLASS_ACTIVE + ") ." + HTML_VALUES.CHAR_CLASS_NAME;

		addCSSRule(chars_not_run, getCSSRuleWithPrefix('animation-name', 'none !important'));
		addCSSRule(chars, "display: inline-block !important");
		addCSSRule(chars, getCSSRuleWithPrefix('animation-play-state', 'paused'));
		addCSSRule(chars, getCSSRuleWithPrefix('animation-direction', 'alternate'));
		addCSSRule(chars, getCSSRuleWithPrefix('animation-timing-function', 'linear'));
		addCSSRule(chars, getCSSRuleWithPrefix('animation-fill-mode', 'forwards'));

		addCSSRule(chars_run, getCSSRuleWithPrefix('animation-play-state', 'running'));
	}

	function checkSheetKeyframes(translate) {
		if (!(ANIMATION_TRANSLATE_VALUES_USED.includes(translate))) {
			addSheetKeyframes(translate);
			ANIMATION_TRANSLATE_VALUES_USED.push(translate);
		}
	}

	function addSheetKeyframes(translate) {
		addKeyframeRule(KEYFRAMES_NAMES[0] + '_' + translate, getKeyframeValues(-translate, 0));
		addKeyframeRule(KEYFRAMES_NAMES[1] + '_' + translate, getKeyframeValues(translate, 0));
		addKeyframeRule(KEYFRAMES_NAMES[2] + '_' + translate, getKeyframeValues(0, -translate));
		addKeyframeRule(KEYFRAMES_NAMES[3] + '_' + translate, getKeyframeValues(0, translate));
		addKeyframeRule(KEYFRAMES_NAMES[4] + '_' + translate, getKeyframeValues(-translate, -translate));
		addKeyframeRule(KEYFRAMES_NAMES[5] + '_' + translate, getKeyframeValues(translate, -translate));
		addKeyframeRule(KEYFRAMES_NAMES[6] + '_' + translate, getKeyframeValues(-translate, translate));
		addKeyframeRule(KEYFRAMES_NAMES[7] + '_' + translate, getKeyframeValues(translate, translate));
	}

	function getKeyframeValues(translateX, translateY) {
		return {
			'0%': getCSSRuleWithPrefix('transform', 'translate(0,0);'),
			'50%': getCSSRuleWithPrefix('transform', 'translate(' + translateX + 'px,' + translateY + 'px);'),
			'100%': getCSSRuleWithPrefix('transform', 'translate(0,0);')
		};
	}

	function apply_floating_text(element) {

		var dataduration = $(element).data(DATA_NAMES.DURATION),
				datatranslateval = $(element).data(DATA_NAMES.TRANSLATE_VAL)
				;

		var duration = (dataduration === undefined || dataduration === '')
				? ANIMATION_VALUES.DURATION
				: parseFloat(dataduration);
		var translate_val = (datatranslateval === undefined || datatranslateval === '')
				? ANIMATION_VALUES.TRANSLATE_VAL
				: parseFloat(datatranslateval);

		checkSheetKeyframes(translate_val);


		var old_txt = $(element).text();
		var txt = "";

		for (var i = 0; i < old_txt.length; i++) {
			if (' \t\n\r\v'.indexOf(old_txt[i]) > -1) {
				txt += old_txt[i];
				continue;
			}
			txt += "<" + HTML_VALUES.CHAR_DOM + " class='" + HTML_VALUES.CHAR_CLASS_NAME + "'>"
					+ old_txt[i]
					+ "</" + HTML_VALUES.CHAR_DOM + ">";
		}

		$(element).html(txt);

		var animnames;
		$(element).find('>.' + HTML_VALUES.CHAR_CLASS_NAME).each(function () {
			animnames = getRandomKeyframesNames(translate_val);
			for (var i = 0; i < css_prefix.length; i++) {
				$(this).css(css_prefix[i] + 'animation-name', animnames);
				$(this).css(css_prefix[i] + 'animation-duration', duration + 's');
				$(this).css(css_prefix[i] + 'animation-delay', getDelays(duration));
			}
		});

		var jqElement = $(element).find('>.' + HTML_VALUES.CHAR_CLASS_NAME).first();
		var count = 0;
		jqElement.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) {
			e.preventDefault;
			count++;
			if (count >= KEYFRAMES_NAMES.length) {
				count = 0;
				$(element).removeClass(HTML_VALUES.FLOAT_CLASS_ACTIVE);
				void element.offsetWidth;
				$(element).addClass(HTML_VALUES.FLOAT_CLASS_ACTIVE);
			}
		});
	}

	function getRandomKeyframesNames(translate_val) {
		var clone_names = KEYFRAMES_NAMES.slice(0);
		var names = '', rand;
		while (clone_names.length > 0) {
			rand = Math.floor(Math.random() * clone_names.length);
			names += clone_names.splice(rand, 1)[0] + '_' + translate_val;
			if (clone_names.length > 0)
				names += ',';
		}
		return names;
	}

	function new_stylesheet() {
		var style = document.createElement("style");

		style.appendChild(document.createTextNode(""));

		document.head.appendChild(style);

		return style.sheet;
	}

	function addKeyframeRule(name, values) {
		var val = '';
		for (var propertyName in values) {
			val += propertyName + '{' + values[propertyName] + '}';
		}
		for (var i = 0; i < css_prefix.length; i++) {
			try {
				addCSSRule('@' + css_prefix[i] + 'keyframes ' + name, val);
				break;
			} catch (e) {
			}
		}
	}

	function addCSSRule(selector, rules, index = 0) {
		if ("insertRule" in sheet)
			sheet.insertRule(selector + "{" + rules + "}", index);
		else if ("addRule" in sheet)
			sheet.addRule(selector, rules, index);
	}

	function getCSSRuleWithPrefix(key, value) {
		var rule = '';
		for (var i = 0; i < css_prefix.length; i++) {
			rule += css_prefix[i] + key + ':' + value + ';';
		}
		return rule;
	}

	return this;
})();
