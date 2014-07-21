(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['selectorEngine'], factory);
    } else {
        factory(window.Zepto || window.jQuery);
    }
}(function($) {
    var PLUGIN_NAME = 'bellows';
    var noop = function() {};

    var ITEM_CLASS = 'bellows__item';
    var OPENED_CLASS = 'bellows--is-open';
    var OPENING_CLASS = 'bellows--is-opening';
    var CLOSING_CLASS = 'bellows--is-closing';

    var selectors = {
        ITEM_HEADER: '> .bellows__item > .bellows__header',
        ITEM_CONTENT_WRAPPER: '> .bellows__content-wrapper',
        ITEM_CONTENT: '> .bellows__item > .bellows__content'
    };

    function Bellows(element, options) {
        this._init(element, options);
    }

    Bellows.DEFAULTS = {
        singleItemOpen: false,
        event: 'tap',
        duration: 200,
        easing: 'swing',
        open: noop,
        opened: noop,
        close: noop,
        closed: noop
    };

    Bellows.prototype._init = function(element, options) {
        this.options = $.extend(true, {}, Bellows.DEFAULTS, options);

        this.$bellows = $(element);

        this.$bellows
            .find(selectors.ITEM_CONTENT)
            // wrap content section of each item to facilitate padding
            .wrap('<div class="bellows__content-wrapper" />')
            // add aria-hidden attribute to all hidden content wrappers
            .parents('.bellows__item:not(.bellows--is-open)')
            .find('.bellows__content-wrapper')
            .attr('aria-hidden', true);

        this._bindEvents();
    };

    Bellows.prototype._bindEvents = function() {
        var plugin = this;

        // We use tappy here to eliminate the 300ms delay on clicking elements
        this.$bellows
            .find(selectors.ITEM_HEADER)
            .bind(this.options.event, function(e) {
                e.preventDefault();

                plugin.toggle($(this).parent());
            });
    };

    Bellows.prototype.toggle = function($item) {
        $item = this._item($item);

        this[$item.hasClass(OPENED_CLASS) ? 'close' : 'open']($item);
    };

    Bellows.prototype.open = function($item) {
        $item = this._item($item);

        if ($item.hasClass(OPENED_CLASS)) {
            return;
        }

        var plugin = this;
        var $contentWrapper = $item.find(selectors.ITEM_CONTENT_WRAPPER);

        if (this.options.singleItemOpen) {
            this.$bellows.find('.' + OPENED_CLASS).each(function() {
                plugin.close($(this));
            });
        }

        this._trigger('open', { item: $item });

        $contentWrapper
            .velocity('slideDown', {
                begin: function() {
                    plugin._setHeight(plugin._getHeight(plugin.$bellows) + plugin._getHeight($contentWrapper));
                    $item.addClass(OPENING_CLASS);
                },
                duration: this.options.duration,
                easing: this.options.easing,
                complete: function() {
                    $item
                        .removeClass(OPENING_CLASS)
                        .addClass(OPENED_CLASS)
                        .attr('aria-hidden', true);

                    plugin._resetItemStyle($contentWrapper);

                    plugin._trigger('opened', { item: $item });
                }
            });
    };

    Bellows.prototype.close = function($item) {
        $item = this._item($item);

        if (!$item.hasClass(OPENED_CLASS)) {
            return;
        }

        var plugin = this;
        var $contentWrapper = $item.find(selectors.ITEM_CONTENT_WRAPPER);

        this._trigger('close', { item: $item });

        $contentWrapper
            .velocity('slideUp', {
                begin: function() {
                    plugin._setHeight(plugin._getHeight(plugin.$bellows));
                    $item
                        .removeClass(OPENED_CLASS)
                        .addClass(CLOSING_CLASS);
                },
                duration: this.options.duration,
                easing: this.options.easing,
                complete: function() {
                    $item
                        .removeClass(CLOSING_CLASS)
                        .removeAttr('aria-hidden');

                    plugin._resetItemStyle($contentWrapper);

                    plugin._trigger('closed', { item: $item });
                }
            });
    };

    // Remove the style attributes from item and
    // bellows to allow the height to be auto
    Bellows.prototype._resetItemStyle = function($contentWrapper) {
        var plugin = this;

        plugin._setHeight();

        // hack to remove style after height has been toggled. Ensures that height is reset to auto
        // TODO: remove this once Velocity issue #183 is resolved
        setTimeout(function() {
            $contentWrapper.removeAttr('style');
        }, 250);
    };

    Bellows.prototype._getHeight = function($element) {
        return parseFloat($.Velocity.CSS.getPropertyValue($element[0], 'height'));
    };

    Bellows.prototype._setHeight = function(height) {
        this.$bellows.css('height', height || '');
    };

    // Allow items to be found using an index
    Bellows.prototype._item = function(item) {
        if (typeof item === 'number') {
            item = this.$bellows.find('.' + ITEM_CLASS).eq(item);
        }

        return item;
    };

    Bellows.prototype._trigger = function(eventName, data) {
        eventName in this.options && this.options[eventName].call(this, $.Event(PLUGIN_NAME + ':' + eventName, { bubbles: false }), data);
    };

    // BELLOWS PLUGIN
    // =========================

    $.fn.bellows = function(option) {
        var args = Array.prototype.slice.call(arguments);

        return this.each(function() {
            var $this = $(this);
            var bellows = $this.data(PLUGIN_NAME);
            var isMethodCall = typeof option === 'string';

            if (!bellows) {
                if (isMethodCall) {
                    throw 'cannot call methods on bellows prior to initialization; attempted to call method "' + option + '"';
                }
                $this.data(PLUGIN_NAME, (bellows = new Bellows(this, option)));
            }

            // invoke a public method on bellows, and skip private methods
            if (isMethodCall) {
                if (option.charAt(0) === '_' || typeof bellows[option] !== 'function') {
                    throw 'no such method "' + option + '" for bellows';
                }

                bellows[option].apply(bellows, args.length > 1 ? args.slice(1) : null);
            }
        });
    };

    $.fn.bellows.Constructor = Bellows;

    $('[data-bellows]').bellows();

    return $;
}));
