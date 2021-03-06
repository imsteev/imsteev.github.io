
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

    /* src/common/Tldr.svelte generated by Svelte v3.35.0 */

    const file$d = "src/common/Tldr.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "tldr-container svelte-16fqwvl");
    			add_location(div, file$d, 0, 0, 0);
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tldr", slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tldr> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Tldr extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tldr",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/posts/Post.svelte generated by Svelte v3.35.0 */

    const file$c = "src/posts/Post.svelte";

    function create_fragment$c(ctx) {
    	let div4;
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let div3;
    	let t4;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(/*date*/ ctx[0]);
    			t3 = space();
    			div3 = element("div");
    			t4 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "title svelte-t7o56v");
    			add_location(div0, file$c, 7, 4, 121);
    			add_location(div1, file$c, 8, 4, 158);
    			attr_dev(div2, "class", "header-title svelte-t7o56v");
    			add_location(div2, file$c, 6, 2, 90);
    			attr_dev(div3, "class", "svelte-t7o56v");
    			add_location(div3, file$c, 10, 2, 187);
    			attr_dev(div4, "class", "post-container svelte-t7o56v");
    			add_location(div4, file$c, 5, 0, 59);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div4, t4);

    			if (default_slot) {
    				default_slot.m(div4, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);
    			if (!current || dirty & /*date*/ 1) set_data_dev(t2, /*date*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
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
    			if (detaching) detach_dev(div4);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Post", slots, ['default']);
    	let { date } = $$props;
    	let { title } = $$props;
    	const writable_props = ["date", "title"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Post> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("date" in $$props) $$invalidate(0, date = $$props.date);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ date, title });

    	$$self.$inject_state = $$props => {
    		if ("date" in $$props) $$invalidate(0, date = $$props.date);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [date, title, $$scope, slots];
    }

    class Post extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { date: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Post",
    			options,
    			id: create_fragment$c.name
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
    }

    /* src/posts/PostLexicalScope.svelte generated by Svelte v3.35.0 */
    const file$b = "src/posts/PostLexicalScope.svelte";

    // (42:2) <Tldr>
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("tl;dr: Lexical scope is just an umbrella phrase for \"the scope that\n    Javascript determines at compile time\", which unfortunately sounds like \"it\n    depends\".");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(42:2) <Tldr>",
    		ctx
    	});

    	return block;
    }

    // (6:0) <Post date="March 14, 2021" title="Lexical scope in Javascript">
    function create_default_slot$6(ctx) {
    	let p0;
    	let t1;
    	let div0;
    	let span;
    	let t3;
    	let p1;
    	let t4;
    	let a;
    	let t6;
    	let strong;
    	let t8;
    	let t9;
    	let div1;
    	let t10;
    	let italic0;
    	let t12;
    	let italic1;
    	let t14;
    	let italic2;
    	let t16;
    	let italic3;
    	let t18;
    	let t19;
    	let tldr;
    	let current;

    	tldr = new Tldr({
    			props: {
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "For the longest time, I didn't understand what \"lexical scope\" in Javascript\n    meant; it's dictionary definition does not reveal much information in\n    relation to Javascript (at first):";
    			t1 = space();
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "relating to the words or vocabulary of a language";
    			t3 = space();
    			p1 = element("p");
    			t4 = text("What does this even mean?! After sifting through the Internet, ");
    			a = element("a");
    			a.textContent = "I finally found a solid explanation";
    			t6 = text("\n    that considers why \"lexical\" is used in the first place. Essentially,\n    ");
    			strong = element("strong");
    			strong.textContent = "lexical scope is the set of reachable variables defined at compile time\n      from a given scope";
    			t8 = text(".");
    			t9 = space();
    			div1 = element("div");
    			t10 = text("Javascript recognizes two types of scopes: global and function. Global scope\n    is accessible from any scope in a script. Function scope consists of those\n    variables defined within a function itself. If you have a function called\n    ");
    			italic0 = element("italic");
    			italic0.textContent = "inner()";
    			t12 = text("\n    defined in a function called\n    ");
    			italic1 = element("italic");
    			italic1.textContent = "outer()";
    			t14 = text("\n    ,\n    ");
    			italic2 = element("italic");
    			italic2.textContent = "inner()";
    			t16 = text("\n    would be able to use variables defined in the lexical scope of\n    ");
    			italic3 = element("italic");
    			italic3.textContent = "outer()";
    			t18 = text(".");
    			t19 = space();
    			create_component(tldr.$$.fragment);
    			add_location(p0, file$b, 6, 2, 167);
    			attr_dev(span, "class", "definition svelte-17fuod7");
    			add_location(span, file$b, 12, 4, 384);
    			add_location(div0, file$b, 11, 2, 374);
    			attr_dev(a, "href", "https://astronautweb.co/javascript-lexical-scope/");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$b, 17, 67, 560);
    			add_location(strong, file$b, 22, 4, 771);
    			add_location(p1, file$b, 16, 2, 489);
    			attr_dev(italic0, "class", "svelte-17fuod7");
    			add_location(italic0, file$b, 32, 4, 1156);
    			attr_dev(italic1, "class", "svelte-17fuod7");
    			add_location(italic1, file$b, 34, 4, 1218);
    			attr_dev(italic2, "class", "svelte-17fuod7");
    			add_location(italic2, file$b, 36, 4, 1253);
    			attr_dev(italic3, "class", "svelte-17fuod7");
    			add_location(italic3, file$b, 38, 4, 1349);
    			add_location(div1, file$b, 28, 2, 908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, span);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t4);
    			append_dev(p1, a);
    			append_dev(p1, t6);
    			append_dev(p1, strong);
    			append_dev(p1, t8);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t10);
    			append_dev(div1, italic0);
    			append_dev(div1, t12);
    			append_dev(div1, italic1);
    			append_dev(div1, t14);
    			append_dev(div1, italic2);
    			append_dev(div1, t16);
    			append_dev(div1, italic3);
    			append_dev(div1, t18);
    			insert_dev(target, t19, anchor);
    			mount_component(tldr, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tldr_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tldr_changes.$$scope = { dirty, ctx };
    			}

    			tldr.$set(tldr_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tldr.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tldr.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t19);
    			destroy_component(tldr, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(6:0) <Post date=\\\"March 14, 2021\\\" title=\\\"Lexical scope in Javascript\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let post;
    	let current;

    	post = new Post({
    			props: {
    				date: "March 14, 2021",
    				title: "Lexical scope in Javascript",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(post.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(post, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const post_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				post_changes.$$scope = { dirty, ctx };
    			}

    			post.$set(post_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(post.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(post.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(post, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PostLexicalScope", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PostLexicalScope> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Tldr, Post });
    	return [];
    }

    class PostLexicalScope extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PostLexicalScope",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/common/Flex.svelte generated by Svelte v3.35.0 */

    const file$a = "src/common/Flex.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let div_style_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();

    			attr_dev(div, "style", div_style_value = /*justifyContent*/ ctx[0]
    			? `justify-content: ${/*justifyContent*/ ctx[0]}`
    			: "");

    			attr_dev(div, "class", "svelte-1ku14pv");
    			add_location(div, file$a, 4, 0, 49);
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
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*justifyContent*/ 1 && div_style_value !== (div_style_value = /*justifyContent*/ ctx[0]
    			? `justify-content: ${/*justifyContent*/ ctx[0]}`
    			: "")) {
    				attr_dev(div, "style", div_style_value);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Flex", slots, ['default']);
    	let { justifyContent } = $$props;
    	const writable_props = ["justifyContent"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Flex> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("justifyContent" in $$props) $$invalidate(0, justifyContent = $$props.justifyContent);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ justifyContent });

    	$$self.$inject_state = $$props => {
    		if ("justifyContent" in $$props) $$invalidate(0, justifyContent = $$props.justifyContent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [justifyContent, $$scope, slots];
    }

    class Flex extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { justifyContent: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Flex",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*justifyContent*/ ctx[0] === undefined && !("justifyContent" in props)) {
    			console.warn("<Flex> was created without expected prop 'justifyContent'");
    		}
    	}

    	get justifyContent() {
    		throw new Error("<Flex>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set justifyContent(value) {
    		throw new Error("<Flex>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/common/Button.svelte generated by Svelte v3.35.0 */

    const file$9 = "src/common/Button.svelte";

    function create_fragment$9(ctx) {
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
    			add_location(button, file$9, 4, 0, 42);
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { onClick: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$9.name
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

    /* src/posts/PostCSSPractice.svelte generated by Svelte v3.35.0 */
    const file$8 = "src/posts/PostCSSPractice.svelte";

    // (11:4) <Button onClick={() => (isPlaying = !isPlaying)}>
    function create_default_slot_2$1(ctx) {
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
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(11:4) <Button onClick={() => (isPlaying = !isPlaying)}>",
    		ctx
    	});

    	return block;
    }

    // (14:4) <Flex>
    function create_default_slot_1$1(ctx) {
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
    			add_location(p0, file$8, 14, 6, 394);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(`box animate-${/*isPlaying*/ ctx[0]}`) + " svelte-g0szgt"));
    			attr_dev(div0, "id", "animation-1");
    			add_location(div0, file$8, 15, 6, 435);
    			add_location(p1, file$8, 16, 6, 501);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`box animate-${/*isPlaying*/ ctx[0]}`) + " svelte-g0szgt"));
    			attr_dev(div1, "id", "animation-2");
    			add_location(div1, file$8, 17, 6, 533);
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
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(14:4) <Flex>",
    		ctx
    	});

    	return block;
    }

    // (9:0) <Post title="CSS Practice" date="August 30, 2020" enclosedTitle>
    function create_default_slot$5(ctx) {
    	let div;
    	let button;
    	let t;
    	let flex;
    	let current;

    	button = new Button({
    			props: {
    				onClick: /*func*/ ctx[1],
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	flex = new Flex({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
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
    			add_location(div, file$8, 9, 2, 244);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			append_dev(div, t);
    			mount_component(flex, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
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
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    			destroy_component(flex);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(9:0) <Post title=\\\"CSS Practice\\\" date=\\\"August 30, 2020\\\" enclosedTitle>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let post;
    	let current;

    	post = new Post({
    			props: {
    				title: "CSS Practice",
    				date: "August 30, 2020",
    				enclosedTitle: true,
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(post.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(post, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const post_changes = {};

    			if (dirty & /*$$scope, isPlaying*/ 5) {
    				post_changes.$$scope = { dirty, ctx };
    			}

    			post.$set(post_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(post.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(post.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(post, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let isPlaying;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PostCSSPractice", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PostCSSPractice> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(0, isPlaying = !isPlaying);
    	$$self.$capture_state = () => ({ Flex, Button, Post, isPlaying });

    	$$self.$inject_state = $$props => {
    		if ("isPlaying" in $$props) $$invalidate(0, isPlaying = $$props.isPlaying);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, isPlaying = false);
    	return [isPlaying, func];
    }

    class PostCSSPractice extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PostCSSPractice",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/posts/PostShibaGenerator.svelte generated by Svelte v3.35.0 */
    const file$7 = "src/posts/PostShibaGenerator.svelte";

    // (32:2) <Button onClick={randomDogRefresh}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("another shiba");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(32:2) <Button onClick={randomDogRefresh}>",
    		ctx
    	});

    	return block;
    }

    // (37:6) {:else}
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
    		source: "(37:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (35:6) {#if !loadingDog}
    function create_if_block(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "alt", "random-shiba");
    			if (img.src !== (img_src_value = /*randomDogUrl*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1mty4t6");
    			add_location(img, file$7, 35, 8, 877);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*randomDogUrl*/ 1 && img.src !== (img_src_value = /*randomDogUrl*/ ctx[0])) {
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
    		source: "(35:6) {#if !loadingDog}",
    		ctx
    	});

    	return block;
    }

    // (33:2) <Flex>
    function create_default_slot_1(ctx) {
    	let figure;

    	function select_block_type(ctx, dirty) {
    		if (!/*loadingDog*/ ctx[1]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			if_block.c();
    			attr_dev(figure, "style", { padding: 0, margin: "1rem 0" });
    			add_location(figure, file$7, 33, 4, 795);
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
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(33:2) <Flex>",
    		ctx
    	});

    	return block;
    }

    // (31:0) <Post title="Shiba Generator" date="August 31, 2020" enclosedTitle>
    function create_default_slot$4(ctx) {
    	let button;
    	let t;
    	let flex;
    	let current;

    	button = new Button({
    			props: {
    				onClick: /*randomDogRefresh*/ ctx[2],
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	flex = new Flex({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    			t = space();
    			create_component(flex.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(flex, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const flex_changes = {};

    			if (dirty & /*$$scope, randomDogUrl, loadingDog*/ 11) {
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
    			destroy_component(button, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(flex, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(31:0) <Post title=\\\"Shiba Generator\\\" date=\\\"August 31, 2020\\\" enclosedTitle>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let post;
    	let current;

    	post = new Post({
    			props: {
    				title: "Shiba Generator",
    				date: "August 31, 2020",
    				enclosedTitle: true,
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(post.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(post, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const post_changes = {};

    			if (dirty & /*$$scope, randomDogUrl, loadingDog*/ 11) {
    				post_changes.$$scope = { dirty, ctx };
    			}

    			post.$set(post_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(post.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(post.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(post, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const randomShibaUrl = "https://dog.ceo/api/breed/shiba/images/random";

    function instance$7($$self, $$props, $$invalidate) {
    	let randomDogUrl;
    	let loadingDog;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PostShibaGenerator", slots, []);

    	const randomDogRefresh = () => {
    		$$invalidate(1, loadingDog = true);

    		fetch(randomShibaUrl, {}).then(resp => {
    			if (!resp.ok) {
    				throw "Request failed";
    			}

    			return resp.json();
    		}).then(jsonResp => $$invalidate(0, randomDogUrl = jsonResp.message)).finally(() => {
    			$$invalidate(1, loadingDog = false);
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PostShibaGenerator> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Post,
    		Flex,
    		Button,
    		randomShibaUrl,
    		randomDogRefresh,
    		randomDogUrl,
    		loadingDog
    	});

    	$$self.$inject_state = $$props => {
    		if ("randomDogUrl" in $$props) $$invalidate(0, randomDogUrl = $$props.randomDogUrl);
    		if ("loadingDog" in $$props) $$invalidate(1, loadingDog = $$props.loadingDog);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, randomDogUrl = "");
    	$$invalidate(1, loadingDog = false);

    	{
    		randomDogRefresh();
    	}

    	return [randomDogUrl, loadingDog, randomDogRefresh];
    }

    class PostShibaGenerator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PostShibaGenerator",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/posts/PostUnrest.svelte generated by Svelte v3.35.0 */
    const file$6 = "src/posts/PostUnrest.svelte";

    // (5:0) <Post date="May 31, 2020" title="Unrest" enclosedTitle>
    function create_default_slot$3(ctx) {
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
    			p0.textContent = "Reflecting on my upbringing, I grew up in a sheltered, educated, and diverse\n    neighborhood. For this reason, I don't feel entitled to the conviction that\n    the world is feeling. But I am hurt. I am angry, I am confused, I am\n    baffled, I am tired.";
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
    			li3.textContent = "How can someone watch these events of police brutality events happening\n      and say \"this is just an accident\"?";
    			t19 = space();
    			li4 = element("li");
    			li4.textContent = "How can we redefine justice?";
    			t21 = space();
    			li5 = element("li");
    			strong3 = element("strong");
    			strong3.textContent = "Why would a cop put a knee on someone's neck for 8 minutes and 46\n        seconds?";
    			t23 = space();
    			p2 = element("p");
    			p2.textContent = "I urge everyone to reflect and ask themselves these questions, and I hope\n    you feel as troubled as I do.";
    			add_location(p0, file$6, 5, 2, 114);
    			add_location(strong0, file$6, 13, 33, 424);
    			add_location(strong1, file$6, 14, 4, 460);
    			add_location(strong2, file$6, 14, 33, 489);
    			add_location(p1, file$6, 12, 2, 387);
    			add_location(li0, file$6, 18, 4, 551);
    			add_location(li1, file$6, 19, 4, 612);
    			add_location(li2, file$6, 20, 4, 667);
    			add_location(li3, file$6, 21, 4, 725);
    			add_location(li4, file$6, 25, 4, 864);
    			add_location(strong3, file$6, 27, 6, 917);
    			add_location(li5, file$6, 26, 4, 906);
    			add_location(ul, file$6, 17, 2, 542);
    			add_location(p2, file$6, 34, 2, 1054);
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
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(5:0) <Post date=\\\"May 31, 2020\\\" title=\\\"Unrest\\\" enclosedTitle>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let post;
    	let current;

    	post = new Post({
    			props: {
    				date: "May 31, 2020",
    				title: "Unrest",
    				enclosedTitle: true,
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(post.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(post, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const post_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				post_changes.$$scope = { dirty, ctx };
    			}

    			post.$set(post_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(post.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(post.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(post, detaching);
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
    	validate_slots("PostUnrest", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PostUnrest> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Post });
    	return [];
    }

    class PostUnrest extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PostUnrest",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/posts/PostV2.svelte generated by Svelte v3.35.0 */
    const file$5 = "src/posts/PostV2.svelte";

    // (5:0) <Post date="August 29, 2020" title="v2" enclosedTitle>
    function create_default_slot$2(ctx) {
    	let p0;
    	let t1;
    	let p1;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "I previously implemented my personal website using Vue.js, but it quickly\n    became hard to maintain without a proper component structure. So I rewrote\n    this site with React since I'm more familiar with it now than I am with\n    Vue.js.";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "Hopefully the ease of modifying content will encourage me to write more\n    often.";
    			add_location(p0, file$5, 5, 2, 113);
    			add_location(p1, file$5, 11, 2, 371);
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
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(5:0) <Post date=\\\"August 29, 2020\\\" title=\\\"v2\\\" enclosedTitle>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let post;
    	let current;

    	post = new Post({
    			props: {
    				date: "August 29, 2020",
    				title: "v2",
    				enclosedTitle: true,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(post.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(post, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const post_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				post_changes.$$scope = { dirty, ctx };
    			}

    			post.$set(post_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(post.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(post.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(post, detaching);
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
    	validate_slots("PostV2", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PostV2> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Post });
    	return [];
    }

    class PostV2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PostV2",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/posts/PostV3.svelte generated by Svelte v3.35.0 */
    const file$4 = "src/posts/PostV3.svelte";

    // (5:0) <Post title="v3" date="March 14, 2021" enclosedTitle>
    function create_default_slot$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "I ported the site implemention from React to Svelte. I realized there was no\n    need for a heavy application library like React since this site is more or\n    less static. Svelte's role as both a compiler and a framework is pretty\n    compelling to me and so I'm looking forward to using this platform as a\n    playground for arbitrary content.";
    			add_location(p, file$4, 5, 2, 112);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(5:0) <Post title=\\\"v3\\\" date=\\\"March 14, 2021\\\" enclosedTitle>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let post;
    	let current;

    	post = new Post({
    			props: {
    				title: "v3",
    				date: "March 14, 2021",
    				enclosedTitle: true,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(post.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(post, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const post_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				post_changes.$$scope = { dirty, ctx };
    			}

    			post.$set(post_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(post.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(post.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(post, detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PostV3", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PostV3> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Post });
    	return [];
    }

    class PostV3 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PostV3",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/posts/PostThoughtsOnGoodCode.svelte generated by Svelte v3.35.0 */
    const file$3 = "src/posts/PostThoughtsOnGoodCode.svelte";

    // (5:0) <Post title="Good code should have" date="April 22nd, 2021" enclosedTitle>
    function create_default_slot(ctx) {
    	let ul;
    	let li0;
    	let t1;
    	let li1;
    	let t3;
    	let li2;
    	let t5;
    	let li3;
    	let t7;
    	let li4;
    	let t9;
    	let li5;
    	let t11;
    	let li6;

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "thoughtful naming";
    			t1 = space();
    			li1 = element("li");
    			li1.textContent = "comments when necessary";
    			t3 = space();
    			li2 = element("li");
    			li2.textContent = "comments when in doubt";
    			t5 = space();
    			li3 = element("li");
    			li3.textContent = "not overly DRY (\"don't repeat yourself\")";
    			t7 = space();
    			li4 = element("li");
    			li4.textContent = "effective abstractions";
    			t9 = space();
    			li5 = element("li");
    			li5.textContent = "effective separation of concerns";
    			t11 = space();
    			li6 = element("li");
    			li6.textContent = "keyed arguments instead of several positional ones";
    			add_location(li0, file$3, 6, 4, 142);
    			add_location(li1, file$3, 7, 4, 173);
    			add_location(li2, file$3, 8, 4, 210);
    			add_location(li3, file$3, 9, 4, 246);
    			add_location(li4, file$3, 10, 4, 300);
    			add_location(li5, file$3, 11, 4, 336);
    			add_location(li6, file$3, 12, 4, 382);
    			add_location(ul, file$3, 5, 2, 133);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(ul, t7);
    			append_dev(ul, li4);
    			append_dev(ul, t9);
    			append_dev(ul, li5);
    			append_dev(ul, t11);
    			append_dev(ul, li6);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(5:0) <Post title=\\\"Good code should have\\\" date=\\\"April 22nd, 2021\\\" enclosedTitle>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let post;
    	let current;

    	post = new Post({
    			props: {
    				title: "Good code should have",
    				date: "April 22nd, 2021",
    				enclosedTitle: true,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(post.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(post, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const post_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				post_changes.$$scope = { dirty, ctx };
    			}

    			post.$set(post_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(post.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(post.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(post, detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PostThoughtsOnGoodCode", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PostThoughtsOnGoodCode> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Post });
    	return [];
    }

    class PostThoughtsOnGoodCode extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PostThoughtsOnGoodCode",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/posts/AllPosts.svelte generated by Svelte v3.35.0 */
    const file$2 = "src/posts/AllPosts.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let postthoughtsongoodcode;
    	let t2;
    	let postlexicalscope;
    	let t3;
    	let postv3;
    	let t4;
    	let postshibagenerator;
    	let t5;
    	let postcsspractice;
    	let t6;
    	let postv2;
    	let t7;
    	let postunrest;
    	let current;
    	postthoughtsongoodcode = new PostThoughtsOnGoodCode({ $$inline: true });
    	postlexicalscope = new PostLexicalScope({ $$inline: true });
    	postv3 = new PostV3({ $$inline: true });
    	postshibagenerator = new PostShibaGenerator({ $$inline: true });
    	postcsspractice = new PostCSSPractice({ $$inline: true });
    	postv2 = new PostV2({ $$inline: true });
    	postunrest = new PostUnrest({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Thoughts and experiments";
    			t1 = space();
    			create_component(postthoughtsongoodcode.$$.fragment);
    			t2 = space();
    			create_component(postlexicalscope.$$.fragment);
    			t3 = space();
    			create_component(postv3.$$.fragment);
    			t4 = space();
    			create_component(postshibagenerator.$$.fragment);
    			t5 = space();
    			create_component(postcsspractice.$$.fragment);
    			t6 = space();
    			create_component(postv2.$$.fragment);
    			t7 = space();
    			create_component(postunrest.$$.fragment);
    			attr_dev(h1, "class", "svelte-15dlnjf");
    			add_location(h1, file$2, 11, 2, 410);
    			attr_dev(div, "class", "svelte-15dlnjf");
    			add_location(div, file$2, 10, 0, 402);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			mount_component(postthoughtsongoodcode, div, null);
    			append_dev(div, t2);
    			mount_component(postlexicalscope, div, null);
    			append_dev(div, t3);
    			mount_component(postv3, div, null);
    			append_dev(div, t4);
    			mount_component(postshibagenerator, div, null);
    			append_dev(div, t5);
    			mount_component(postcsspractice, div, null);
    			append_dev(div, t6);
    			mount_component(postv2, div, null);
    			append_dev(div, t7);
    			mount_component(postunrest, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(postthoughtsongoodcode.$$.fragment, local);
    			transition_in(postlexicalscope.$$.fragment, local);
    			transition_in(postv3.$$.fragment, local);
    			transition_in(postshibagenerator.$$.fragment, local);
    			transition_in(postcsspractice.$$.fragment, local);
    			transition_in(postv2.$$.fragment, local);
    			transition_in(postunrest.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(postthoughtsongoodcode.$$.fragment, local);
    			transition_out(postlexicalscope.$$.fragment, local);
    			transition_out(postv3.$$.fragment, local);
    			transition_out(postshibagenerator.$$.fragment, local);
    			transition_out(postcsspractice.$$.fragment, local);
    			transition_out(postv2.$$.fragment, local);
    			transition_out(postunrest.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(postthoughtsongoodcode);
    			destroy_component(postlexicalscope);
    			destroy_component(postv3);
    			destroy_component(postshibagenerator);
    			destroy_component(postcsspractice);
    			destroy_component(postv2);
    			destroy_component(postunrest);
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
    	validate_slots("AllPosts", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AllPosts> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		PostLexicalScope,
    		PostCssPractice: PostCSSPractice,
    		PostShibaGenerator,
    		PostUnrest,
    		PostV2,
    		PostV3,
    		PostThoughtsOnGoodCode
    	});

    	return [];
    }

    class AllPosts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AllPosts",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Header.svelte generated by Svelte v3.35.0 */

    const file$1 = "src/Header.svelte";

    function create_fragment$1(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let a0;
    	let t3;
    	let a1;
    	let t5;
    	let a2;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "steev";
    			t1 = space();
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "github";
    			t3 = space();
    			a1 = element("a");
    			a1.textContent = "linkedin";
    			t5 = space();
    			a2 = element("a");
    			a2.textContent = "feedback";
    			add_location(div0, file$1, 1, 2, 36);
    			attr_dev(a0, "href", "https://www.github.com/imsteev");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-bohrws");
    			add_location(a0, file$1, 3, 4, 65);
    			attr_dev(a1, "href", "https://www.linkedin.com/in/imsteev/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-bohrws");
    			add_location(a1, file$1, 4, 4, 137);
    			attr_dev(a2, "href", "https://www.github.com/imsteev/imsteev.github.io/issues/new");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "svelte-bohrws");
    			add_location(a2, file$1, 7, 4, 229);
    			add_location(div1, file$1, 2, 2, 55);
    			attr_dev(div2, "class", "meta-info-container svelte-bohrws");
    			add_location(div2, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, a0);
    			append_dev(div1, t3);
    			append_dev(div1, a1);
    			append_dev(div1, t5);
    			append_dev(div1, a2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
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

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.35.0 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div;
    	let metaheader;
    	let t;
    	let allposts;
    	let current;
    	metaheader = new Header({ $$inline: true });
    	allposts = new AllPosts({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			create_component(metaheader.$$.fragment);
    			t = space();
    			create_component(allposts.$$.fragment);
    			attr_dev(div, "class", "container svelte-14bgnqi");
    			add_location(div, file, 6, 2, 123);
    			attr_dev(main, "class", "svelte-14bgnqi");
    			add_location(main, file, 5, 0, 114);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(metaheader, div, null);
    			append_dev(div, t);
    			mount_component(allposts, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(metaheader.$$.fragment, local);
    			transition_in(allposts.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(metaheader.$$.fragment, local);
    			transition_out(allposts.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(metaheader);
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

    	$$self.$capture_state = () => ({ AllPosts, MetaHeader: Header });
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
