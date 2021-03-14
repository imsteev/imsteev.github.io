
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.35.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/common/Flex.svelte generated by Svelte v3.35.0 */

    const file$6 = "src/common/Flex.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "svelte-1ku14pv");
    			add_location(div, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Flex", slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Flex> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Flex extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Flex",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/common/Button.svelte generated by Svelte v3.35.0 */

    const file$5 = "src/common/Button.svelte";

    function create_fragment$5(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", "svelte-bo77dt");
    			add_location(button, file$5, 4, 0, 42);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onClick*/ ctx[0])) /*onClick*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
    	let { onClick } = $$props;
    	const writable_props = ["onClick"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("onClick" in $$props) $$invalidate(0, onClick = $$props.onClick);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onClick });

    	$$self.$inject_state = $$props => {
    		if ("onClick" in $$props) $$invalidate(0, onClick = $$props.onClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onClick, $$scope, slots];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { onClick: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onClick*/ ctx[0] === undefined && !("onClick" in props)) {
    			console.warn("<Button> was created without expected prop 'onClick'");
    		}
    	}

    	get onClick() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/postContent/RandomDog.svelte generated by Svelte v3.35.0 */
    const file$4 = "src/postContent/RandomDog.svelte";

    // (31:2) <Button onClick={randomDogRefresh}>
    function create_default_slot_1$2(ctx) {
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("another ");
    			t1 = text(/*breed*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*breed*/ 1) set_data_dev(t1, /*breed*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(31:2) <Button onClick={randomDogRefresh}>",
    		ctx
    	});

    	return block;
    }

    // (36:6) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading doge...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(36:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (34:6) {#if !loadingDog}
    function create_if_block(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "alt", "random-shiba");
    			if (img.src !== (img_src_value = /*randomDogUrl*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			add_location(img, file$4, 34, 8, 765);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*randomDogUrl*/ 2 && img.src !== (img_src_value = /*randomDogUrl*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(34:6) {#if !loadingDog}",
    		ctx
    	});

    	return block;
    }

    // (32:2) <Flex>
    function create_default_slot$2(ctx) {
    	let figure;

    	function select_block_type(ctx, dirty) {
    		if (!/*loadingDog*/ ctx[2]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			if_block.c();
    			attr_dev(figure, "style", { padding: 0, margin: "1rem 0" });
    			add_location(figure, file$4, 32, 4, 683);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			if_block.m(figure, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(figure, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(32:2) <Flex>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let button;
    	let t;
    	let flex;
    	let current;

    	button = new Button({
    			props: {
    				onClick: /*randomDogRefresh*/ ctx[3],
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	flex = new Flex({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			t = space();
    			create_component(flex.$$.fragment);
    			add_location(div, file$4, 29, 0, 602);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			append_dev(div, t);
    			mount_component(flex, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope, breed*/ 17) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const flex_changes = {};

    			if (dirty & /*$$scope, randomDogUrl, loadingDog*/ 22) {
    				flex_changes.$$scope = { dirty, ctx };
    			}

    			flex.$set(flex_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(flex.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			transition_out(flex.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    			destroy_component(flex);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let randomDogUrl;
    	let loadingDog;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("RandomDog", slots, []);
    	let { breed } = $$props;

    	const randomDogRefresh = () => {
    		$$invalidate(2, loadingDog = true);

    		fetch(`https://dog.ceo/api/breed/${breed}/images/random`, {}).then(resp => {
    			if (!resp.ok) {
    				throw "Request failed";
    			}

    			return resp.json();
    		}).then(jsonResp => $$invalidate(1, randomDogUrl = jsonResp.message)).finally(() => {
    			$$invalidate(2, loadingDog = false);
    		});
    	};

    	const writable_props = ["breed"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RandomDog> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("breed" in $$props) $$invalidate(0, breed = $$props.breed);
    	};

    	$$self.$capture_state = () => ({
    		Flex,
    		Button,
    		breed,
    		randomDogRefresh,
    		randomDogUrl,
    		loadingDog
    	});

    	$$self.$inject_state = $$props => {
    		if ("breed" in $$props) $$invalidate(0, breed = $$props.breed);
    		if ("randomDogUrl" in $$props) $$invalidate(1, randomDogUrl = $$props.randomDogUrl);
    		if ("loadingDog" in $$props) $$invalidate(2, loadingDog = $$props.loadingDog);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(1, randomDogUrl = "");
    	$$invalidate(2, loadingDog = false);

    	{
    		randomDogRefresh();
    	}

    	return [breed, randomDogUrl, loadingDog, randomDogRefresh];
    }

    class RandomDog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { breed: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RandomDog",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*breed*/ ctx[0] === undefined && !("breed" in props)) {
    			console.warn("<RandomDog> was created without expected prop 'breed'");
    		}
    	}

    	get breed() {
    		throw new Error("<RandomDog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set breed(value) {
    		throw new Error("<RandomDog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/postContent/CssPractice1.svelte generated by Svelte v3.35.0 */
    const file$3 = "src/postContent/CssPractice1.svelte";

    // (9:4) <Button onClick={() => (isPlaying = !isPlaying)}>
    function create_default_slot_1$1(ctx) {
    	let t_value = (/*isPlaying*/ ctx[0]
    	? "pause animations"
    	: "play animations") + "";

    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isPlaying*/ 1 && t_value !== (t_value = (/*isPlaying*/ ctx[0]
    			? "pause animations"
    			: "play animations") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(9:4) <Button onClick={() => (isPlaying = !isPlaying)}>",
    		ctx
    	});

    	return block;
    }

    // (12:4) <Flex>
    function create_default_slot$1(ctx) {
    	let p0;
    	let t1;
    	let div0;
    	let div0_class_value;
    	let t2;
    	let p1;
    	let t4;
    	let div1;
    	let div1_class_value;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "Look it's a rotating square";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "This one's a mover";
    			t4 = space();
    			div1 = element("div");
    			add_location(p0, file$3, 12, 6, 294);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(`box animate-${/*isPlaying*/ ctx[0]}`) + " svelte-g0szgt"));
    			attr_dev(div0, "id", "animation-1");
    			add_location(div0, file$3, 13, 6, 335);
    			add_location(p1, file$3, 14, 6, 401);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`box animate-${/*isPlaying*/ ctx[0]}`) + " svelte-g0szgt"));
    			attr_dev(div1, "id", "animation-2");
    			add_location(div1, file$3, 15, 6, 433);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isPlaying*/ 1 && div0_class_value !== (div0_class_value = "" + (null_to_empty(`box animate-${/*isPlaying*/ ctx[0]}`) + " svelte-g0szgt"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*isPlaying*/ 1 && div1_class_value !== (div1_class_value = "" + (null_to_empty(`box animate-${/*isPlaying*/ ctx[0]}`) + " svelte-g0szgt"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(12:4) <Flex>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let div0;
    	let button;
    	let t;
    	let flex;
    	let current;

    	button = new Button({
    			props: {
    				onClick: /*func*/ ctx[1],
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	flex = new Flex({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(button.$$.fragment);
    			t = space();
    			create_component(flex.$$.fragment);
    			add_location(div0, file$3, 7, 2, 144);
    			add_location(div1, file$3, 6, 0, 136);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(button, div0, null);
    			append_dev(div0, t);
    			mount_component(flex, div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};
    			if (dirty & /*isPlaying*/ 1) button_changes.onClick = /*func*/ ctx[1];

    			if (dirty & /*$$scope, isPlaying*/ 5) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const flex_changes = {};

    			if (dirty & /*$$scope, isPlaying*/ 5) {
    				flex_changes.$$scope = { dirty, ctx };
    			}

    			flex.$set(flex_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(flex.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			transition_out(flex.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(button);
    			destroy_component(flex);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let isPlaying;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CssPractice1", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CssPractice1> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(0, isPlaying = !isPlaying);
    	$$self.$capture_state = () => ({ Flex, Button, isPlaying });

    	$$self.$inject_state = $$props => {
    		if ("isPlaying" in $$props) $$invalidate(0, isPlaying = $$props.isPlaying);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, isPlaying = false);
    	return [isPlaying, func];
    }

    class CssPractice1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CssPractice1",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Post.svelte generated by Svelte v3.35.0 */

    const file$2 = "src/Post.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let p;
    	let t0;
    	let t1;

    	let t2_value = (/*title*/ ctx[1] && /*enclosedTitle*/ ctx[2]
    	? `"${/*title*/ ctx[1]}"`
    	: /*title*/ ctx[1]) + "";

    	let t2;
    	let t3;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(/*date*/ ctx[0]);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(p, "class", "header svelte-15brc8w");
    			add_location(p, file$2, 7, 2, 103);
    			attr_dev(div, "class", "svelte-15brc8w");
    			add_location(div, file$2, 6, 0, 95);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);

    			if (default_slot) {
    				default_slot.m(p, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*date*/ 1) set_data_dev(t0, /*date*/ ctx[0]);

    			if ((!current || dirty & /*title, enclosedTitle*/ 6) && t2_value !== (t2_value = (/*title*/ ctx[1] && /*enclosedTitle*/ ctx[2]
    			? `"${/*title*/ ctx[1]}"`
    			: /*title*/ ctx[1]) + "")) set_data_dev(t2, t2_value);

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Post", slots, ['default']);
    	let { date } = $$props;
    	let { title } = $$props;
    	let { enclosedTitle = false } = $$props;
    	const writable_props = ["date", "title", "enclosedTitle"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Post> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("date" in $$props) $$invalidate(0, date = $$props.date);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("enclosedTitle" in $$props) $$invalidate(2, enclosedTitle = $$props.enclosedTitle);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ date, title, enclosedTitle });

    	$$self.$inject_state = $$props => {
    		if ("date" in $$props) $$invalidate(0, date = $$props.date);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("enclosedTitle" in $$props) $$invalidate(2, enclosedTitle = $$props.enclosedTitle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [date, title, enclosedTitle, $$scope, slots];
    }

    class Post extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { date: 0, title: 1, enclosedTitle: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Post",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*date*/ ctx[0] === undefined && !("date" in props)) {
    			console.warn("<Post> was created without expected prop 'date'");
    		}

    		if (/*title*/ ctx[1] === undefined && !("title" in props)) {
    			console.warn("<Post> was created without expected prop 'title'");
    		}
    	}

    	get date() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enclosedTitle() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enclosedTitle(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/AllPosts.svelte generated by Svelte v3.35.0 */
    const file$1 = "src/AllPosts.svelte";

    // (8:2) <Post title="Shiba Generator" date="August 31" enclosedTitle>
    function create_default_slot_3(ctx) {
    	let randomdog;
    	let current;

    	randomdog = new RandomDog({
    			props: { breed: "shiba" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(randomdog.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(randomdog, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(randomdog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(randomdog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(randomdog, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(8:2) <Post title=\\\"Shiba Generator\\\" date=\\\"August 31\\\" enclosedTitle>",
    		ctx
    	});

    	return block;
    }

    // (11:2) <Post title="CSS Practice" date="August 30, 2020" enclosedTitle>
    function create_default_slot_2(ctx) {
    	let csspractice1;
    	let current;
    	csspractice1 = new CssPractice1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(csspractice1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(csspractice1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(csspractice1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(csspractice1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(csspractice1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(11:2) <Post title=\\\"CSS Practice\\\" date=\\\"August 30, 2020\\\" enclosedTitle>",
    		ctx
    	});

    	return block;
    }

    // (14:2) <Post date="August 29, 2020" title="v2" enclosedTitle>
    function create_default_slot_1(ctx) {
    	let p0;
    	let t1;
    	let p1;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "I previously implemented my personal website using Vue.js, but it quickly\n      became hard to maintain without a proper component structure. So I rewrote\n      this site with React since I'm more familiar with it now than I am with\n      Vue.js.";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "Hopefully the ease of modifying content will encourage me to write more\n      often.";
    			add_location(p0, file$1, 14, 4, 449);
    			add_location(p1, file$1, 20, 4, 719);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(14:2) <Post date=\\\"August 29, 2020\\\" title=\\\"v2\\\" enclosedTitle>",
    		ctx
    	});

    	return block;
    }

    // (26:2) <Post date="May 31, 2020" title="Unrest" enclosedTitle>
    function create_default_slot(ctx) {
    	let p0;
    	let t1;
    	let p1;
    	let t2;
    	let strong0;
    	let t4;
    	let t5_value = " " + "";
    	let t5;
    	let t6;
    	let strong1;
    	let t8;
    	let strong2;
    	let t10;
    	let t11;
    	let ul;
    	let li0;
    	let t13;
    	let li1;
    	let t15;
    	let li2;
    	let t17;
    	let li3;
    	let t19;
    	let li4;
    	let t21;
    	let li5;
    	let strong3;
    	let t23;
    	let p2;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "Reflecting on my upbringing, I grew up in a sheltered, educated, and\n      diverse neighborhood. For this reason, I don't feel entitled to the\n      conviction that the world is feeling. But I am hurt. I am angry, I am\n      confused, I am baffled, I am tired.";
    			t1 = space();
    			p1 = element("p");
    			t2 = text("What this all boils down to: ");
    			strong0 = element("strong");
    			strong0.textContent = "mindless";
    			t4 = text(",");
    			t5 = text(t5_value);
    			t6 = space();
    			strong1 = element("strong");
    			strong1.textContent = "racist";
    			t8 = text(", and ");
    			strong2 = element("strong");
    			strong2.textContent = "ignorant bigots";
    			t10 = text(" in power.");
    			t11 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "What will push the country for tangible change?";
    			t13 = space();
    			li1 = element("li");
    			li1.textContent = "How can we trust leaders of this country?";
    			t15 = space();
    			li2 = element("li");
    			li2.textContent = "How many \"accidental\" martyrs will there be?";
    			t17 = space();
    			li3 = element("li");
    			li3.textContent = "How can someone watch these events of police brutality events happening\n        and say \"this is just an accident\"?";
    			t19 = space();
    			li4 = element("li");
    			li4.textContent = "How can we redefine justice?";
    			t21 = space();
    			li5 = element("li");
    			strong3 = element("strong");
    			strong3.textContent = "Why would a cop put a knee on someone's neck for 8 minutes and 46\n          seconds?";
    			t23 = space();
    			p2 = element("p");
    			p2.textContent = "I urge everyone to reflect and ask themselves these questions, and I hope\n      you feel as troubled as I do.";
    			add_location(p0, file$1, 26, 4, 895);
    			add_location(strong0, file$1, 34, 35, 1219);
    			add_location(strong1, file$1, 35, 6, 1257);
    			add_location(strong2, file$1, 35, 35, 1286);
    			add_location(p1, file$1, 33, 4, 1180);
    			add_location(li0, file$1, 39, 6, 1354);
    			add_location(li1, file$1, 40, 6, 1417);
    			add_location(li2, file$1, 41, 6, 1474);
    			add_location(li3, file$1, 42, 6, 1534);
    			add_location(li4, file$1, 46, 6, 1681);
    			add_location(strong3, file$1, 48, 8, 1738);
    			add_location(li5, file$1, 47, 6, 1725);
    			add_location(ul, file$1, 38, 4, 1343);
    			add_location(p2, file$1, 55, 4, 1887);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t2);
    			append_dev(p1, strong0);
    			append_dev(p1, t4);
    			append_dev(p1, t5);
    			append_dev(p1, t6);
    			append_dev(p1, strong1);
    			append_dev(p1, t8);
    			append_dev(p1, strong2);
    			append_dev(p1, t10);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(ul, t13);
    			append_dev(ul, li1);
    			append_dev(ul, t15);
    			append_dev(ul, li2);
    			append_dev(ul, t17);
    			append_dev(ul, li3);
    			append_dev(ul, t19);
    			append_dev(ul, li4);
    			append_dev(ul, t21);
    			append_dev(ul, li5);
    			append_dev(li5, strong3);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, p2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(ul);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(p2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(26:2) <Post date=\\\"May 31, 2020\\\" title=\\\"Unrest\\\" enclosedTitle>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let post0;
    	let t0;
    	let post1;
    	let t1;
    	let post2;
    	let t2;
    	let post3;
    	let current;

    	post0 = new Post({
    			props: {
    				title: "Shiba Generator",
    				date: "August 31",
    				enclosedTitle: true,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	post1 = new Post({
    			props: {
    				title: "CSS Practice",
    				date: "August 30, 2020",
    				enclosedTitle: true,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	post2 = new Post({
    			props: {
    				date: "August 29, 2020",
    				title: "v2",
    				enclosedTitle: true,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	post3 = new Post({
    			props: {
    				date: "May 31, 2020",
    				title: "Unrest",
    				enclosedTitle: true,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(post0.$$.fragment);
    			t0 = space();
    			create_component(post1.$$.fragment);
    			t1 = space();
    			create_component(post2.$$.fragment);
    			t2 = space();
    			create_component(post3.$$.fragment);
    			attr_dev(div, "class", "svelte-rvent");
    			add_location(div, file$1, 6, 0, 178);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(post0, div, null);
    			append_dev(div, t0);
    			mount_component(post1, div, null);
    			append_dev(div, t1);
    			mount_component(post2, div, null);
    			append_dev(div, t2);
    			mount_component(post3, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const post0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				post0_changes.$$scope = { dirty, ctx };
    			}

    			post0.$set(post0_changes);
    			const post1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				post1_changes.$$scope = { dirty, ctx };
    			}

    			post1.$set(post1_changes);
    			const post2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				post2_changes.$$scope = { dirty, ctx };
    			}

    			post2.$set(post2_changes);
    			const post3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				post3_changes.$$scope = { dirty, ctx };
    			}

    			post3.$set(post3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(post0.$$.fragment, local);
    			transition_in(post1.$$.fragment, local);
    			transition_in(post2.$$.fragment, local);
    			transition_in(post3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(post0.$$.fragment, local);
    			transition_out(post1.$$.fragment, local);
    			transition_out(post2.$$.fragment, local);
    			transition_out(post3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(post0);
    			destroy_component(post1);
    			destroy_component(post2);
    			destroy_component(post3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AllPosts", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AllPosts> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ RandomDog, CssPractice1, Post });
    	return [];
    }

    class AllPosts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AllPosts",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.35.0 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div3;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let a0;
    	let t3;
    	let a1;
    	let t5;
    	let allposts;
    	let current;
    	allposts = new AllPosts({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Stephen Chung";
    			t1 = space();
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "github";
    			t3 = text("\n         \n        ");
    			a1 = element("a");
    			a1.textContent = "linkedin";
    			t5 = space();
    			create_component(allposts.$$.fragment);
    			add_location(div0, file, 8, 6, 197);
    			attr_dev(a0, "href", "https://www.github.com/imsteev");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-87vs6k");
    			add_location(a0, file, 10, 8, 242);
    			attr_dev(a1, "href", "https://www.linkedin.com/in/imsteev/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-87vs6k");
    			add_location(a1, file, 12, 8, 333);
    			add_location(div1, file, 9, 6, 228);
    			attr_dev(div2, "class", "meta-info-container svelte-87vs6k");
    			add_location(div2, file, 7, 4, 157);
    			attr_dev(div3, "class", "container svelte-87vs6k");
    			add_location(div3, file, 5, 2, 73);
    			attr_dev(main, "class", "svelte-87vs6k");
    			add_location(main, file, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, a0);
    			append_dev(div1, t3);
    			append_dev(div1, a1);
    			append_dev(div3, t5);
    			mount_component(allposts, div3, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(allposts.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(allposts.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(allposts);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ AllPosts });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
