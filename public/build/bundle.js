
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
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
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
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
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
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
        const prop_values = options.props || {};
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
            ? instance(component, prop_values, (i, ret, ...rest) => {
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
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.25.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Tailwindcss.svelte generated by Svelte v3.25.0 */

    function create_fragment(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
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

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tailwindcss", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tailwindcss> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Tailwindcss extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tailwindcss",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/components/Accueil.svelte generated by Svelte v3.25.0 */

    const { console: console_1 } = globals;
    const file = "src/components/Accueil.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (112:2) {#each array as square}
    function create_each_block(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			attr_dev(img, "class", "grass");
    			if (img.src !== (img_src_value = "./img/grass.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "grass");
    			attr_dev(img, "height", "100px");
    			attr_dev(img, "width", "120px");
    			add_location(img, file, 113, 6, 2211);
    			attr_dev(div, "class", div_class_value = "sq-grass " + /*square*/ ctx[4] + " svelte-p5oe7j");
    			add_location(div, file, 112, 4, 2173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(112:2) {#each array as square}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div7;
    	let div6;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div0;
    	let t2;
    	let div3;
    	let img1;
    	let img1_src_value;
    	let t3;
    	let div2;
    	let t5;
    	let div5;
    	let img2;
    	let img2_src_value;
    	let t6;
    	let div4;
    	let t8;
    	let div8;
    	let t9;
    	let img3;
    	let img3_src_value;
    	let t10;
    	let img4;
    	let img4_src_value;
    	let t11;
    	let img5;
    	let img5_src_value;
    	let t12;
    	let img6;
    	let img6_src_value;
    	let t13;
    	let img7;
    	let img7_src_value;
    	let mounted;
    	let dispose;
    	let each_value = /*array*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div6 = element("div");
    			div1 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "HI SCORES";
    			t2 = space();
    			div3 = element("div");
    			img1 = element("img");
    			t3 = space();
    			div2 = element("div");
    			div2.textContent = "NEW GAME";
    			t5 = space();
    			div5 = element("div");
    			img2 = element("img");
    			t6 = space();
    			div4 = element("div");
    			div4.textContent = "OPTIONS";
    			t8 = space();
    			div8 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t9 = space();
    			img3 = element("img");
    			t10 = space();
    			img4 = element("img");
    			t11 = space();
    			img5 = element("img");
    			t12 = space();
    			img6 = element("img");
    			t13 = space();
    			img7 = element("img");
    			attr_dev(img0, "class", "img1 svelte-p5oe7j");
    			if (img0.src !== (img0_src_value = "./img/zombie1.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "zombie-1");
    			attr_dev(img0, "width", "200px");
    			add_location(img0, file, 94, 10, 1502);
    			attr_dev(div0, "class", "m-auto button  svelte-p5oe7j");
    			add_location(div0, file, 95, 10, 1584);
    			attr_dev(div1, "class", "animintro svelte-p5oe7j");
    			add_location(div1, file, 93, 8, 1468);
    			attr_dev(img1, "class", "img2 svelte-p5oe7j");
    			if (img1.src !== (img1_src_value = "./img/zombie3.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "zombie-3");
    			attr_dev(img1, "width", "300px");
    			add_location(img1, file, 98, 10, 1685);
    			attr_dev(div2, "class", "button svelte-p5oe7j");
    			add_location(div2, file, 99, 10, 1767);
    			attr_dev(div3, "class", "animintro svelte-p5oe7j");
    			add_location(div3, file, 97, 8, 1651);
    			attr_dev(img2, "class", "img3 svelte-p5oe7j");
    			if (img2.src !== (img2_src_value = "./img/zombie4.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "zombie-4");
    			attr_dev(img2, "width", "200px");
    			add_location(img2, file, 102, 10, 1905);
    			attr_dev(div4, "class", "button svelte-p5oe7j");
    			add_location(div4, file, 103, 10, 1987);
    			attr_dev(div5, "class", "animintro svelte-p5oe7j");
    			add_location(div5, file, 101, 8, 1870);
    			attr_dev(div6, "class", "trio flex justify-center w-3/5 my-8 mx-auto svelte-p5oe7j");
    			add_location(div6, file, 92, 6, 1402);
    			attr_dev(div7, "class", "manette m-auto w-5/6");
    			add_location(div7, file, 91, 0, 1360);
    			attr_dev(div8, "class", "flex floor");
    			add_location(div8, file, 110, 0, 2118);
    			if (img3.src !== (img3_src_value = "./img/deadtree.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "deadtree");
    			attr_dev(img3, "class", "deadtree");
    			add_location(img3, file, 125, 0, 2418);
    			if (img4.src !== (img4_src_value = "./img/soucoupe.svg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "bullet2");
    			attr_dev(img4, "class", "soucoupe");
    			add_location(img4, file, 126, 0, 2483);
    			if (img5.src !== (img5_src_value = "./img/ufo.svg")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "ufo");
    			attr_dev(img5, "class", "ufo");
    			add_location(img5, file, 127, 0, 2547);
    			if (img6.src !== (img6_src_value = "./img/bullet.svg")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "bullet1");
    			attr_dev(img6, "class", "bullet1");
    			add_location(img6, file, 128, 0, 2597);
    			if (img7.src !== (img7_src_value = "./img/bullet.svg")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "bullet1");
    			attr_dev(img7, "class", "bullet2");
    			add_location(img7, file, 129, 0, 2658);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div6, t2);
    			append_dev(div6, div3);
    			append_dev(div3, img1);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div6, t5);
    			append_dev(div6, div5);
    			append_dev(div5, img2);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div8, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div8, null);
    			}

    			insert_dev(target, t9, anchor);
    			insert_dev(target, img3, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, img4, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, img5, anchor);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, img6, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, img7, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", prevent_default(/*click_handler*/ ctx[2]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*array*/ 2) {
    				each_value = /*array*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div8, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div8);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(img3);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(img4);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(img5);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(img6);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(img7);
    			mounted = false;
    			dispose();
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
    	validate_slots("Accueil", slots, []);
    	let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    	let { newGame } = $$props;
    	const dispatch = createEventDispatcher();
    	console.log(newGame);
    	const writable_props = ["newGame"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Accueil> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, newGame = true);

    	$$self.$$set = $$props => {
    		if ("newGame" in $$props) $$invalidate(0, newGame = $$props.newGame);
    	};

    	$$self.$capture_state = () => ({
    		array,
    		newGame,
    		createEventDispatcher,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ("array" in $$props) $$invalidate(1, array = $$props.array);
    		if ("newGame" in $$props) $$invalidate(0, newGame = $$props.newGame);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [newGame, array, click_handler];
    }

    class Accueil extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { newGame: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Accueil",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*newGame*/ ctx[0] === undefined && !("newGame" in props)) {
    			console_1.warn("<Accueil> was created without expected prop 'newGame'");
    		}
    	}

    	get newGame() {
    		throw new Error("<Accueil>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set newGame(value) {
    		throw new Error("<Accueil>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const nbrLig = writable(52);
    const nbrCol = writable(95);

    const tableau = writable([]);

    const  ligHero = writable(10);
    const  colHero = writable(10);

    /* src/components/tableau/Tableau.svelte generated by Svelte v3.25.0 */
    const file$1 = "src/components/tableau/Tableau.svelte";

    function create_fragment$2(ctx) {
    	let p;
    	let t1;
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Utlisez les touches directionnelles";
    			t1 = space();
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(p, "class", "text-white");
    			add_location(p, file$1, 23, 0, 551);
    			add_location(div, file$1, 24, 0, 613);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
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
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
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
    	let $tableau;
    	let $nbrLig;
    	let $nbrCol;
    	let $ligHero;
    	let $colHero;
    	validate_store(tableau, "tableau");
    	component_subscribe($$self, tableau, $$value => $$invalidate(2, $tableau = $$value));
    	validate_store(nbrLig, "nbrLig");
    	component_subscribe($$self, nbrLig, $$value => $$invalidate(3, $nbrLig = $$value));
    	validate_store(nbrCol, "nbrCol");
    	component_subscribe($$self, nbrCol, $$value => $$invalidate(4, $nbrCol = $$value));
    	validate_store(ligHero, "ligHero");
    	component_subscribe($$self, ligHero, $$value => $$invalidate(5, $ligHero = $$value));
    	validate_store(colHero, "colHero");
    	component_subscribe($$self, colHero, $$value => $$invalidate(6, $colHero = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tableau", slots, ['default']);

    	const createTab = (lig, col, car = 0) => {
    		let tab = [];

    		for (let i = 0; i <= lig; i++) {
    			const ligne = [];

    			for (let y = 0; y <= col; y++) {
    				ligne.push(car);
    			}

    			tab.push(ligne);
    		}

    		return tab;
    	};

    	set_store_value(tableau, $tableau = createTab($nbrLig, $nbrCol));
    	set_store_value(tableau, $tableau[$ligHero][$colHero] = "p", $tableau);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tableau> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		tableau,
    		nbrLig,
    		nbrCol,
    		ligHero,
    		colHero,
    		createTab,
    		$tableau,
    		$nbrLig,
    		$nbrCol,
    		$ligHero,
    		$colHero
    	});

    	return [$$scope, slots];
    }

    class Tableau extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tableau",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/Hero.svelte generated by Svelte v3.25.0 */

    const { console: console_1$1 } = globals;
    const file$2 = "src/components/Hero.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let img;
    	let img_class_value;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			attr_dev(img, "class", img_class_value = "" + (/*feature*/ ctx[0] + /*steps*/ ctx[1] + " svelte-16apf1z"));
    			attr_dev(img, "id", "hero");
    			if (img.src !== (img_src_value = "./resources/space_hero.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$2, 85, 2, 922);
    			attr_dev(div, "class", "hero  svelte-16apf1z");
    			add_location(div, file$2, 84, 0, 900);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*feature, steps*/ 3 && img_class_value !== (img_class_value = "" + (/*feature*/ ctx[0] + /*steps*/ ctx[1] + " svelte-16apf1z"))) {
    				attr_dev(img, "class", img_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	validate_slots("Hero", slots, []);
    	let { feature } = $$props;
    	let { steps } = $$props;
    	console.log(feature, steps);
    	const writable_props = ["feature", "steps"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("feature" in $$props) $$invalidate(0, feature = $$props.feature);
    		if ("steps" in $$props) $$invalidate(1, steps = $$props.steps);
    	};

    	$$self.$capture_state = () => ({ feature, steps });

    	$$self.$inject_state = $$props => {
    		if ("feature" in $$props) $$invalidate(0, feature = $$props.feature);
    		if ("steps" in $$props) $$invalidate(1, steps = $$props.steps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [feature, steps];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { feature: 0, steps: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*feature*/ ctx[0] === undefined && !("feature" in props)) {
    			console_1$1.warn("<Hero> was created without expected prop 'feature'");
    		}

    		if (/*steps*/ ctx[1] === undefined && !("steps" in props)) {
    			console_1$1.warn("<Hero> was created without expected prop 'steps'");
    		}
    	}

    	get feature() {
    		throw new Error("<Hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set feature(value) {
    		throw new Error("<Hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get steps() {
    		throw new Error("<Hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set steps(value) {
    		throw new Error("<Hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/tableau/Case.svelte generated by Svelte v3.25.0 */

    const { console: console_1$2 } = globals;
    const file$3 = "src/components/tableau/Case.svelte";

    // (21:2) {#if idCase === 'p'}
    function create_if_block(ctx) {
    	let hero;
    	let current;

    	hero = new Hero({
    			props: {
    				feature: /*feature*/ ctx[1],
    				steps: /*steps*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(hero.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(hero, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const hero_changes = {};
    			if (dirty & /*feature*/ 2) hero_changes.feature = /*feature*/ ctx[1];
    			if (dirty & /*steps*/ 4) hero_changes.steps = /*steps*/ ctx[2];
    			hero.$set(hero_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hero.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hero.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hero, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(21:2) {#if idCase === 'p'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let td;
    	let td_class_value;
    	let current;
    	let if_block = /*idCase*/ ctx[0] === "p" && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (if_block) if_block.c();
    			attr_dev(td, "class", td_class_value = "border cel " + /*idCase*/ ctx[0] + " border-none" + " svelte-8443iw");
    			add_location(td, file$3, 19, 0, 315);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			if (if_block) if_block.m(td, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*idCase*/ ctx[0] === "p") {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*idCase*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(td, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*idCase*/ 1 && td_class_value !== (td_class_value = "border cel " + /*idCase*/ ctx[0] + " border-none" + " svelte-8443iw")) {
    				attr_dev(td, "class", td_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (if_block) if_block.d();
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
    	validate_slots("Case", slots, []);
    	let { idCase } = $$props;
    	let { feature } = $$props;
    	let { steps } = $$props;

    	onMount(async () => {
    		console.log("dirMount case");
    	});

    	const writable_props = ["idCase", "feature", "steps"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<Case> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("idCase" in $$props) $$invalidate(0, idCase = $$props.idCase);
    		if ("feature" in $$props) $$invalidate(1, feature = $$props.feature);
    		if ("steps" in $$props) $$invalidate(2, steps = $$props.steps);
    	};

    	$$self.$capture_state = () => ({ onMount, Hero, idCase, feature, steps });

    	$$self.$inject_state = $$props => {
    		if ("idCase" in $$props) $$invalidate(0, idCase = $$props.idCase);
    		if ("feature" in $$props) $$invalidate(1, feature = $$props.feature);
    		if ("steps" in $$props) $$invalidate(2, steps = $$props.steps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [idCase, feature, steps];
    }

    class Case extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { idCase: 0, feature: 1, steps: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Case",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*idCase*/ ctx[0] === undefined && !("idCase" in props)) {
    			console_1$2.warn("<Case> was created without expected prop 'idCase'");
    		}

    		if (/*feature*/ ctx[1] === undefined && !("feature" in props)) {
    			console_1$2.warn("<Case> was created without expected prop 'feature'");
    		}

    		if (/*steps*/ ctx[2] === undefined && !("steps" in props)) {
    			console_1$2.warn("<Case> was created without expected prop 'steps'");
    		}
    	}

    	get idCase() {
    		throw new Error("<Case>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set idCase(value) {
    		throw new Error("<Case>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get feature() {
    		throw new Error("<Case>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set feature(value) {
    		throw new Error("<Case>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get steps() {
    		throw new Error("<Case>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set steps(value) {
    		throw new Error("<Case>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/tableau/Level.svelte generated by Svelte v3.25.0 */

    const { console: console_1$3 } = globals;
    const file$4 = "src/components/tableau/Level.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    // (170:10) {#each lig as col}
    function create_each_block_1(ctx) {
    	let case_1;
    	let current;

    	case_1 = new Case({
    			props: {
    				idCase: /*col*/ ctx[17],
    				feature: /*direction*/ ctx[0],
    				steps: /*foot*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(case_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(case_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const case_1_changes = {};
    			if (dirty & /*$tableau*/ 4) case_1_changes.idCase = /*col*/ ctx[17];
    			if (dirty & /*direction*/ 1) case_1_changes.feature = /*direction*/ ctx[0];
    			if (dirty & /*foot*/ 2) case_1_changes.steps = /*foot*/ ctx[1];
    			case_1.$set(case_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(case_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(case_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(case_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(170:10) {#each lig as col}",
    		ctx
    	});

    	return block;
    }

    // (168:6) {#each $tableau as lig}
    function create_each_block$1(ctx) {
    	let tr;
    	let t;
    	let current;
    	let each_value_1 = /*lig*/ ctx[14];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(tr, "class", "ligne");
    			add_location(tr, file$4, 168, 8, 3943);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$tableau, direction, foot*/ 7) {
    				each_value_1 = /*lig*/ ctx[14];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tr, t);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(168:6) {#each $tableau as lig}",
    		ctx
    	});

    	return block;
    }

    // (167:4) <Tableau>
    function create_default_slot(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*$tableau*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$tableau, direction, foot*/ 7) {
    				each_value = /*$tableau*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(167:4) <Tableau>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div1;
    	let div0;
    	let tableau_1;
    	let t;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	tableau_1 = new Tableau({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(tableau_1.$$.fragment);
    			t = space();
    			button = element("button");
    			add_location(button, file$4, 175, 4, 4123);
    			attr_dev(div0, "class", "gamefield border border-black");
    			add_location(div0, file$4, 165, 2, 3847);
    			attr_dev(div1, "class", "flex flex-col justify-around w-full");
    			add_location(div1, file$4, 164, 0, 3795);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(tableau_1, div0, null);
    			append_dev(div0, t);
    			append_dev(div0, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*parseFile*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const tableau_1_changes = {};

    			if (dirty & /*$$scope, $tableau, direction, foot*/ 1048583) {
    				tableau_1_changes.$$scope = { dirty, ctx };
    			}

    			tableau_1.$set(tableau_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tableau_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tableau_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(tableau_1);
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
    	let $ligHero;
    	let $nbrLig;
    	let $tableau;
    	let $colHero;
    	let $nbrCol;
    	validate_store(ligHero, "ligHero");
    	component_subscribe($$self, ligHero, $$value => $$invalidate(8, $ligHero = $$value));
    	validate_store(nbrLig, "nbrLig");
    	component_subscribe($$self, nbrLig, $$value => $$invalidate(9, $nbrLig = $$value));
    	validate_store(tableau, "tableau");
    	component_subscribe($$self, tableau, $$value => $$invalidate(2, $tableau = $$value));
    	validate_store(colHero, "colHero");
    	component_subscribe($$self, colHero, $$value => $$invalidate(10, $colHero = $$value));
    	validate_store(nbrCol, "nbrCol");
    	component_subscribe($$self, nbrCol, $$value => $$invalidate(11, $nbrCol = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Level", slots, []);
    	let down = false;
    	let up = false;
    	let right = false;
    	let left = false;
    	let direction = "down";
    	let foot = 1;

    	onMount(async () => {
    		console.log("didMount Level");
    	}); // $tableau[$ligHero][$colHero] = 'p';

    	let level = [];

    	function parseFile() {
    		// let fileobj = event.target.files[0];
    		let file = new File(["level1.text"], "./level1.txt");

    		console.log(file);
    		let fr = new FileReader();

    		fr.onload = function (event) {
    			level.push(fr.result);
    		};

    		fr.readAsText(file);
    		console.log(index);
    	}

    	const mooveHero = e => {
    		if (e.key === "ArrowDown") {
    			const interval = setInterval(stopFunction, 100);

    			function stopFunction() {
    				if (down === false || $ligHero == $nbrLig) {
    					clearInterval(interval);
    				} else {
    					$$invalidate(0, direction = "down");
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = 0, $tableau);
    					set_store_value(ligHero, $ligHero++, $ligHero);
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = "p", $tableau);

    					if (foot === 3) {
    						$$invalidate(1, foot = 1);
    					} else {
    						$$invalidate(1, foot++, foot);
    					}
    				}
    			}
    		}

    		if (e.key === "ArrowUp") {
    			const interval = setInterval(stopFunction, 100);

    			function stopFunction() {
    				if (up === false || $ligHero == 0) {
    					clearInterval(interval);
    				} else {
    					$$invalidate(0, direction = "up");
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = 0, $tableau);
    					set_store_value(ligHero, $ligHero--, $ligHero);
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = "p", $tableau);

    					if (foot === 3) {
    						$$invalidate(1, foot = 1);
    					} else {
    						$$invalidate(1, foot++, foot);
    					}
    				}
    			}
    		}

    		if (e.key === "ArrowLeft") {
    			const interval = setInterval(stopFunction, 100);

    			function stopFunction() {
    				if (left === false || $colHero == 0) {
    					clearInterval(interval);
    				} else {
    					$$invalidate(0, direction = "left");
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = 0, $tableau);
    					set_store_value(colHero, $colHero--, $colHero);
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = "p", $tableau);

    					if (foot === 3) {
    						$$invalidate(1, foot = 1);
    					} else {
    						$$invalidate(1, foot++, foot);
    					}
    				}
    			}
    		}

    		if (e.key === "ArrowRight") {
    			const interval = setInterval(stopFunction, 100);

    			function stopFunction() {
    				if (right === false || $colHero == $nbrCol) {
    					clearInterval(interval);
    				} else {
    					$$invalidate(0, direction = "right");
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = 0, $tableau);
    					set_store_value(colHero, $colHero++, $colHero);
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = "p", $tableau);

    					if (foot === 3) {
    						$$invalidate(1, foot = 1);
    					} else {
    						$$invalidate(1, foot++, foot);
    					}
    				}
    			}
    		}
    	};

    	document.addEventListener(
    		"keydown",
    		event => {
    			switch (event.key) {
    				case "ArrowDown":
    					if (down) return;
    					down = true;
    					break;
    				case "ArrowUp":
    					if (up) return;
    					up = true;
    					break;
    				case "ArrowLeft":
    					if (left) return;
    					left = true;
    					break;
    				case "ArrowRight":
    					if (right) return;
    					right = true;
    					break;
    			}

    			mooveHero(event);
    		},
    		false
    	);

    	document.addEventListener("keyup", event => {
    		switch (event.key) {
    			case "ArrowDown":
    				down = false;
    				$$invalidate(1, foot = 1);
    				break;
    			case "ArrowUp":
    				up = false;
    				$$invalidate(1, foot = 1);
    				break;
    			case "ArrowLeft":
    				left = false;
    				$$invalidate(1, foot = 1);
    				break;
    			case "ArrowRight":
    				right = false;
    				$$invalidate(1, foot = 1);
    				break;
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<Level> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Tableau,
    		Case,
    		onMount,
    		tableau,
    		ligHero,
    		colHero,
    		nbrLig,
    		nbrCol,
    		down,
    		up,
    		right,
    		left,
    		direction,
    		foot,
    		level,
    		parseFile,
    		mooveHero,
    		$ligHero,
    		$nbrLig,
    		$tableau,
    		$colHero,
    		$nbrCol
    	});

    	$$self.$inject_state = $$props => {
    		if ("down" in $$props) down = $$props.down;
    		if ("up" in $$props) up = $$props.up;
    		if ("right" in $$props) right = $$props.right;
    		if ("left" in $$props) left = $$props.left;
    		if ("direction" in $$props) $$invalidate(0, direction = $$props.direction);
    		if ("foot" in $$props) $$invalidate(1, foot = $$props.foot);
    		if ("level" in $$props) level = $$props.level;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [direction, foot, $tableau, parseFile];
    }

    class Level extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Level",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.25.0 */
    const file$5 = "src/App.svelte";

    // (43:0) {:else}
    function create_else_block(ctx) {
    	let level;
    	let current;
    	level = new Level({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(level.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(level, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(level.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(level.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(level, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:0) {#if !newGame}
    function create_if_block$1(ctx) {
    	let accueil;
    	let updating_newGame;
    	let current;

    	function accueil_newGame_binding(value) {
    		/*accueil_newGame_binding*/ ctx[4].call(null, value);
    	}

    	let accueil_props = {};

    	if (/*newGame*/ ctx[0] !== void 0) {
    		accueil_props.newGame = /*newGame*/ ctx[0];
    	}

    	accueil = new Accueil({ props: accueil_props, $$inline: true });
    	binding_callbacks.push(() => bind(accueil, "newGame", accueil_newGame_binding));

    	const block = {
    		c: function create() {
    			create_component(accueil.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(accueil, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const accueil_changes = {};

    			if (!updating_newGame && dirty & /*newGame*/ 1) {
    				updating_newGame = true;
    				accueil_changes.newGame = /*newGame*/ ctx[0];
    				add_flush_callback(() => updating_newGame = false);
    			}

    			accueil.$set(accueil_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accueil.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accueil.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(accueil, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(41:0) {#if !newGame}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let tailwindcss;
    	let t0;
    	let div1;
    	let div0;
    	let p;
    	let t2;
    	let audio;
    	let track;
    	let audio_src_value;
    	let t3;
    	let img;
    	let img_src_value;
    	let t4;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	tailwindcss = new Tailwindcss({ $$inline: true });
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*newGame*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(tailwindcss.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			p = element("p");
    			p.textContent = "ZOMBAV";
    			t2 = space();
    			audio = element("audio");
    			track = element("track");
    			t3 = space();
    			img = element("img");
    			t4 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr_dev(p, "class", "title svelte-14cf9x0");
    			add_location(p, file$5, 32, 76, 777);
    			attr_dev(div0, "class", "title text-6xl text-center svelte-14cf9x0");
    			add_location(div0, file$5, 32, 2, 703);
    			attr_dev(track, "kind", "captions");
    			add_location(track, file$5, 34, 4, 863);
    			attr_dev(audio, "id", "player");
    			if (audio.src !== (audio_src_value = "./audio/laylow.mp3")) attr_dev(audio, "src", audio_src_value);
    			add_location(audio, file$5, 33, 2, 813);
    			attr_dev(img, "id", "mute");
    			attr_dev(img, "class", "h-16 w-16 absolute m-8 left-0 top-0");
    			if (img.src !== (img_src_value = /*src*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "volume");
    			add_location(img, file$5, 36, 2, 901);
    			attr_dev(div1, "class", "header  relative w-full");
    			add_location(div1, file$5, 31, 0, 663);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tailwindcss, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(div1, t2);
    			append_dev(div1, audio);
    			append_dev(audio, track);
    			append_dev(div1, t3);
    			append_dev(div1, img);
    			insert_dev(target, t4, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(img, "click", /*handleAudio*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*src*/ 2 && img.src !== (img_src_value = /*src*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tailwindcss.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tailwindcss.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tailwindcss, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t4);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots("App", slots, []);
    	let newGame = true;
    	let src = "./img/mute.svg";
    	let muted = true;

    	function handleAudio() {
    		var Player = document.getElementById("player");

    		if (muted == true) {
    			Player.play();
    			$$invalidate(1, src = "./img/volume.svg");
    		} else {
    			Player.pause();
    			$$invalidate(1, src = "./img/mute.svg");
    		}

    		muted = !muted;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, newGame = false);

    	function accueil_newGame_binding(value) {
    		newGame = value;
    		$$invalidate(0, newGame);
    	}

    	$$self.$capture_state = () => ({
    		Tailwindcss,
    		Accueil,
    		Level,
    		newGame,
    		src,
    		muted,
    		handleAudio
    	});

    	$$self.$inject_state = $$props => {
    		if ("newGame" in $$props) $$invalidate(0, newGame = $$props.newGame);
    		if ("src" in $$props) $$invalidate(1, src = $$props.src);
    		if ("muted" in $$props) muted = $$props.muted;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [newGame, src, handleAudio, click_handler, accueil_newGame_binding];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
