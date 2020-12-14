
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
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
            throw new Error('Function called outside component initialization');
        return current_component;
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
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
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
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.0' }, detail)));
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

    class EventHub {

        static listeners = {};
        static logEvents = true;

        static listen(event, handler) {
            if (typeof handler !== "function") {
                return;
            }
            if (typeof this.listeners[event] === "undefined") {
                this.listeners[event] = [];
            }
            this.listeners[event].push(handler);
        }

        static trigger(event, data) {
            if (typeof data !== "object") {
                data = {
                    value : data
                };
            }
            if (this.logEvents) {
                console.log("EventHub >> " + String(event));
                console.log(data);
            }
            for (let handler of (this.listeners[event] || [])) {
                try {
                    handler(Object.assign({}, data));
                }catch(e) {
                    console.log("Error while handling event " + String(event));
                    console.log(e);
                }
            }
        }
    }

    const ClientEvent = Object.freeze({
        DICE_INFO : Symbol("dice-info"),
        ROLL_DICE : Symbol("roll-dice")
    });

    const DiceEvent = Object.freeze({
        // Self entered a room
        ROOM_ENTERED : Symbol("room-entered"),
        // Another user entered the room
        ROOM_USER_JOIN : Symbol("room-usr-join"),
        // Another user left the room
        ROOM_USER_LEAVE : Symbol("room-user-leave"),
    });

    const NetworkEvent = Object.freeze({
        NETWORK_CONNECTING : Symbol("network-connecting"),
        NETWORK_CONNECTED : Symbol("network-connected"),
        NETWORK_UNAVAILABLE : Symbol("network-unavailable"),
        NETWORK_FAILED : Symbol("network-failed"),
        NETWORK_DISCONNECTED : Symbol("network-disconnected")
    });

    function symbolToString(symbol) {
        let tmp = String(symbol);
        if (tmp.indexOf("Symbol(") === 0) {
            tmp = tmp.substr(7, tmp.length - 8);
        }
        return tmp;
    }

    class Network {

        pusherLibrary = "https://js.pusher.com/7.0/pusher.min.js";
        client = null;
        channel = null;
        settings = {
            authEndpoint : "",
            appKey : "",
            appCluster : "eu"
        };

        constructor(settings) {
            for (let opt in this.settings) {
                this.settings[opt] = settings[opt] ?? this.settings[opt];
            }
            this.injectPusher();
        }

        injectPusher() {
            let script = document.createElement("script");
            script.src = this.pusherLibrary;
            document.head.append(script);
        }

        initialize(name) {
            if (!window.Pusher) {
                return;
            }

            this.client = new Pusher(this.settings.appKey, {
                cluster : this.settings.appCluster,
                authEndpoint : this.settings.authEndpoint,
                auth : {
                    params : {
                        name : name
                    }
                }
            });
            this.client.connection.bind("error", this.handleConnectionError.bind(this));
            this.client.connection.bind("state_change", this.handleConnectionStateChange.bind(this));
        }

        connect(roomId, name) {
            this.disconnect();
            this.initialize(name);
            roomId = ("presence-" + roomId).toLowerCase().replace(/[^a-z0-9-_]/g, "");
            this.channel = this.client.subscribe(roomId);
            this.channel.bind("pusher:subscription_succeeded", (data) => {
                EventHub.trigger(DiceEvent.ROOM_ENTERED, data);
            });
            this.channel.bind("pusher:subscription_error", (error) => {
                EventHub.trigger(NetworkEvent.NETWORK_FAILED);
                this.log("subscription error on " + roomId, error);
            });

            this.channel.bind("pusher:member_added", (data) => {
                EventHub.trigger(DiceEvent.ROOM_USER_JOIN, data);
            });

            this.channel.bind("pusher:member_removed", (data) => {
                EventHub.trigger(DiceEvent.ROOM_USER_LEAVE, data);
            });

            for (let event in ClientEvent) {
                let eventName = "client-" + symbolToString(ClientEvent[event]);
                this.channel.bind(eventName, ((event) => {
                    return (data, metadata) => {
                        data.sender = metadata.user_id;
                        EventHub.trigger(event, data);
                    }
                })(ClientEvent[event]));
                this.log("subscribed to " + eventName);
            }
            return roomId;
        }

        disconnect() {
            if (this.channel) {
                this.channel.unsubscribe();
                this.channel.disconnect();
                this.channel = null;
            }
            if (this.client) {
                this.client.disconnect();
            }
        }

        send(event, data, sender) {
            if (!this.channel || !this.channel.subscribed) {
                return;
            }
            let eventName = symbolToString(event);
            if (eventName.indexOf("client-") !== 0) {
                eventName = "client-" + eventName;
            }
            this.channel.trigger(eventName, data);
            if (sender) {
                data.sender = sender;
                EventHub.trigger(event, data);
            }
        }

        handleConnectionStateChange(states) {
            this.log("connection state change", states);
            switch(states.current) {
                case "connecting":
                    EventHub.trigger(NetworkEvent.NETWORK_CONNECTING);
                    break;
                case "connected":
                    EventHub.trigger(NetworkEvent.NETWORK_CONNECTED);
                    break;
                case "disconnected":
                    EventHub.trigger(NetworkEvent.NETWORK_DISCONNECTED);
                    this.channel = null;
                    break;
                case "failed":
                    EventHub.trigger(NetworkEvent.NETWORK_FAILED);
                    this.channel = null;
                    break;
                case "unavailable":
                    EventHub.trigger(NetworkEvent.NETWORK_UNAVAILABLE);
                    this.channel = null;
                    break;
            }
        }

        handleConnectionError(error) {
            this.log("error", error);
            if (error.error.data.code === 4004) {
                // pusher connection limit reached
                this.log("connection limit reached");
            }
            EventHub.trigger(NetworkEvent.NETWORK_FAILED);
        }

        log(msg, o) {
            console.log("pusher >> " + msg);
            if (o) {
                console.log(o);
            }
        }
    }

    class DicePusher {

        room = "";
        self = {
            id : 0,
            info : {},
            firstUser : false
        };
        users = {};
        userlist = [];
        dices = [];
        rolls = [];
        status = DicePusherStatus.SETUP;
        network = null;

        constructor(settings) {
            this.setupListeners();
            this.network = new Network(settings.network || {});
            this.status = DicePusherStatus.READY;
            this.updated();
        }

        joinRoom(room, name) {
            this.room = this.network.connect(room, name);
        }

        leaveRoom() {
            this.network.disconnect();
        }

        roll(dice) {
            dice = dice || 0;
            if (this.dices[dice] === this.self.id) {
                // allowed to roll
                let eyes = Math.floor(Math.random() * 6) + 1;
                // get the next user
                let i = 0;
                for (; i < this.userlist.length; i++) {
                    if (this.userlist[i].id === this.self.id) {
                        break;
                    }
                }
                i++;
                if (i >= this.userlist.length) {
                    i = 0;
                }

                this.network.send(ClientEvent.ROLL_DICE, {
                    dice : dice,
                    eyes : eyes,
                    next : this.userlist[i].id
                }, this.self.id);
                return eyes;
            }
            return 0;
        }

        addDice() {
            this.dices.push(this.self.id);
            this.sendDiceInfo();
            this.updated();
            return this.self.id;
        }

        canRoll() {
            let availableDices = [];
            for (let i = 0; i < this.dices.length; i++) {
                if (this.dices[i] === this.self.id){
                    availableDices.push(i);
                }
            }
            return availableDices;
        }

        sendDiceInfo() {
            this.network.send(ClientEvent.DICE_INFO, {
                dices : this.dices.slice()
            });
        }

        updateUserList() {
            this.userlist.length = 0;
            for (let id in this.users) {
                this.userlist.push(this.users[id]);
            }
            this.userlist.sort((a, b) => {
                if (a.id > b.id) {
                    return 1;
                }
                if (a.id < b.id) {
                    return -1;
                }
                return 0;
            });
            this.updated();
        }

        updated() {
            // Send a generic update event for ui frameworks
            document.body.dispatchEvent(new Event("dice-pusher-updated"));
        }

        setupListeners() {
            window.addEventListener("beforeunload", () => {
                this.leaveRoom();
                return null;
            });

            EventHub.listen(NetworkEvent.NETWORK_CONNECTED, () => {
                this.status = DicePusherStatus.CONNECTING;
                this.updated();
            });
            EventHub.listen(NetworkEvent.NETWORK_DISCONNECTED, () => {
                this.status = DicePusherStatus.READY;
                this.updated();
            });
            EventHub.listen(NetworkEvent.NETWORK_FAILED, () => {
                this.status = DicePusherStatus.ERROR;
                this.updated();
            });
            EventHub.listen(NetworkEvent.NETWORK_UNAVAILABLE, () => {
                this.status = DicePusherStatus.ERROR;
                this.updated();
            });


            EventHub.listen(DiceEvent.ROOM_ENTERED, (data) => {
                this.status = DicePusherStatus.CONNECTED;
                if (data.me) {
                    this.self = data.me;
                }
                if (data.members) {
                    this.users = {};
                    for (let id in data.members) {
                        this.users[id] = data.members[id] || {};
                        this.users[id].id = id;
                    }
                }
                this.updateUserList();

                if (this.userlist.length === 1) {
                    // first user
                    this.self.firstUser = true;
                    this.dices = [this.self.id];
                }

                this.forwardEvent(DiceEvent.ROOM_ENTERED, this.users);
            });
            EventHub.listen(DiceEvent.ROOM_USER_JOIN, (data) => {
                this.users[data.id] = data.info;
                this.users[data.id].id = data.id;

                // The first user in the current user list will send the recent dice list
                if (this.self.id === this.userlist[0].id) {
                    this.sendDiceInfo();
                }

                this.updateUserList();
                this.forwardEvent(DiceEvent.ROOM_USER_JOIN, this.users);
            });
            EventHub.listen(DiceEvent.ROOM_USER_LEAVE, (data) => {
                delete this.users[data.id];
                
                if (this.userlist.length === 1) {
                    // last remaining user becomes first user
                    this.firstUser = true;
                }
                
                this.updateUserList();
                this.forwardEvent(DiceEvent.ROOM_USER_LEAVE, this.users);
            });

            EventHub.listen(ClientEvent.DICE_INFO, (data) => {
                this.dices = data.dices.slice();
                this.updated();
                this.forwardEvent(ClientEvent.DICE_INFO, data);
            });

            EventHub.listen(ClientEvent.ROLL_DICE, (data) => {
                this.rolls.push(data);
                this.dices[data.dice] = data.next;
                this.updated();
                this.forwardEvent(ClientEvent.ROLL_DICE, data);
            });
        }

        forwardEvent(event, data) {
            // forward the event to document.body
            if (!document.body) {
                return;
            }
            document.body.dispatchEvent(new Event(symbolToString(event), data));
        }
    }

    const DicePusherStatus = Object.freeze({
        // The initial status at start up
        SETUP : Symbol("setup"),
        // The status once everything is ready to join a room
        READY : Symbol("ready"),
        // The status while trying to enter a room
        CONNECTING : Symbol("connecting"),
        // The status once inside a room
        CONNECTED : Symbol("connected"),
        // The status entered if there is a problem
        ERROR : Symbol("error")
    });

    /* src\shared\Card.svelte generated by Svelte v3.31.0 */

    const file = "src\\shared\\Card.svelte";

    function create_fragment(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "card svelte-n8gmda");
    			add_location(div, file, 0, 0, 0);
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
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Card", slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src\components\Header.svelte generated by Svelte v3.31.0 */

    const file$1 = "src\\components\\Header.svelte";

    function create_fragment$1(ctx) {
    	let header;
    	let img;
    	let img_src_value;
    	let t0;
    	let h1;

    	const block = {
    		c: function create() {
    			header = element("header");
    			img = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Let's roll together!";
    			if (img.src !== (img_src_value = "../img/cody.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Cody rolls");
    			attr_dev(img, "class", "svelte-txuxrt");
    			add_location(img, file$1, 1, 4, 14);
    			attr_dev(h1, "class", "svelte-txuxrt");
    			add_location(h1, file$1, 3, 4, 66);
    			attr_dev(header, "class", "svelte-txuxrt");
    			add_location(header, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, img);
    			append_dev(header, t0);
    			append_dev(header, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
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

    /* src\components\Footer.svelte generated by Svelte v3.31.0 */

    const file$2 = "src\\components\\Footer.svelte";

    function create_fragment$2(ctx) {
    	let footer;
    	let div;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			div.textContent = "Nicole Heinze - 2020";
    			attr_dev(div, "class", "copyright svelte-7gpmal");
    			add_location(div, file$2, 1, 4, 14);
    			attr_dev(footer, "class", "svelte-7gpmal");
    			add_location(footer, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
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

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\status\Error.svelte generated by Svelte v3.31.0 */

    const { Error: Error_1 } = globals;
    const file$3 = "src\\components\\status\\Error.svelte";

    function create_fragment$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "An Error Occured";
    			add_location(div, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
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

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Error", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Error> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Error$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Error",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\status\Setup.svelte generated by Svelte v3.31.0 */
    const file$4 = "src\\components\\status\\Setup.svelte";

    function create_fragment$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Setting up...";
    			add_location(div, file$4, 5, 0, 79);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	validate_slots("Setup", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Setup> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ update_keyed_each });
    	return [];
    }

    class Setup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Setup",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\shared\Button.svelte generated by Svelte v3.31.0 */

    const file$5 = "src\\shared\\Button.svelte";

    function create_fragment$5(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*type*/ ctx[0]) + " svelte-13uk50i"));
    			toggle_class(button, "flat", /*flat*/ ctx[1]);
    			toggle_class(button, "inverse", /*inverse*/ ctx[2]);
    			add_location(button, file$5, 8, 0, 123);
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
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*type*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty(/*type*/ ctx[0]) + " svelte-13uk50i"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*type, flat*/ 3) {
    				toggle_class(button, "flat", /*flat*/ ctx[1]);
    			}

    			if (dirty & /*type, inverse*/ 5) {
    				toggle_class(button, "inverse", /*inverse*/ ctx[2]);
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
    	let { type = "primary" } = $$props;
    	let { flat = true } = $$props;
    	let { inverse = false } = $$props;
    	const writable_props = ["type", "flat", "inverse"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    		if ("flat" in $$props) $$invalidate(1, flat = $$props.flat);
    		if ("inverse" in $$props) $$invalidate(2, inverse = $$props.inverse);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ type, flat, inverse });

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    		if ("flat" in $$props) $$invalidate(1, flat = $$props.flat);
    		if ("inverse" in $$props) $$invalidate(2, inverse = $$props.inverse);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, flat, inverse, $$scope, slots, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { type: 0, flat: 1, inverse: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flat() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flat(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\status\Join.svelte generated by Svelte v3.31.0 */
    const file$6 = "src\\components\\status\\Join.svelte";

    // (43:12) <Button  type="secondary">
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tritt ein");
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
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(43:12) <Button  type=\\\"secondary\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let h3;
    	let t1;
    	let div3;
    	let form;
    	let div2;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let div0;
    	let t5;
    	let t6;
    	let label1;
    	let t8;
    	let input1;
    	let t9;
    	let div1;
    	let t10;
    	let t11;
    	let br;
    	let t12;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				type: "secondary",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "Willkommen beim Accso Wichtelgewusel";
    			t1 = space();
    			div3 = element("div");
    			form = element("form");
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "Raum";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div0 = element("div");
    			t5 = text(/*errorMessage*/ ctx[1]);
    			t6 = space();
    			label1 = element("label");
    			label1.textContent = "Dein Name";
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			div1 = element("div");
    			t10 = text(/*errorMessageName*/ ctx[2]);
    			t11 = space();
    			br = element("br");
    			t12 = space();
    			create_component(button.$$.fragment);
    			add_location(h3, file$6, 29, 0, 803);
    			attr_dev(label0, "for", "room-id");
    			attr_dev(label0, "class", "svelte-l9wtqe");
    			add_location(label0, file$6, 34, 12, 962);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Fancy-room-name");
    			attr_dev(input0, "class", "svelte-l9wtqe");
    			add_location(input0, file$6, 35, 12, 1009);
    			attr_dev(div0, "class", "error svelte-l9wtqe");
    			add_location(div0, file$6, 36, 12, 1106);
    			attr_dev(label1, "for", "room-id");
    			attr_dev(label1, "class", "svelte-l9wtqe");
    			add_location(label1, file$6, 38, 12, 1163);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Dicey McDiceface");
    			attr_dev(input1, "class", "svelte-l9wtqe");
    			add_location(input1, file$6, 39, 12, 1215);
    			attr_dev(div1, "class", "error svelte-l9wtqe");
    			add_location(div1, file$6, 40, 12, 1315);
    			add_location(br, file$6, 41, 12, 1374);
    			attr_dev(div2, "class", "join");
    			add_location(div2, file$6, 33, 8, 930);
    			add_location(form, file$6, 32, 4, 873);
    			add_location(div3, file$6, 31, 0, 852);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, form);
    			append_dev(form, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t3);
    			append_dev(div2, input0);
    			set_input_value(input0, /*credentials*/ ctx[0].roomName);
    			append_dev(div2, t4);
    			append_dev(div2, div0);
    			append_dev(div0, t5);
    			append_dev(div2, t6);
    			append_dev(div2, label1);
    			append_dev(div2, t8);
    			append_dev(div2, input1);
    			set_input_value(input1, /*credentials*/ ctx[0].playerName);
    			append_dev(div2, t9);
    			append_dev(div2, div1);
    			append_dev(div1, t10);
    			append_dev(div2, t11);
    			append_dev(div2, br);
    			append_dev(div2, t12);
    			mount_component(button, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(form, "submit", prevent_default(/*submitHandler*/ ctx[3]), false, true, false),
    					listen_dev(div3, "submit", /*submit_handler*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*credentials*/ 1 && input0.value !== /*credentials*/ ctx[0].roomName) {
    				set_input_value(input0, /*credentials*/ ctx[0].roomName);
    			}

    			if (!current || dirty & /*errorMessage*/ 2) set_data_dev(t5, /*errorMessage*/ ctx[1]);

    			if (dirty & /*credentials*/ 1 && input1.value !== /*credentials*/ ctx[0].playerName) {
    				set_input_value(input1, /*credentials*/ ctx[0].playerName);
    			}

    			if (!current || dirty & /*errorMessageName*/ 4) set_data_dev(t10, /*errorMessageName*/ ctx[2]);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			destroy_component(button);
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
    	validate_slots("Join", slots, []);
    	let dispatch = createEventDispatcher();
    	let { credentials = { roomName: "", playerName: "" } } = $$props;
    	let errorMessage = "";
    	let errorMessageName = "";
    	let valid = false;

    	const submitHandler = () => {
    		valid = true;

    		if (credentials.roomName.trim().length < 3) {
    			$$invalidate(1, errorMessage = "Der Raum name ist zu kurz...");
    			valid = false;
    		}

    		if (credentials.playerName.trim().length < 1) {
    			$$invalidate(2, errorMessageName = "Hast du keinen Namen?");
    			valid = false;
    		}

    		if (valid) {
    			$$invalidate(1, errorMessage = "");
    			dispatch("joinRoom", credentials);
    		}
    	};

    	const writable_props = ["credentials"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Join> was created with unknown prop '${key}'`);
    	});

    	function submit_handler(event) {
    		bubble($$self, event);
    	}

    	function input0_input_handler() {
    		credentials.roomName = this.value;
    		$$invalidate(0, credentials);
    	}

    	function input1_input_handler() {
    		credentials.playerName = this.value;
    		$$invalidate(0, credentials);
    	}

    	$$self.$$set = $$props => {
    		if ("credentials" in $$props) $$invalidate(0, credentials = $$props.credentials);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Button,
    		dispatch,
    		credentials,
    		errorMessage,
    		errorMessageName,
    		valid,
    		submitHandler
    	});

    	$$self.$inject_state = $$props => {
    		if ("dispatch" in $$props) dispatch = $$props.dispatch;
    		if ("credentials" in $$props) $$invalidate(0, credentials = $$props.credentials);
    		if ("errorMessage" in $$props) $$invalidate(1, errorMessage = $$props.errorMessage);
    		if ("errorMessageName" in $$props) $$invalidate(2, errorMessageName = $$props.errorMessageName);
    		if ("valid" in $$props) valid = $$props.valid;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		credentials,
    		errorMessage,
    		errorMessageName,
    		submitHandler,
    		submit_handler,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Join extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { credentials: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Join",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get credentials() {
    		throw new Error("<Join>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set credentials(value) {
    		throw new Error("<Join>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.31.0 */

    const { Error: Error_1$1, console: console_1 } = globals;
    const file$7 = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    // (109:2) {#if dicepusher.self.firstUser === true}
    function create_if_block_6(ctx) {
    	let button;
    	let t;
    	let br;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*addDice*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    			t = space();
    			br = element("br");
    			add_location(br, file$7, 110, 3, 2997);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, br, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8388608) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(109:2) {#if dicepusher.self.firstUser === true}",
    		ctx
    	});

    	return block;
    }

    // (110:3) <Button on:click={addDice}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Add Dice");
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
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(110:3) <Button on:click={addDice}>",
    		ctx
    	});

    	return block;
    }

    // (115:2) {#each eventslog as event}
    function create_each_block_3(ctx) {
    	let span;
    	let t0_value = /*event*/ ctx[20].message + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "class", "svelte-1imh6u0");
    			add_location(span, file$7, 115, 3, 3075);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*eventslog*/ 4 && t0_value !== (t0_value = /*event*/ ctx[20].message + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(115:2) {#each eventslog as event}",
    		ctx
    	});

    	return block;
    }

    // (130:61) 
    function create_if_block_3(ctx) {
    	let h3;
    	let t0;
    	let t1_value = /*dicepusher*/ ctx[0].room + "";
    	let t1;
    	let t2;
    	let div0;
    	let t3;
    	let div1;
    	let br0;
    	let t4;
    	let b;
    	let br1;
    	let t6;
    	let current;
    	let each_value_2 = /*dices*/ ctx[3];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*dicepusher*/ ctx[0].userlist;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Room ");
    			t1 = text(t1_value);
    			t2 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			div1 = element("div");
    			br0 = element("br");
    			t4 = space();
    			b = element("b");
    			b.textContent = "Spieler:innen";
    			br1 = element("br");
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$7, 130, 2, 3456);
    			add_location(div0, file$7, 131, 3, 3491);
    			add_location(br0, file$7, 147, 3, 3916);
    			add_location(b, file$7, 148, 3, 3924);
    			add_location(br1, file$7, 148, 23, 3944);
    			add_location(div1, file$7, 146, 2, 3907);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div0, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, br0);
    			append_dev(div1, t4);
    			append_dev(div1, b);
    			append_dev(div1, br1);
    			append_dev(div1, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*dicepusher*/ 1) && t1_value !== (t1_value = /*dicepusher*/ ctx[0].room + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*lastRolls, dices, handleRoll*/ 74) {
    				each_value_2 = /*dices*/ ctx[3];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*dices, dicepusher*/ 9) {
    				each_value = /*dicepusher*/ ctx[0].userlist;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div0);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(130:61) ",
    		ctx
    	});

    	return block;
    }

    // (128:57) 
    function create_if_block_2(ctx) {
    	let join;
    	let current;
    	join = new Join({ $$inline: true });
    	join.$on("joinRoom", /*joinHandler*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(join.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(join, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(join.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(join.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(join, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(128:57) ",
    		ctx
    	});

    	return block;
    }

    // (126:57) 
    function create_if_block_1(ctx) {
    	let error;
    	let current;
    	error = new Error$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(error.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(error, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(error.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(error.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(error, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(126:57) ",
    		ctx
    	});

    	return block;
    }

    // (124:1) {#if dicepusher.status ===  DicePusherStatus.SETUP}
    function create_if_block(ctx) {
    	let setup;
    	let current;
    	setup = new Setup({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(setup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(setup, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(setup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(setup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(setup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(124:1) {#if dicepusher.status ===  DicePusherStatus.SETUP}",
    		ctx
    	});

    	return block;
    }

    // (139:6) {:else}
    function create_else_block(ctx) {
    	let p;
    	let t0_value = /*die*/ ctx[15].user.name + "";
    	let t0;
    	let br;
    	let t1;
    	let t2;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			br = element("br");
    			t1 = text("ist dran.");
    			t2 = space();
    			img = element("img");
    			add_location(br, file$7, 139, 25, 3764);
    			add_location(p, file$7, 139, 7, 3746);
    			if (img.src !== (img_src_value = "../img/" + (/*lastRolls*/ ctx[1][/*die*/ ctx[15].id] || 1) + ".gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Dice");
    			add_location(img, file$7, 140, 7, 3789);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, br);
    			append_dev(p, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dices*/ 8 && t0_value !== (t0_value = /*die*/ ctx[15].user.name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*lastRolls, dices*/ 10 && img.src !== (img_src_value = "../img/" + (/*lastRolls*/ ctx[1][/*die*/ ctx[15].id] || 1) + ".gif")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(139:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (136:6) {#if die.yourTurn}
    function create_if_block_5(ctx) {
    	let p;
    	let b;
    	let t0;
    	let br;
    	let t1;
    	let t2;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*die*/ ctx[15]);
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			t0 = text("Du");
    			br = element("br");
    			t1 = text("bist dran!");
    			t2 = space();
    			img = element("img");
    			add_location(br, file$7, 136, 15, 3601);
    			add_location(b, file$7, 136, 10, 3596);
    			add_location(p, file$7, 136, 7, 3593);
    			if (img.src !== (img_src_value = "../img/" + (/*lastRolls*/ ctx[1][/*die*/ ctx[15].id] || 1) + ".gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Dice");
    			add_location(img, file$7, 137, 7, 3631);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, b);
    			append_dev(b, t0);
    			append_dev(b, br);
    			append_dev(b, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*lastRolls, dices*/ 10 && img.src !== (img_src_value = "../img/" + (/*lastRolls*/ ctx[1][/*die*/ ctx[15].id] || 1) + ".gif")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(136:6) {#if die.yourTurn}",
    		ctx
    	});

    	return block;
    }

    // (134:4) <Card>
    function create_default_slot$1(ctx) {
    	let div;
    	let t;

    	function select_block_type_1(ctx, dirty) {
    		if (/*die*/ ctx[15].yourTurn) return create_if_block_5;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			t = space();
    			attr_dev(div, "class", "diespace svelte-1imh6u0");
    			add_location(div, file$7, 134, 5, 3538);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(134:4) <Card>",
    		ctx
    	});

    	return block;
    }

    // (133:4) {#each dices as die}
    function create_each_block_2(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope, lastRolls, dices*/ 8388618) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(133:4) {#each dices as die}",
    		ctx
    	});

    	return block;
    }

    // (153:5) {#if die.user.id === player.id}
    function create_if_block_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("🎲");
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
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(153:5) {#if die.user.id === player.id}",
    		ctx
    	});

    	return block;
    }

    // (152:4) {#each dices as die}
    function create_each_block_1(ctx) {
    	let if_block_anchor;
    	let if_block = /*die*/ ctx[15].user.id === /*player*/ ctx[12].id && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*die*/ ctx[15].user.id === /*player*/ ctx[12].id) {
    				if (if_block) ; else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(152:4) {#each dices as die}",
    		ctx
    	});

    	return block;
    }

    // (150:3) {#each dicepusher.userlist as player}
    function create_each_block(ctx) {
    	let t0_value = /*player*/ ctx[12].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let br;
    	let each_value_1 = /*dices*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			br = element("br");
    			add_location(br, file$7, 156, 4, 4113);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dicepusher*/ 1 && t0_value !== (t0_value = /*player*/ ctx[12].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*dices, dicepusher*/ 9) {
    				each_value_1 = /*dices*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t2.parentNode, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(150:3) {#each dicepusher.userlist as player}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let header;
    	let t0;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let main;
    	let div2;
    	let current_block_type_index;
    	let if_block1;
    	let t3;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });
    	let if_block0 = /*dicepusher*/ ctx[0].self.firstUser === true && create_if_block_6(ctx);
    	let each_value_3 = /*eventslog*/ ctx[2];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*dicepusher*/ ctx[0].status === DicePusherStatus.SETUP) return 0;
    		if (/*dicepusher*/ ctx[0].status === DicePusherStatus.ERROR) return 1;
    		if (/*dicepusher*/ ctx[0].status === DicePusherStatus.READY) return 2;
    		if (/*dicepusher*/ ctx[0].status === DicePusherStatus.CONNECTED) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			main = element("main");
    			div2 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div0, "class", "setting svelte-1imh6u0");
    			add_location(div0, file$7, 107, 1, 2881);
    			attr_dev(div1, "class", "eventlog svelte-1imh6u0");
    			add_location(div1, file$7, 113, 1, 3019);
    			attr_dev(div2, "class", "gamearea svelte-1imh6u0");
    			add_location(div2, file$7, 122, 1, 3141);
    			attr_dev(main, "class", "svelte-1imh6u0");
    			add_location(main, file$7, 121, 0, 3133);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			if (if_block0) if_block0.m(div0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div2, null);
    			}

    			insert_dev(target, t3, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*dicepusher*/ ctx[0].self.firstUser === true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*dicepusher*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_6(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*eventslog*/ 4) {
    				each_value_3 = /*eventslog*/ ctx[2];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block1) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block1 = if_blocks[current_block_type_index];

    					if (!if_block1) {
    						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block1.c();
    					} else {
    						if_block1.p(ctx, dirty);
    					}

    					transition_in(if_block1, 1);
    					if_block1.m(div2, null);
    				} else {
    					if_block1 = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(main);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching) detach_dev(t3);
    			destroy_component(footer, detaching);
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

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let credentials = { roomName: "", playerName: "" };

    	document.body.addEventListener("dice-pusher-updated", () => {
    		$$invalidate(0, dicepusher);
    		console.log("Updated DicePusher");
    		console.log("Users: ");
    	});

    	EventHub.listen(ClientEvent.ROLL_DICE, roll => {
    		$$invalidate(1, lastRolls[roll.dice] = roll.eyes, lastRolls);
    		console.log("Last Rolls: " + lastRolls);
    		blockedDice[roll.dice] = true;

    		window.setTimeout(
    			() => {
    				blockedDice[roll.dice] = false;
    			},
    			2500
    		);
    	});

    	EventHub.listen(DiceEvent.ROOM_USER_JOIN, user => {
    		console.log("User Joined Room: " + user.info.name);
    		console.log("Current users: ");
    		logEvent(user.info.name + " ist dem Raum beigetreten");
    		playerList = [];

    		dicepusher.userlist.map(user => {
    			let tmp = {};
    			tmp.id = user.id;
    			tmp.name = user.name || "anonymous?";
    			playerList.push(tmp);
    			console.log("\n" + tmp.name);
    		});

    		let newUser = {};
    		newUser.id = user.info.id;
    		newUser.name = user.info.name;
    		playerList.push(newUser);
    	});

    	EventHub.listen(DiceEvent.ROOM_USER_LEAVE, user => {
    		console.log("User Left Room: " + user.info.name);
    	});

    	const logEvent = s => {
    		eventslog.unshift({ id: eventslog.length, message: s });
    		$$invalidate(2, eventslog);
    		console.log(eventslog);
    	};

    	const joinHandler = e => {
    		credentials = e.detail;
    		console.log("User " + credentials.playerName + " is joining room " + credentials.roomName);
    		dicepusher.joinRoom(credentials.roomName, credentials.playerName);
    		console.log("DicePusher: " + dicepusher);
    	};

    	const addDice = () => {
    		dicepusher.addDice();
    		lastRolls.push(1);
    	};

    	const handleRoll = diceId => {
    		logEvent("click");

    		if (!blockedDice[diceId]) {
    			dicepusher.roll(diceId);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = die => handleRoll(die.id);

    	$$self.$capture_state = () => ({
    		DicePusher,
    		DicePusherStatus,
    		Card,
    		Header,
    		Footer,
    		Error: Error$1,
    		Setup,
    		Join,
    		Button,
    		EventHub,
    		ClientEvent,
    		DiceEvent,
    		credentials,
    		logEvent,
    		joinHandler,
    		addDice,
    		handleRoll,
    		dicepusher,
    		lastRolls,
    		blockedDice,
    		playerList,
    		eventslog,
    		dices
    	});

    	$$self.$inject_state = $$props => {
    		if ("credentials" in $$props) credentials = $$props.credentials;
    		if ("dicepusher" in $$props) $$invalidate(0, dicepusher = $$props.dicepusher);
    		if ("lastRolls" in $$props) $$invalidate(1, lastRolls = $$props.lastRolls);
    		if ("blockedDice" in $$props) blockedDice = $$props.blockedDice;
    		if ("playerList" in $$props) playerList = $$props.playerList;
    		if ("eventslog" in $$props) $$invalidate(2, eventslog = $$props.eventslog);
    		if ("dices" in $$props) $$invalidate(3, dices = $$props.dices);
    	};

    	let dicepusher;
    	let lastRolls;
    	let blockedDice;
    	let playerList;
    	let eventslog;
    	let dices;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*dicepusher*/ 1) {
    			 $$invalidate(3, dices = dicepusher.dices.map((diceHolder, diceId) => {
    				let tmp = {};
    				tmp.id = diceId;
    				tmp.user = dicepusher.users[diceHolder];
    				tmp.yourTurn = false;

    				if (tmp.user && tmp.user.id === dicepusher.self.id) {
    					tmp.yourTurn = true;
    				}

    				return tmp;
    			}));
    		}
    	};

    	 $$invalidate(0, dicepusher = new DicePusher({
    			network: {
    				authEndpoint: "http://gheist.net/api/pusher/auth/generic/presence/1098358",
    				appKey: "d209ebf4ad2e3647739c"
    			}
    		}));

    	 $$invalidate(1, lastRolls = [1]);
    	 blockedDice = [];
    	 playerList = [];
    	 $$invalidate(2, eventslog = []);

    	return [
    		dicepusher,
    		lastRolls,
    		eventslog,
    		dices,
    		joinHandler,
    		addDice,
    		handleRoll,
    		click_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
