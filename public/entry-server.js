import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import * as React from "react";
import React__default, { createContext, useState, useRef, useMemo, useEffect, useContext } from "react";
import { FunctionsClient } from "@supabase/functions-js";
import { PostgrestClient } from "@supabase/postgrest-js";
import { RealtimeClient } from "@supabase/realtime-js";
import { StorageClient } from "@supabase/storage-js";
import nodeFetch, { Headers as Headers$1 } from "@supabase/node-fetch";
import { AuthClient } from "@supabase/auth-js";
import "cookie";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X, Flame, ArrowRight, Zap, Target, DollarSign, TrendingUp, Code, Briefcase, Trophy, CheckCircle, Users, Coins, BarChart3, PieChart, Shield, Github, ChevronLeft, ChevronRight, Check, Circle, User, Wallet, LogOut, LayoutDashboard, BookOpen, Lock, ChevronDown, Play, Menu, Clock, ChevronUp, Loader2, Mail, Globe, MapPin, Building, Linkedin, Save } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTheme } from "next-themes";
import { Toaster as Toaster$2, toast as toast$1 } from "sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useLocation, useNavigate, Link, Outlet, useParams, Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import ReactMarkdown from "react-markdown";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as SelectPrimitive from "@radix-ui/react-select";
const version = "2.56.0";
let JS_ENV = "";
if (typeof Deno !== "undefined") {
  JS_ENV = "deno";
} else if (typeof document !== "undefined") {
  JS_ENV = "web";
} else if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
  JS_ENV = "react-native";
} else {
  JS_ENV = "node";
}
const DEFAULT_HEADERS = { "X-Client-Info": `supabase-js-${JS_ENV}/${version}` };
const DEFAULT_GLOBAL_OPTIONS = {
  headers: DEFAULT_HEADERS
};
const DEFAULT_DB_OPTIONS = {
  schema: "public"
};
const DEFAULT_AUTH_OPTIONS = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  flowType: "implicit"
};
const DEFAULT_REALTIME_OPTIONS = {};
var __awaiter$2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const resolveFetch = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = nodeFetch;
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
const resolveHeadersConstructor = () => {
  if (typeof Headers === "undefined") {
    return Headers$1;
  }
  return Headers;
};
const fetchWithAuth = (supabaseKey, getAccessToken, customFetch) => {
  const fetch2 = resolveFetch(customFetch);
  const HeadersConstructor = resolveHeadersConstructor();
  return (input, init) => __awaiter$2(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (_a = yield getAccessToken()) !== null && _a !== void 0 ? _a : supabaseKey;
    let headers = new HeadersConstructor(init === null || init === void 0 ? void 0 : init.headers);
    if (!headers.has("apikey")) {
      headers.set("apikey", supabaseKey);
    }
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return fetch2(input, Object.assign(Object.assign({}, init), { headers }));
  });
};
var __awaiter$1 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function ensureTrailingSlash(url) {
  return url.endsWith("/") ? url : url + "/";
}
function applySettingDefaults(options, defaults) {
  var _a, _b;
  const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions } = options;
  const { db: DEFAULT_DB_OPTIONS2, auth: DEFAULT_AUTH_OPTIONS2, realtime: DEFAULT_REALTIME_OPTIONS2, global: DEFAULT_GLOBAL_OPTIONS2 } = defaults;
  const result = {
    db: Object.assign(Object.assign({}, DEFAULT_DB_OPTIONS2), dbOptions),
    auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS2), authOptions),
    realtime: Object.assign(Object.assign({}, DEFAULT_REALTIME_OPTIONS2), realtimeOptions),
    storage: {},
    global: Object.assign(Object.assign(Object.assign({}, DEFAULT_GLOBAL_OPTIONS2), globalOptions), { headers: Object.assign(Object.assign({}, (_a = DEFAULT_GLOBAL_OPTIONS2 === null || DEFAULT_GLOBAL_OPTIONS2 === void 0 ? void 0 : DEFAULT_GLOBAL_OPTIONS2.headers) !== null && _a !== void 0 ? _a : {}), (_b = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.headers) !== null && _b !== void 0 ? _b : {}) }),
    accessToken: () => __awaiter$1(this, void 0, void 0, function* () {
      return "";
    })
  };
  if (options.accessToken) {
    result.accessToken = options.accessToken;
  } else {
    delete result.accessToken;
  }
  return result;
}
class SupabaseAuthClient extends AuthClient {
  constructor(options) {
    super(options);
  }
}
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class SupabaseClient {
  /**
   * Create a new client for use in the browser.
   * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
   * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
   * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
   * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
   * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
   * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
   * @param options.realtime Options passed along to realtime-js constructor.
   * @param options.storage Options passed along to the storage-js constructor.
   * @param options.global.fetch A custom fetch implementation.
   * @param options.global.headers Any additional headers to send with each network request.
   */
  constructor(supabaseUrl, supabaseKey, options) {
    var _a, _b, _c;
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    if (!supabaseUrl)
      throw new Error("supabaseUrl is required.");
    if (!supabaseKey)
      throw new Error("supabaseKey is required.");
    const _supabaseUrl = ensureTrailingSlash(supabaseUrl);
    const baseUrl = new URL(_supabaseUrl);
    this.realtimeUrl = new URL("realtime/v1", baseUrl);
    this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws");
    this.authUrl = new URL("auth/v1", baseUrl);
    this.storageUrl = new URL("storage/v1", baseUrl);
    this.functionsUrl = new URL("functions/v1", baseUrl);
    const defaultStorageKey = `sb-${baseUrl.hostname.split(".")[0]}-auth-token`;
    const DEFAULTS = {
      db: DEFAULT_DB_OPTIONS,
      realtime: DEFAULT_REALTIME_OPTIONS,
      auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS), { storageKey: defaultStorageKey }),
      global: DEFAULT_GLOBAL_OPTIONS
    };
    const settings = applySettingDefaults(options !== null && options !== void 0 ? options : {}, DEFAULTS);
    this.storageKey = (_a = settings.auth.storageKey) !== null && _a !== void 0 ? _a : "";
    this.headers = (_b = settings.global.headers) !== null && _b !== void 0 ? _b : {};
    if (!settings.accessToken) {
      this.auth = this._initSupabaseAuthClient((_c = settings.auth) !== null && _c !== void 0 ? _c : {}, this.headers, settings.global.fetch);
    } else {
      this.accessToken = settings.accessToken;
      this.auth = new Proxy({}, {
        get: (_, prop) => {
          throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(prop)} is not possible`);
        }
      });
    }
    this.fetch = fetchWithAuth(supabaseKey, this._getAccessToken.bind(this), settings.global.fetch);
    this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, settings.realtime));
    this.rest = new PostgrestClient(new URL("rest/v1", baseUrl).href, {
      headers: this.headers,
      schema: settings.db.schema,
      fetch: this.fetch
    });
    this.storage = new StorageClient(this.storageUrl.href, this.headers, this.fetch, options === null || options === void 0 ? void 0 : options.storage);
    if (!settings.accessToken) {
      this._listenForAuthEvents();
    }
  }
  /**
   * Supabase Functions allows you to deploy and invoke edge functions.
   */
  get functions() {
    return new FunctionsClient(this.functionsUrl.href, {
      headers: this.headers,
      customFetch: this.fetch
    });
  }
  /**
   * Perform a query on a table or a view.
   *
   * @param relation - The table or view name to query
   */
  from(relation) {
    return this.rest.from(relation);
  }
  // NOTE: signatures must be kept in sync with PostgrestClient.schema
  /**
   * Select a schema to query or perform an function (rpc) call.
   *
   * The schema needs to be on the list of exposed schemas inside Supabase.
   *
   * @param schema - The schema to query
   */
  schema(schema) {
    return this.rest.schema(schema);
  }
  // NOTE: signatures must be kept in sync with PostgrestClient.rpc
  /**
   * Perform a function call.
   *
   * @param fn - The function name to call
   * @param args - The arguments to pass to the function call
   * @param options - Named parameters
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   * @param options.get - When set to `true`, the function will be called with
   * read-only access mode.
   * @param options.count - Count algorithm to use to count rows returned by the
   * function. Only applicable for [set-returning
   * functions](https://www.postgresql.org/docs/current/functions-srf.html).
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  rpc(fn, args = {}, options = {}) {
    return this.rest.rpc(fn, args, options);
  }
  /**
   * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
   *
   * @param {string} name - The name of the Realtime channel.
   * @param {Object} opts - The options to pass to the Realtime channel.
   *
   */
  channel(name, opts = { config: {} }) {
    return this.realtime.channel(name, opts);
  }
  /**
   * Returns all Realtime channels.
   */
  getChannels() {
    return this.realtime.getChannels();
  }
  /**
   * Unsubscribes and removes Realtime channel from Realtime client.
   *
   * @param {RealtimeChannel} channel - The name of the Realtime channel.
   *
   */
  removeChannel(channel) {
    return this.realtime.removeChannel(channel);
  }
  /**
   * Unsubscribes and removes all Realtime channels from Realtime client.
   */
  removeAllChannels() {
    return this.realtime.removeAllChannels();
  }
  _getAccessToken() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      if (this.accessToken) {
        return yield this.accessToken();
      }
      const { data } = yield this.auth.getSession();
      return (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : this.supabaseKey;
    });
  }
  _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage, storageKey, flowType, lock, debug }, headers, fetch2) {
    const authHeaders = {
      Authorization: `Bearer ${this.supabaseKey}`,
      apikey: `${this.supabaseKey}`
    };
    return new SupabaseAuthClient({
      url: this.authUrl.href,
      headers: Object.assign(Object.assign({}, authHeaders), headers),
      storageKey,
      autoRefreshToken,
      persistSession,
      detectSessionInUrl,
      storage,
      flowType,
      lock,
      debug,
      fetch: fetch2,
      // auth checks if there is a custom authorizaiton header using this flag
      // so it knows whether to return an error when getUser is called with no session
      hasCustomAuthorizationHeader: "Authorization" in this.headers
    });
  }
  _initRealtimeClient(options) {
    return new RealtimeClient(this.realtimeUrl.href, Object.assign(Object.assign({}, options), { params: Object.assign({ apikey: this.supabaseKey }, options === null || options === void 0 ? void 0 : options.params) }));
  }
  _listenForAuthEvents() {
    let data = this.auth.onAuthStateChange((event, session) => {
      this._handleTokenChanged(event, "CLIENT", session === null || session === void 0 ? void 0 : session.access_token);
    });
    return data;
  }
  _handleTokenChanged(event, source, token) {
    if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && this.changedAccessToken !== token) {
      this.changedAccessToken = token;
    } else if (event === "SIGNED_OUT") {
      this.realtime.setAuth();
      if (source == "STORAGE")
        this.auth.signOut();
      this.changedAccessToken = void 0;
    }
  }
}
const createClient = (supabaseUrl, supabaseKey, options) => {
  return new SupabaseClient(supabaseUrl, supabaseKey, options);
};
function shouldShowDeprecationWarning() {
  if (typeof window !== "undefined") {
    return false;
  }
  if (typeof process === "undefined") {
    return false;
  }
  const processVersion = process["version"];
  if (processVersion === void 0 || processVersion === null) {
    return false;
  }
  const versionMatch = processVersion.match(/^v(\d+)\./);
  if (!versionMatch) {
    return false;
  }
  const majorVersion = parseInt(versionMatch[1], 10);
  return majorVersion <= 18;
}
if (shouldShowDeprecationWarning()) {
  console.warn(`⚠️  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217`);
}
const TO_BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split("");
const IGNORE_BASE64URL = " 	\n\r=".split("");
(() => {
  const charMap = new Array(128);
  for (let i = 0; i < charMap.length; i += 1) {
    charMap[i] = -1;
  }
  for (let i = 0; i < IGNORE_BASE64URL.length; i += 1) {
    charMap[IGNORE_BASE64URL[i].charCodeAt(0)] = -2;
  }
  for (let i = 0; i < TO_BASE64URL.length; i += 1) {
    charMap[TO_BASE64URL[i].charCodeAt(0)] = i;
  }
  return charMap;
})();
function createClientBrowser() {
  return createClient(
    "https://fdeblavnrrnoyqivydsg.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZWJsYXZucnJub3lxaXZ5ZHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTgxMzgsImV4cCI6MjA3MDA3NDEzOH0.iaK-5qda3SZGkSwSJRB5ejyJ1Ky8S2tPOxRAPAap_FI",
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: "pkce"
      }
    }
  );
}
const AuthContext = createContext(void 0);
function OAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const supabase2 = useMemo(() => createClientBrowser(), []);
  const signOut = async () => {
    try {
      setLoading(true);
      console.log("Starting sign out process...");
      const { error } = await supabase2.auth.signOut();
      if (error) throw error;
      console.log("Supabase sign out successful");
      setUser(null);
      setSession(null);
      localStorage.removeItem("supabase.auth.token");
      localStorage.removeItem("supabase.auth.refreshToken");
      const googleTokens = Object.keys(localStorage).filter(
        (key) => key.includes("google") || key.includes("oauth") || key.includes("auth")
      );
      googleTokens.forEach((key) => {
        console.log("Removing Google/OAuth token:", key);
        localStorage.removeItem(key);
      });
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + (/* @__PURE__ */ new Date()).toUTCString() + ";path=/");
      });
      sessionStorage.clear();
      console.log("Local storage cleared, redirecting...");
      window.location.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
      setUser(null);
      setSession(null);
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };
  const refreshSession = async () => {
    try {
      setLoading(true);
      const { data: { session: session2 }, error } = await supabase2.auth.getSession();
      if (error) throw error;
      setSession(session2);
      setUser((session2 == null ? void 0 : session2.user) ?? null);
    } catch (error) {
      console.error("Error refreshing session:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    mountedRef.current = true;
    const initializeAuth = async () => {
      try {
        const { data: { session: session2 }, error } = await supabase2.auth.getSession();
        if (error) throw error;
        if (mountedRef.current) {
          setSession(session2);
          setUser((session2 == null ? void 0 : session2.user) ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };
    initializeAuth();
    const { data: { subscription } } = supabase2.auth.onAuthStateChange(
      async (event, session2) => {
        var _a, _b, _c;
        if (!mountedRef.current) return;
        console.log("Auth state changed:", event, (_a = session2 == null ? void 0 : session2.user) == null ? void 0 : _a.email, "Provider:", (_c = (_b = session2 == null ? void 0 : session2.user) == null ? void 0 : _b.app_metadata) == null ? void 0 : _c.provider);
        switch (event) {
          case "SIGNED_IN":
          case "TOKEN_REFRESHED":
          case "INITIAL_SESSION":
            if (session2 == null ? void 0 : session2.user) {
              setSession(session2);
              setUser(session2.user);
              setLoading(false);
            }
            break;
          case "SIGNED_OUT":
            setSession(null);
            setUser(null);
            setLoading(false);
            break;
          default:
            setSession(session2);
            setUser((session2 == null ? void 0 : session2.user) ?? null);
            setLoading(false);
        }
      }
    );
    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);
  const value = useMemo(() => ({
    user,
    session,
    loading,
    signOut,
    refreshSession
  }), [user, session, loading, signOut, refreshSession]);
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
}
function useOAuth() {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useOAuth must be used within an OAuthProvider");
  }
  return context;
}
function useAuth() {
  const { user, session, loading } = useOAuth();
  return {
    isAuthenticated: !!user && !loading,
    user: user || null,
    session: session || null,
    loading: loading || false
  };
}
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e6;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Root,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Title,
  {
    ref,
    className: cn("text-sm font-semibold", className),
    ...props
  }
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Description,
  {
    ref,
    className: cn("text-sm opacity-90", className),
    ...props
  }
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
function Toaster$1() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$2,
    {
      theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const ApplicationForm = ({ isOpen, onClose, title, formType }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    experience: "",
    portfolio: "",
    investmentAmount: "",
    timeline: ""
  });
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your application! We'll be in touch soon.");
    onClose();
  };
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900", children: title }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "text-gray-400 hover:text-gray-600 transition-colors",
          children: /* @__PURE__ */ jsx(X, { size: 24 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Full Name *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "name",
            required: true,
            value: formData.name,
            onChange: handleInputChange,
            className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            name: "email",
            required: true,
            value: formData.email,
            onChange: handleInputChange,
            className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          }
        )
      ] }),
      formType !== "professional" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Company/Organization *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "company",
            required: true,
            value: formData.company,
            onChange: handleInputChange,
            className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          }
        )
      ] }),
      formType === "professional" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Current Experience Level" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "experience",
              value: formData.experience,
              onChange: handleInputChange,
              className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select your level" }),
                /* @__PURE__ */ jsx("option", { value: "beginner", children: "Beginner (0-2 years)" }),
                /* @__PURE__ */ jsx("option", { value: "intermediate", children: "Intermediate (2-5 years)" }),
                /* @__PURE__ */ jsx("option", { value: "advanced", children: "Advanced (5+ years)" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Portfolio/LinkedIn URL" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "url",
              name: "portfolio",
              value: formData.portfolio,
              onChange: handleInputChange,
              className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            }
          )
        ] })
      ] }),
      formType === "investor" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Investment Amount Range" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "investmentAmount",
              value: formData.investmentAmount,
              onChange: handleInputChange,
              className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select range" }),
                /* @__PURE__ */ jsx("option", { value: "10k-50k", children: "$10k - $50k" }),
                /* @__PURE__ */ jsx("option", { value: "50k-100k", children: "$50k - $100k" }),
                /* @__PURE__ */ jsx("option", { value: "100k-500k", children: "$100k - $500k" }),
                /* @__PURE__ */ jsx("option", { value: "500k+", children: "$500k+" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Investment Timeline" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "timeline",
              value: formData.timeline,
              onChange: handleInputChange,
              className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select timeline" }),
                /* @__PURE__ */ jsx("option", { value: "immediate", children: "Immediate (next 30 days)" }),
                /* @__PURE__ */ jsx("option", { value: "quarter", children: "This quarter" }),
                /* @__PURE__ */ jsx("option", { value: "year", children: "This year" }),
                /* @__PURE__ */ jsx("option", { value: "exploring", children: "Just exploring" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Message" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            name: "message",
            rows: 4,
            value: formData.message,
            onChange: handleInputChange,
            placeholder: "Tell us more about your interest...",
            className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors",
          children: "Submit Application"
        }
      )
    ] })
  ] }) }) });
};
const Reveal = ({
  children,
  delay = 0,
  direction = "up",
  className = ""
}) => {
  const directionOffset = {
    up: { y: 24, x: 0 },
    down: { y: -24, x: 0 },
    left: { y: 0, x: 24 },
    right: { y: 0, x: -24 }
  };
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: {
        opacity: 0,
        ...directionOffset[direction],
        filter: "blur(6px)"
      },
      whileInView: {
        opacity: 1,
        y: 0,
        x: 0,
        filter: "blur(0px)"
      },
      viewport: { once: true, margin: "-80px" },
      transition: {
        duration: 0.6,
        delay,
        ease: "easeOut"
      },
      className,
      children
    }
  );
};
const MagneticButton = ({
  children,
  className = "",
  onClick,
  strength = 6
}) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dx = useSpring(x, { stiffness: 300, damping: 20 });
  const dy = useSpring(y, { stiffness: 300, damping: 20 });
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / strength);
    y.set((e.clientY - centerY) / strength);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  return /* @__PURE__ */ jsx(
    motion.button,
    {
      ref,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onClick,
      style: { x: dx, y: dy },
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { type: "spring", stiffness: 400, damping: 17 },
      className,
      children
    }
  );
};
const Marquee = ({
  children,
  speed = 22,
  direction = "left",
  className = ""
}) => {
  const animationClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className}`,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `inline-flex gap-10 ${animationClass}`,
          style: { animationDuration: `${speed}s` },
          children: [
            children,
            children
          ]
        }
      )
    }
  );
};
const StickyStory = ({ title, codeBlock, steps }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02, 1]);
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ref,
      className: "relative grid lg:grid-cols-2 gap-16 min-h-[200vh] px-6 max-w-7xl mx-auto py-20",
      children: [
        /* @__PURE__ */ jsx("div", { className: "sticky top-24 self-start", children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            style: { rotate, scale },
            className: "rounded-3xl shadow-2xl p-6 bg-forge-dark text-forge-cream overflow-hidden relative border border-forge-orange/20",
            children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-forge-orange/5 to-transparent pointer-events-none" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-forge-orange animate-pulse" }),
                  /* @__PURE__ */ jsx("span", { className: "text-forge-orange font-medium text-sm", children: "Live Code" })
                ] }),
                /* @__PURE__ */ jsx("pre", { className: "text-sm overflow-auto text-forge-cream/90 leading-relaxed", children: /* @__PURE__ */ jsx("code", { children: codeBlock }) })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-32 py-24", children: [
          /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-8", children: title }) }),
          steps.map((step, i) => /* @__PURE__ */ jsx(Reveal, { delay: i * 0.1, children: /* @__PURE__ */ jsxs("div", { className: "max-w-prose", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-2xl lg:text-3xl font-bold text-forge-dark mb-4", children: [
              step.title,
              step.highlight && /* @__PURE__ */ jsx("span", { className: "text-forge-orange ml-2", children: step.highlight })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-forge-gray leading-relaxed", children: step.description })
          ] }) }, step.title))
        ] })
      ]
    }
  );
};
const AnimatedBackground = ({
  variant = "hero",
  className = ""
}) => {
  const backgrounds = {
    hero: /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(232,122,71,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(45,58,46,0.1),transparent_50%),radial-gradient(circle_at_40%_70%,rgba(245,242,232,0.2),transparent_50%)]",
          animate: {
            background: [
              "radial-gradient(circle_at_20%_30%,rgba(232,122,71,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(45,58,46,0.1),transparent_50%),radial-gradient(circle_at_40%_70%,rgba(245,242,232,0.2),transparent_50%)",
              "radial-gradient(circle_at_40%_20%,rgba(232,122,71,0.2),transparent_50%),radial-gradient(circle_at_60%_40%,rgba(45,58,46,0.15),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(245,242,232,0.25),transparent_50%)",
              "radial-gradient(circle_at_60%_60%,rgba(232,122,71,0.18),transparent_50%),radial-gradient(circle_at_20%_70%,rgba(45,58,46,0.12),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(245,242,232,0.22),transparent_50%)"
            ]
          },
          transition: {
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.015] mix-blend-overlay [background-image:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]" }),
      [...Array(12)].map((_, i) => /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "absolute w-1 h-1 bg-forge-orange/20 rounded-full",
          style: {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          },
          animate: {
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1, 0.5]
          },
          transition: {
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2
          }
        },
        i
      ))
    ] }),
    subtle: /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "absolute inset-0 bg-gradient-to-br from-forge-cream/50 to-transparent",
        animate: { opacity: [0.3, 0.6, 0.3] },
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
      }
    ),
    dark: /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "absolute inset-0 bg-gradient-to-br from-forge-dark via-forge-dark to-forge-dark/90",
        animate: {
          background: [
            "linear-gradient(135deg, #2D3A2E 0%, #2D3A2E 50%, rgba(45,58,46,0.9) 100%)",
            "linear-gradient(135deg, rgba(45,58,46,0.95) 0%, #2D3A2E 50%, #2D3A2E 100%)"
          ]
        },
        transition: { duration: 10, repeat: Infinity, repeatType: "reverse" }
      }
    )
  };
  return /* @__PURE__ */ jsx("div", { className: `absolute inset-0 overflow-hidden ${className}`, children: backgrounds[variant] });
};
const Professionals = () => {
  const [showForm, setShowForm] = useState(false);
  const stats = [
    { value: "6", label: "Month Program", suffix: "", icon: /* @__PURE__ */ jsx(Target, { className: "w-8 h-8" }) },
    { value: "$6K", label: "Monthly Salary", suffix: "/mo", icon: /* @__PURE__ */ jsx(DollarSign, { className: "w-8 h-8" }) },
    { value: "95%", label: "Job Placement", suffix: "", icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-8 h-8" }) }
  ];
  const features = [
    {
      icon: /* @__PURE__ */ jsx(DollarSign, { className: "w-6 h-6" }),
      title: "Get Paid to Learn",
      description: "Receive $6,000 USDC monthly while mastering Web3 development",
      highlight: "$36,000"
    },
    {
      icon: /* @__PURE__ */ jsx(Code, { className: "w-6 h-6" }),
      title: "Real Projects",
      description: "Build actual DeFi protocols, NFT platforms, and blockchain infrastructure",
      highlight: "Live Code"
    },
    {
      icon: /* @__PURE__ */ jsx(Briefcase, { className: "w-6 h-6" }),
      title: "Guaranteed Placement",
      description: "Access our exclusive network of Web3 companies hiring developers",
      highlight: "95% Success"
    }
  ];
  const companies = [
    "Uniswap",
    "Chainlink",
    "Polygon",
    "Solana",
    "Ethereum Foundation",
    "ConsenSys",
    "Compound",
    "Aave",
    "OpenSea",
    "Metamask"
  ];
  const testimonials = [
    { quote: '"Changed my life completely. From zero to Web3 developer in 6 months."', author: "Sarah Chen" },
    { quote: '"The ISA model meant I could focus 100% on learning."', author: "Marcus Rodriguez" },
    { quote: '"Landed a $120k job right after graduation."', author: "Alex Thompson" }
  ];
  const codeBlock = `// Forge College Smart Contract
contract ForgeCollege {
  // Student program details
  struct Student {
    address wallet;
    uint256 stipendAmount;
    uint256 completedProjects;
    bool jobPlaced;
  }
  
  // Company sponsor mapping
  mapping(address => uint256) sponsors;
  
  // ISA terms and repayment logic
  function startLearning() public {
    // Begin 6-month program
    // Receive monthly stipend
    // Work on real projects
  }
  
  function completeProgram() public {
    // Portfolio validation
    // Job matching algorithm
    // ISA activation only on job placement
  }
}`;
  const storySteps = [
    {
      title: "Smart Contracts",
      description: "Learn to build and deploy smart contracts that power DeFi protocols, NFT marketplaces, and DAOs. Master Solidity, security best practices, and gas optimization.",
      highlight: "Real Impact"
    },
    {
      title: "DeFi Development",
      description: "Build actual trading protocols, yield farming platforms, and lending systems. Work with real liquidity and understand how billions flow through Web3.",
      highlight: "$2B+ TVL"
    },
    {
      title: "Job Guarantee",
      description: "Our ISA model means we only succeed when you do. Get placed in top Web3 companies or pay nothing. It's that simple.",
      highlight: "Zero Risk"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-forge-cream overflow-x-hidden", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative min-h-screen flex items-center justify-center pt-28 pb-10 px-6", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "hero" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsxs(
          motion.h1,
          {
            initial: { opacity: 0, y: 30, filter: "blur(8px)" },
            animate: { opacity: 1, y: 0, filter: "blur(0px)" },
            transition: { duration: 0.8, ease: "easeOut" },
            className: "text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-forge-dark mb-8 leading-[0.9] tracking-tight",
            children: [
              "Get Paid",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center", children: [
                "to Learn.",
                /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    animate: { rotate: [0, 10, -10, 0] },
                    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    children: /* @__PURE__ */ jsx(Flame, { className: "w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 text-forge-orange mx-4" })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.p,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3, duration: 0.6 },
            className: "text-xl lg:text-2xl text-forge-gray max-w-4xl mx-auto mb-12 leading-relaxed",
            children: [
              "Master Web3 development, earn $6,000 USDC monthly for 6 months,",
              /* @__PURE__ */ jsx("br", { className: "hidden md:block" }),
              "and only pay us when we land you a job."
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.5, duration: 0.6 },
            children: /* @__PURE__ */ jsxs(
              MagneticButton,
              {
                onClick: () => setShowForm(true),
                className: "inline-flex items-center gap-3 bg-forge-orange text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
                children: [
                  "Apply to Next Cohort",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5" })
                ]
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-12 bg-white/50 backdrop-blur-sm border-y border-forge-orange/10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx("p", { className: "text-center text-forge-gray font-medium mb-8", children: "Learn the skills to work at companies like:" }) }),
      /* @__PURE__ */ jsx(Marquee, { className: "text-2xl font-bold text-forge-dark/60", children: companies.map((company, i) => /* @__PURE__ */ jsx("span", { className: "mx-8 hover:text-forge-orange transition-colors", children: company }, i)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Program by the Numbers" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Real outcomes, real careers, real impact" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: stats.map((stat, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "text-center bg-forge-cream p-8 rounded-3xl border border-forge-orange/20 group hover:border-forge-orange/40 transition-all duration-300",
          whileHover: { y: -5 },
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-forge-orange mb-4 flex justify-center group-hover:scale-110 transition-transform", children: stat.icon }),
            /* @__PURE__ */ jsxs("div", { className: "text-5xl lg:text-6xl font-bold text-forge-dark mb-2", children: [
              stat.value,
              /* @__PURE__ */ jsx("span", { className: "text-forge-orange text-2xl lg:text-3xl", children: stat.suffix })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-lg text-forge-gray font-medium", children: stat.label })
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx(
      StickyStory,
      {
        title: "Learn by Building Real Web3 Products",
        codeBlock,
        steps: storySteps
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-forge-cream", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Why Forge College?" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "The only Web3 education program where you earn while you learn" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-3 gap-8", children: features.map((feature, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "bg-white p-8 rounded-3xl border border-forge-orange/20 hover:border-forge-orange/40 transition-all duration-300 group",
          whileHover: { y: -8 },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-forge-orange rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-forge-orange-light transition-all duration-200 shadow-lg", children: feature.icon }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-forge-orange bg-forge-orange/10 px-3 py-1 rounded-full", children: feature.highlight })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-forge-dark mb-4", children: feature.title }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-forge-gray leading-relaxed", children: feature.description })
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsx(Reveal, { className: "text-center mb-12", children: /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-forge-dark", children: "What Our Students Say" }) }),
      /* @__PURE__ */ jsx(Marquee, { speed: 30, className: "text-lg", children: testimonials.map((testimonial, i) => /* @__PURE__ */ jsxs("div", { className: "mx-8 max-w-md", children: [
        /* @__PURE__ */ jsx("p", { className: "text-forge-gray italic mb-2", children: testimonial.quote }),
        /* @__PURE__ */ jsxs("p", { className: "text-forge-dark font-semibold", children: [
          "— ",
          testimonial.author
        ] })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "py-32 px-6 bg-forge-cream relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "subtle" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("h2", { className: "text-5xl lg:text-6xl font-bold text-forge-dark mb-6 leading-tight", children: [
          "No upfront cost.",
          /* @__PURE__ */ jsx("br", {}),
          "Pay only when you land a job."
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray max-w-3xl mx-auto mb-16 leading-relaxed", children: "Our Income Share Agreement means you focus on learning, not debt. We only succeed when you do." }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.4, children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "bg-forge-dark rounded-3xl p-12 text-white relative overflow-hidden border-4 border-forge-orange",
            whileHover: { scale: 1.02 },
            transition: { type: "spring", stiffness: 300 },
            children: [
              /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    animate: { scale: [1, 1.05, 1] },
                    transition: { duration: 2, repeat: Infinity },
                    className: "inline-flex items-center gap-2 text-forge-orange mb-6",
                    children: [
                      /* @__PURE__ */ jsx(Zap, { className: "w-6 h-6" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Next Cohort Starting Soon" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("h3", { className: "text-4xl font-bold mb-6 text-forge-cream", children: "April 2026" }),
                /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-cream/80 mb-8", children: "Limited to 10 students" }),
                /* @__PURE__ */ jsx(
                  MagneticButton,
                  {
                    onClick: () => setShowForm(true),
                    className: "bg-forge-orange text-white px-12 py-4 rounded-full font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
                    children: "Secure Your Spot"
                  }
                )
              ] })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "py-32 px-6 bg-forge-dark text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("h2", { className: "text-5xl lg:text-6xl font-bold mb-8 leading-tight text-forge-cream", children: [
          "Ready to forge",
          /* @__PURE__ */ jsx("br", {}),
          "your future?"
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsxs("p", { className: "text-xl text-forge-cream/80 mb-12 leading-relaxed", children: [
          "Join the next generation of Web3 developers.",
          /* @__PURE__ */ jsx("br", {}),
          "Apply now for the April 2026 cohort."
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.4, children: /* @__PURE__ */ jsxs(
          MagneticButton,
          {
            onClick: () => setShowForm(true),
            className: "inline-flex items-center gap-3 bg-forge-orange text-white px-12 py-6 rounded-full text-xl font-bold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
            children: [
              "Apply Now",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-6 h-6" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.6, children: /* @__PURE__ */ jsx("div", { className: "mt-8 text-sm text-forge-cream/60", children: "No upfront cost • Pay only when you get hired" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ApplicationForm,
      {
        isOpen: showForm,
        onClose: () => setShowForm(false),
        title: "Apply to Join the Next Cohort",
        formType: "professional"
      }
    )
  ] });
};
const Companies = () => {
  const [showForm, setShowForm] = useState(false);
  const stats = [
    { value: "95%", label: "Job Placement Rate", suffix: "", icon: /* @__PURE__ */ jsx(Target, { className: "w-8 h-8" }) },
    { value: "6", label: "Month Training", suffix: "mo", icon: /* @__PURE__ */ jsx(Briefcase, { className: "w-8 h-8" }) },
    { value: "Real", label: "Project Experience", suffix: "", icon: /* @__PURE__ */ jsx(Code, { className: "w-8 h-8" }) }
  ];
  const features = [
    {
      icon: /* @__PURE__ */ jsx(Target, { className: "w-6 h-6" }),
      title: "Qualified Talent Pool",
      description: "Access developers who have completed real Web3 projects and proven their skills through hands-on experience",
      highlight: "Pre-vetted"
    },
    {
      icon: /* @__PURE__ */ jsx(Zap, { className: "w-6 h-6" }),
      title: "Fast Hiring Process",
      description: "Streamlined recruitment with candidates who are ready to contribute from day one",
      highlight: "Day 1 Ready"
    },
    {
      icon: /* @__PURE__ */ jsx(Code, { className: "w-6 h-6" }),
      title: "Project-Based Vetting",
      description: "Our graduates have worked on actual Web3 projects, giving you confidence in their practical abilities",
      highlight: "Proven Skills"
    }
  ];
  const partnershipTiers = [
    {
      tier: "Project Partner",
      highlight: "Start Here",
      features: ["2-3 project submissions per cohort", "Access to student portfolios", "Hiring pipeline access"],
      cta: "Join as Partner"
    },
    {
      tier: "Curriculum Sponsor",
      highlight: "Most Popular",
      features: ["Curriculum influence", "Sponsor 3-5 students", "Dedicated hiring events", "Brand partnership benefits"],
      cta: "Become Sponsor",
      featured: true
    },
    {
      tier: "Ecosystem Partner",
      highlight: "Full Access",
      features: ["Full curriculum partnership", "Sponsor entire cohort track", "Exclusive hiring window", "Advisory board seat"],
      cta: "Join Ecosystem"
    }
  ];
  const companies = [
    "Uniswap",
    "Chainlink",
    "Polygon",
    "Solana",
    "Ethereum Foundation",
    "ConsenSys",
    "Compound",
    "Aave",
    "OpenSea",
    "Metamask"
  ];
  const testimonials = [
    { quote: '"Hired 3 developers from Forge College. Best hiring decision we made this year."', author: "Sarah Kim, CTO at DeFi Protocol" },
    { quote: '"The candidates came with real project experience. No training period needed."', author: "Marcus Chen, Engineering Lead at Web3 Startup" },
    { quote: '"Forge College graduates understand the Web3 ecosystem better than traditional bootcamp grads."', author: "Elena Rodriguez, VP Engineering at NFT Platform" }
  ];
  const codeBlock = `// Partnership Integration Example
contract ForgePartnership {
  // Company partnership details
  struct Partner {
    address company;
    uint256 sponsoredStudents;
    bytes32[] projectIds;
    bool exclusiveHiring;
  }
  
  // Student project assignments
  mapping(address => bytes32[]) studentProjects;
  
  // Partnership benefits and ROI
  function sponsorStudent(address student) public {
    // Fund student salary during learning
    // Assign real company projects
    // Track performance metrics
  }
  
  function hireGraduate(address student) public {
    // Validate project completion
    // Execute hiring agreement
    // Activate partnership benefits
  }
  
  // Partnership ROI calculation
  function calculateROI() public view returns (uint256) {
    // Hiring success rate
    // Time to productivity
    // Cost savings vs traditional recruiting
  }
}`;
  const storySteps = [
    {
      title: "Real Project Experience",
      description: "Our students work on actual company projects during their 6-month program. This means they understand your business challenges and have proven their ability to deliver.",
      highlight: "Business Ready"
    },
    {
      title: "Reduced Hiring Risk",
      description: "Skip the uncertainty of traditional hiring. Our graduates have portfolios of completed projects and verified skills from working with real companies.",
      highlight: "Zero Risk"
    },
    {
      title: "Faster Time to Value",
      description: "Candidates hit the ground running from day one. No lengthy onboarding or training periods. They understand Web3 development and your business needs.",
      highlight: "Immediate Impact"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-forge-cream overflow-x-hidden", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative min-h-screen flex items-center justify-center pt-28 pb-10 px-6", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "hero" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsxs(
          motion.h1,
          {
            initial: { opacity: 0, y: 30, filter: "blur(8px)" },
            animate: { opacity: 1, y: 0, filter: "blur(0px)" },
            transition: { duration: 0.8, ease: "easeOut" },
            className: "text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-forge-dark mb-8 leading-[0.9] tracking-tight",
            children: [
              "Hire Web3-Ready",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center", children: [
                "Talents.",
                /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    animate: { rotate: [0, 10, -10, 0] },
                    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    children: /* @__PURE__ */ jsx(Trophy, { className: "w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 text-forge-orange mx-4" })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.p,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3, duration: 0.6 },
            className: "text-xl lg:text-2xl text-forge-gray max-w-4xl mx-auto mb-12 leading-relaxed",
            children: [
              "Access skilled developers from our intensive 6-month program.",
              /* @__PURE__ */ jsx("br", { className: "hidden md:block" }),
              "Pre-vetted, project-tested, and ready to build from day one."
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.5, duration: 0.6 },
            children: /* @__PURE__ */ jsxs(
              MagneticButton,
              {
                onClick: () => setShowForm(true),
                className: "inline-flex items-center gap-3 bg-forge-orange text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
                children: [
                  "Partner With Us",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5" })
                ]
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-12 bg-white/50 backdrop-blur-sm border-y border-forge-orange/10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx("p", { className: "text-center text-forge-gray font-medium mb-8", children: "Join companies already building the future workforce" }) }),
      /* @__PURE__ */ jsx(Marquee, { className: "text-2xl font-bold text-forge-dark/60", children: companies.map((company, i) => /* @__PURE__ */ jsx("span", { className: "mx-8 hover:text-forge-orange transition-colors", children: company }, i)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Hiring Success Metrics" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Real results from companies who partner with us" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: stats.map((stat, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "text-center bg-forge-cream p-8 rounded-3xl border border-forge-orange/20 group hover:border-forge-orange/40 transition-all duration-300",
          whileHover: { y: -5 },
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-forge-orange mb-4 flex justify-center group-hover:scale-110 transition-transform", children: stat.icon }),
            /* @__PURE__ */ jsxs("div", { className: "text-5xl lg:text-6xl font-bold text-forge-dark mb-2", children: [
              stat.value,
              /* @__PURE__ */ jsx("span", { className: "text-forge-orange text-2xl lg:text-3xl", children: stat.suffix })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-lg text-forge-gray font-medium", children: stat.label })
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx(
      StickyStory,
      {
        title: "Why Companies Choose Forge College",
        codeBlock,
        steps: storySteps
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-forge-cream", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Partnership Benefits" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Transform your hiring strategy by investing in talent development" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-3 gap-8", children: features.map((feature, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "bg-white p-8 rounded-3xl border border-forge-orange/20 hover:border-forge-orange/40 transition-all duration-300 group",
          whileHover: { y: -8 },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-forge-orange rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-forge-orange-light transition-all duration-200 shadow-lg", children: feature.icon }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-forge-orange bg-forge-orange/10 px-3 py-1 rounded-full", children: feature.highlight })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-forge-dark mb-4", children: feature.title }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-forge-gray leading-relaxed", children: feature.description })
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Partnership Tiers" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Choose the partnership level that fits your hiring needs" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-3 gap-8", children: partnershipTiers.map((tier, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: `p-8 rounded-3xl transition-all duration-300 group relative overflow-hidden ${tier.featured ? "bg-forge-dark text-white border-4 border-forge-orange shadow-xl" : "bg-forge-cream border border-forge-orange/20 hover:border-forge-orange/40"}`,
          whileHover: { y: -8, scale: tier.featured ? 1.02 : 1 },
          children: [
            tier.featured && /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsx("span", { className: "bg-forge-orange text-white px-3 py-1 rounded-full text-sm font-bold", children: tier.highlight }) }),
            /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold mb-2 ${tier.featured ? "text-forge-cream" : "text-forge-dark"}`, children: tier.tier }),
            /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx("span", { className: `text-sm font-medium px-3 py-1 rounded-full ${tier.featured ? "bg-forge-orange/20 text-forge-orange" : "bg-forge-orange/10 text-forge-orange"}`, children: tier.highlight }) }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-3 mb-8", children: tier.features.map((feature, i) => /* @__PURE__ */ jsxs("li", { className: `flex items-start gap-3 ${tier.featured ? "text-forge-cream/90" : "text-forge-gray"}`, children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-forge-orange flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsx("span", { children: feature })
            ] }, i)) }),
            /* @__PURE__ */ jsx(
              MagneticButton,
              {
                onClick: () => setShowForm(true),
                className: `w-full py-3 rounded-full font-semibold transition-all duration-200 ${tier.featured ? "bg-forge-orange text-white border-2 border-forge-orange hover:border-forge-orange-light" : "bg-forge-orange text-white border-2 border-forge-orange hover:border-forge-orange-light"}`,
                children: tier.cta
              }
            )
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-forge-cream", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsx(Reveal, { className: "text-center mb-12", children: /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-forge-dark", children: "What Partner Companies Say" }) }),
      /* @__PURE__ */ jsx(Marquee, { speed: 35, className: "text-lg", children: testimonials.map((testimonial, i) => /* @__PURE__ */ jsxs("div", { className: "mx-8 max-w-lg", children: [
        /* @__PURE__ */ jsx("p", { className: "text-forge-gray italic mb-2", children: testimonial.quote }),
        /* @__PURE__ */ jsxs("p", { className: "text-forge-dark font-semibold", children: [
          "— ",
          testimonial.author
        ] })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "py-32 px-6 bg-forge-cream relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "subtle" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("h2", { className: "text-5xl lg:text-6xl font-bold text-forge-dark mb-6 leading-tight", children: [
          "Ready to hire",
          /* @__PURE__ */ jsx("br", {}),
          "the best Web3 talent?"
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray max-w-3xl mx-auto mb-16 leading-relaxed", children: "Join leading Web3 companies who are building their teams through Forge College partnerships." }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.4, children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "bg-forge-dark rounded-3xl p-12 text-white relative overflow-hidden border-4 border-forge-orange",
            whileHover: { scale: 1.02 },
            transition: { type: "spring", stiffness: 300 },
            children: [
              /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    animate: { scale: [1, 1.05, 1] },
                    transition: { duration: 2, repeat: Infinity },
                    className: "inline-flex items-center gap-2 text-forge-orange mb-6",
                    children: [
                      /* @__PURE__ */ jsx(Users, { className: "w-6 h-6" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Next Hiring Cycle" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("h3", { className: "text-4xl font-bold mb-6 text-forge-cream", children: "April 2026" }),
                /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-cream/80 mb-8", children: "10 graduating developers ready for placement" }),
                /* @__PURE__ */ jsx(
                  MagneticButton,
                  {
                    onClick: () => setShowForm(true),
                    className: "bg-forge-orange text-white px-12 py-4 rounded-full font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
                    children: "Become a Partner"
                  }
                )
              ] })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "py-32 px-6 bg-forge-dark text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("h2", { className: "text-5xl lg:text-6xl font-bold mb-8 leading-tight text-forge-cream", children: [
          "Let's build the future",
          /* @__PURE__ */ jsx("br", {}),
          "of Web3 together."
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsxs("p", { className: "text-xl text-forge-cream/80 mb-12 leading-relaxed", children: [
          "Partner with Forge College and get first access",
          /* @__PURE__ */ jsx("br", {}),
          "to the most skilled Web3 developers."
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.4, children: /* @__PURE__ */ jsxs(
          MagneticButton,
          {
            onClick: () => setShowForm(true),
            className: "inline-flex items-center gap-3 bg-forge-orange text-white px-12 py-6 rounded-full text-xl font-bold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
            children: [
              "Start Partnership",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-6 h-6" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.6, children: /* @__PURE__ */ jsx("div", { className: "mt-8 text-sm text-forge-cream/60", children: "Pre-vetted talent • Real project experience • Immediate impact" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ApplicationForm,
      {
        isOpen: showForm,
        onClose: () => setShowForm(false),
        title: "Partner With Forge College",
        formType: "company"
      }
    )
  ] });
};
const Investors = () => {
  const [showForm, setShowForm] = useState(false);
  const stats = [
    { value: "8-12%", label: "Target IRR", suffix: "", icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-8 h-8" }) },
    { value: "3-5", label: "Year Payback", suffix: "yr", icon: /* @__PURE__ */ jsx(BarChart3, { className: "w-8 h-8" }) },
    { value: "92%", label: "Job Placement", suffix: "", icon: /* @__PURE__ */ jsx(Target, { className: "w-8 h-8" }) }
  ];
  const features = [
    {
      icon: /* @__PURE__ */ jsx(PieChart, { className: "w-6 h-6" }),
      title: "Diversified RWA Exposure",
      description: "Invest in human capital through stablecoin-backed Income Share Agreements as a new asset class",
      highlight: "New Asset Class"
    },
    {
      icon: /* @__PURE__ */ jsx(BarChart3, { className: "w-6 h-6" }),
      title: "Transparent Metrics",
      description: "Access real-time performance data, repayment rates, and ROI analytics through our investor dashboard",
      highlight: "Live Analytics"
    },
    {
      icon: /* @__PURE__ */ jsx(Shield, { className: "w-6 h-6" }),
      title: "Stable Returns",
      description: "Generate yield from high-demand Web3 talent with historical repayment rates exceeding traditional education loans",
      highlight: "Proven Model"
    }
  ];
  const marketData = [
    { metric: "$1.2T", label: "Web3 Market Cap", description: "Total value locked across DeFi and Web3 protocols" },
    { metric: "3.7M", label: "Developer Shortage", description: "Unfilled Web3 developer positions globally" },
    { metric: "$140K", label: "Average Salary", description: "Starting salary for Web3 developers" }
  ];
  const performanceData = [
    { metric: "Target IRR", value: "8-12%", description: "Based on Web3 salary growth trends", trend: "up" },
    { metric: "Avg. Payback Period", value: "3-5 years", description: "Capped at 10% of income annually", trend: "neutral" },
    { metric: "Job Placement Rate", value: "92%", description: "Within 6 months of graduation", trend: "up" }
  ];
  const roadmapSteps = [
    { quarter: "Q2", title: "Fund Launch", description: "Initial investor round and first cohort funding" },
    { quarter: "Q3", title: "Performance Data", description: "First graduation metrics and repayment initiation" },
    { quarter: "Q4", title: "Secondary Market", description: "ISA trading platform and liquidity options" }
  ];
  const funds = [
    "Andreessen Horowitz",
    "Coinbase Ventures",
    "Paradigm",
    "Sequoia",
    "Tiger Global",
    "Pantera Capital",
    "Union Square Ventures",
    "Binance Labs"
  ];
  const testimonials = [
    { quote: '"Human capital ISAs represent the next evolution of RWA investments."', author: "Sarah Johnson, Partner at Web3 Fund" },
    { quote: '"The alignment of incentives in this model creates sustainable returns."', author: "Michael Chen, LP at DeFi Capital" },
    { quote: '"Finally, an investment that generates returns while solving real problems."', author: "Elena Rodriguez, Managing Director" }
  ];
  const codeBlock = `// ISA Investment Smart Contract
contract ForgeISAFund {
  // Investment and return structures
  struct Investment {
    address investor;
    uint256 amountUSDC;
    uint256 expectedReturn;
    uint256 timeframe;
    bool isActive;
  }
  
  // Student income share agreements
  mapping(address => ISATerms) studentISAs;
  
  // Performance tracking
  struct PerformanceMetrics {
    uint256 totalDeployed;
    uint256 totalReturned;
    uint256 currentIRR;
    uint256 activeISAs;
  }
  
  // Investment deployment
  function deployCapital(uint256 amount) public {
    // Fund student salaries (6 months)
    // Track investment allocation
    // Begin performance monitoring
  }
  
  // Return distribution
  function distributeReturns() public {
    // Calculate quarterly distributions
    // Process ISA collections
    // Pay investors based on stake
  }
  
  // Real-time analytics
  function getPortfolioMetrics() public view returns (PerformanceMetrics) {
    // Live IRR calculation
    // Risk-adjusted returns
    // Liquidity positions
  }
}`;
  const storySteps = [
    {
      title: "Human Capital as RWA",
      description: "Web3 has created a new asset class: human capital. Our ISA model tokenizes education investment, creating yield-generating assets backed by high-earning Web3 careers.",
      highlight: "Next-Gen RWA"
    },
    {
      title: "Aligned Incentives",
      description: "Unlike traditional education loans, ISAs align investor and student success. Returns are tied to job placement and salary growth, creating sustainable economics for all parties.",
      highlight: "Win-Win Model"
    },
    {
      title: "Liquidity & Scale",
      description: "Our roadmap includes secondary market infrastructure for ISA trading, fractional ownership, and automated portfolio management. Scale meets liquidity.",
      highlight: "DeFi Integration"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-forge-cream overflow-x-hidden", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative min-h-screen flex items-center justify-center pt-28 pb-10 px-6", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "hero" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsxs(
          motion.h1,
          {
            initial: { opacity: 0, y: 30, filter: "blur(8px)" },
            animate: { opacity: 1, y: 0, filter: "blur(0px)" },
            transition: { duration: 0.8, ease: "easeOut" },
            className: "text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-forge-dark mb-8 leading-[0.9] tracking-tight",
            children: [
              "Invest in",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center", children: [
                "People's Future.",
                /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    animate: { rotate: [0, 15, -15, 0] },
                    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 text-forge-orange mx-4" })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.p,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3, duration: 0.6 },
            className: "text-xl lg:text-2xl text-forge-gray max-w-4xl mx-auto mb-12 leading-relaxed",
            children: [
              "Generate stable returns by investing in Web3 talent",
              /* @__PURE__ */ jsx("br", { className: "hidden md:block" }),
              "through innovative stablecoin-backed Income Share Agreements."
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.5, duration: 0.6 },
            children: /* @__PURE__ */ jsxs(
              MagneticButton,
              {
                onClick: () => setShowForm(true),
                className: "inline-flex items-center gap-3 bg-forge-orange text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
                children: [
                  "Join Investment Round",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5" })
                ]
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-12 bg-white/50 backdrop-blur-sm border-y border-forge-orange/10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx("p", { className: "text-center text-forge-gray font-medium mb-8", children: "Join institutional investors backing the future of work" }) }),
      /* @__PURE__ */ jsx(Marquee, { className: "text-2xl font-bold text-forge-dark/60", children: funds.map((fund, i) => /* @__PURE__ */ jsx("span", { className: "mx-8 hover:text-forge-orange transition-colors", children: fund }, i)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Investment Performance" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Stable returns from a growing market" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: stats.map((stat, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "text-center bg-forge-cream p-8 rounded-3xl border border-forge-orange/20 group hover:border-forge-orange/40 transition-all duration-300",
          whileHover: { y: -5 },
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-forge-orange mb-4 flex justify-center group-hover:scale-110 transition-transform", children: stat.icon }),
            /* @__PURE__ */ jsxs("div", { className: "text-5xl lg:text-6xl font-bold text-forge-dark mb-2", children: [
              stat.value,
              /* @__PURE__ */ jsx("span", { className: "text-forge-orange text-2xl lg:text-3xl", children: stat.suffix })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-lg text-forge-gray font-medium", children: stat.label })
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "py-20 px-6 bg-forge-dark text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto relative z-10", children: [
        /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-cream mb-6", children: "Market Opportunity" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-cream/80", children: "The Web3 talent shortage creates unprecedented opportunity" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: marketData.map((item, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "text-center p-8 rounded-3xl border border-forge-orange/20 bg-white/5 backdrop-blur-sm hover:border-forge-orange/40 transition-all duration-300 group",
            whileHover: { y: -5, scale: 1.02 },
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-4xl lg:text-5xl font-bold text-forge-orange mb-3 group-hover:scale-110 transition-transform", children: item.metric }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-forge-cream mb-2", children: item.label }),
              /* @__PURE__ */ jsx("p", { className: "text-forge-cream/70", children: item.description })
            ]
          }
        ) }, index)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      StickyStory,
      {
        title: "A New Asset Class is Born",
        codeBlock,
        steps: storySteps
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-forge-cream", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Why Invest in Human Capital?" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Web3 has created new opportunities for yield generation" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-3 gap-8", children: features.map((feature, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "bg-white p-8 rounded-3xl border border-forge-orange/20 hover:border-forge-orange/40 transition-all duration-300 group",
          whileHover: { y: -8 },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-forge-orange rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-forge-orange-light transition-all duration-200 shadow-lg", children: feature.icon }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-forge-orange bg-forge-orange/10 px-3 py-1 rounded-full", children: feature.highlight })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-forge-dark mb-4", children: feature.title }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-forge-gray leading-relaxed", children: feature.description })
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Investment Metrics" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Transparent performance data you can trust" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-16", children: [
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: performanceData.map((item, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "bg-forge-cream p-6 rounded-3xl border border-forge-orange/20 hover:border-forge-orange/40 transition-all duration-300 group",
            whileHover: { x: 5 },
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-forge-gray font-medium", children: item.metric }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-forge-dark", children: item.value }),
                  item.trend === "up" && /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 text-green-500" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-forge-gray/80", children: item.description })
            ]
          }
        ) }, index)) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.4, children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "bg-forge-dark text-white p-8 rounded-3xl border-4 border-forge-orange relative overflow-hidden",
            whileHover: { scale: 1.02 },
            transition: { type: "spring", stiffness: 300 },
            children: [
              /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold mb-6 text-forge-cream", children: "Investment Structure" }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "border-l-4 border-forge-orange pl-4", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-semibold text-forge-cream", children: "Minimum Investment" }),
                    /* @__PURE__ */ jsx("p", { className: "text-forge-cream/80", children: "$10,000 USDC/USDT" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "border-l-4 border-blue-400 pl-4", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-semibold text-forge-cream", children: "Fund Duration" }),
                    /* @__PURE__ */ jsx("p", { className: "text-forge-cream/80", children: "7-year fund life with extension options" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "border-l-4 border-green-400 pl-4", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-semibold text-forge-cream", children: "Distribution Schedule" }),
                    /* @__PURE__ */ jsx("p", { className: "text-forge-cream/80", children: "Quarterly distributions based on collections" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "border-l-4 border-purple-400 pl-4", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-semibold text-forge-cream", children: "Management Fee" }),
                    /* @__PURE__ */ jsx("p", { className: "text-forge-cream/80", children: "2% annually + 20% performance fee" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  MagneticButton,
                  {
                    onClick: () => setShowForm(true),
                    className: "w-full bg-forge-orange text-white py-4 rounded-full font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200 mt-8",
                    children: "Join Investment Round"
                  }
                )
              ] })
            ]
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-forge-cream", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Roadmap to Liquidity" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Clear path to returns and secondary market access" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: roadmapSteps.map((step, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "bg-white p-8 rounded-3xl border border-forge-orange/20 hover:border-forge-orange/40 transition-all duration-300 group text-center",
          whileHover: { y: -5 },
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-forge-orange rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-xl", children: step.quarter }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-forge-dark mb-4", children: step.title }),
            /* @__PURE__ */ jsx("p", { className: "text-forge-gray", children: step.description })
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsx(Reveal, { className: "text-center mb-12", children: /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-forge-dark", children: "What Investors Say" }) }),
      /* @__PURE__ */ jsx(Marquee, { speed: 40, className: "text-lg", children: testimonials.map((testimonial, i) => /* @__PURE__ */ jsxs("div", { className: "mx-8 max-w-lg", children: [
        /* @__PURE__ */ jsx("p", { className: "text-forge-gray italic mb-2", children: testimonial.quote }),
        /* @__PURE__ */ jsxs("p", { className: "text-forge-dark font-semibold", children: [
          "— ",
          testimonial.author
        ] })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "py-32 px-6 bg-forge-cream relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "subtle" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("h2", { className: "text-5xl lg:text-6xl font-bold text-forge-dark mb-6 leading-tight", children: [
          "Ready to generate",
          /* @__PURE__ */ jsx("br", {}),
          "stable returns?"
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray max-w-3xl mx-auto mb-16 leading-relaxed", children: "Join institutional investors backing the next generation of Web3 builders through innovative ISA investments." }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.4, children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "bg-forge-dark rounded-3xl p-12 text-white relative overflow-hidden border-4 border-forge-orange",
            whileHover: { scale: 1.02 },
            transition: { type: "spring", stiffness: 300 },
            children: [
              /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    animate: { scale: [1, 1.05, 1] },
                    transition: { duration: 2, repeat: Infinity },
                    className: "inline-flex items-center gap-2 text-forge-orange mb-6",
                    children: [
                      /* @__PURE__ */ jsx(Coins, { className: "w-6 h-6" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Next Investment Round" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("h3", { className: "text-4xl font-bold mb-6 text-forge-cream", children: "$2M Target" }),
                /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-cream/80 mb-8", children: "Funding the April 2026 cohort" }),
                /* @__PURE__ */ jsx(
                  MagneticButton,
                  {
                    onClick: () => setShowForm(true),
                    className: "bg-forge-orange text-white px-12 py-4 rounded-full font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
                    children: "Invest Now"
                  }
                )
              ] })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "py-32 px-6 bg-forge-dark text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("h2", { className: "text-5xl lg:text-6xl font-bold mb-8 leading-tight text-forge-cream", children: [
          "Invest in impact.",
          /* @__PURE__ */ jsx("br", {}),
          "Generate returns."
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsxs("p", { className: "text-xl text-forge-cream/80 mb-12 leading-relaxed", children: [
          "Join the future of education funding through",
          /* @__PURE__ */ jsx("br", {}),
          "innovative stablecoin-backed ISA investments."
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.4, children: /* @__PURE__ */ jsxs(
          MagneticButton,
          {
            onClick: () => setShowForm(true),
            className: "inline-flex items-center gap-3 bg-forge-orange text-white px-12 py-6 rounded-full text-xl font-bold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
            children: [
              "Join Investment Round",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-6 h-6" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.6, children: /* @__PURE__ */ jsx("div", { className: "mt-8 text-sm text-forge-cream/60", children: "Minimum $10K USDC • Quarterly distributions • Secondary market access" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ApplicationForm,
      {
        isOpen: showForm,
        onClose: () => setShowForm(false),
        title: "Join the Investment Round",
        formType: "investor"
      }
    )
  ] });
};
const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "404" }),
    /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600 mb-4", children: "Oops! Page not found" }),
    /* @__PURE__ */ jsx("a", { href: "/", className: "text-blue-500 hover:text-blue-700 underline", children: "Return to Home" })
  ] }) });
};
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const ROOT = "/";
const COMPANIES = "/companies";
const INVESTORS = "/investors";
const LOGIN = "/login";
const SIGNUP = "/signup";
const FORGOT_PASSWORD = "/forgot-password";
const UPDATE_PASSWORD = "/update-password";
const DASHBOARD = "/dashboard";
const DASHBOARD_EXPLORE = "/dashboard/explore";
const DASHBOARD_LEARN_COURSE = (courseId) => `/dashboard/learn/course/${courseId}`;
const DASHBOARD_LEARN_PATH = (pathId) => `/dashboard/learn/path/${pathId}`;
const ROUTE_LABELS = {
  [DASHBOARD]: "Dashboard",
  [DASHBOARD_EXPLORE]: "Paths",
  LEARN: "Learn",
  COURSE: "Course",
  PATH: "Path",
  PROFILE: "My Profile",
  PAGE: "Page"
};
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogin = async (e) => {
    var _a, _b;
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase2 = createClientBrowser();
      const { data, error: error2 } = await supabase2.auth.signInWithPassword({ email, password });
      if (error2) {
        throw error2;
      }
      const from = ((_b = (_a = location.state) == null ? void 0 : _a.from) == null ? void 0 : _b.pathname) || DASHBOARD;
      navigate(from, { replace: true });
    } catch (error2) {
      if (error2.message.includes("fetch") || error2.message.includes("network")) {
        setError("Authentication service not configured. Please contact the administrator.");
      } else {
        setError(error2.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      const supabase2 = createClientBrowser();
      const { error: error2 } = await supabase2.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error2) throw error2;
    } catch (error2) {
      setError(error2.message);
      setLoading(false);
    }
  };
  const handleGithubLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      const supabase2 = createClientBrowser();
      const { error: error2 } = await supabase2.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error2) throw error2;
    } catch (error2) {
      setError(error2.message);
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center min-h-screen bg-forge-cream relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-40 right-20 w-48 h-48 bg-forge-orange/10 rounded-full blur-2xl" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md bg-white/95 backdrop-blur-sm border border-forge-orange/20 shadow-xl relative z-10", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-forge-dark text-2xl font-bold", children: "Login" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("form", { onSubmit: handleLogin, children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-forge-dark font-medium", children: "Email" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              placeholder: "m@example.com",
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", className: "text-forge-dark font-medium", children: "Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password",
              type: "password",
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
            }
          )
        ] }),
        error && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200", children: error }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            className: "w-full bg-forge-orange text-white hover:bg-forge-orange-light transition-all duration-200 shadow-lg hover:shadow-xl font-semibold py-3 rounded-xl",
            disabled: loading,
            children: loading ? "Loading..." : "Login"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative my-6", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("span", { className: "w-full border-t border-forge-orange/20" }) }),
          /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsx("span", { className: "bg-white px-2 text-forge-gray", children: "Or continue with" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: handleGoogleLogin,
              className: "w-full border-forge-orange/20 hover:border-forge-orange hover:bg-forge-orange/5 transition-all duration-200 font-medium py-3 rounded-xl group",
              disabled: loading,
              children: [
                /* @__PURE__ */ jsxs("svg", { className: "w-6 h-6 mr-3 transition-transform group-hover:scale-110", viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "#4285F4",
                      d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "#34A853",
                      d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "#FBBC05",
                      d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "#EA4335",
                      d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    }
                  )
                ] }),
                "Continue with Google"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: handleGithubLogin,
              className: "w-full border-forge-orange/20 hover:border-forge-orange hover:bg-forge-orange/5 transition-all duration-200 font-medium py-3 rounded-xl group",
              disabled: loading,
              children: [
                /* @__PURE__ */ jsx(Github, { className: "w-6 h-6 mr-3 transition-transform group-hover:scale-110" }),
                "Continue with GitHub"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 text-center text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-forge-gray", children: "Don't have an account?" }),
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/signup", className: "text-forge-orange hover:text-forge-orange-light font-medium underline transition-colors", children: "Sign up" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-center text-sm", children: /* @__PURE__ */ jsx(Link, { to: "/forgot-password", className: "text-forge-orange hover:text-forge-orange-light font-medium underline transition-colors", children: "Forgot your password?" }) })
      ] }) }) })
    ] })
  ] });
}
function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setLoading(true);
    setMessage("");
    try {
      const supabase2 = createClientBrowser();
      const { error: error2 } = await supabase2.auth.signUp({ email, password });
      if (error2) throw error2;
      setMessage("Check your email for the confirmation link!");
    } catch (error2) {
      if (error2.message.includes("fetch") || error2.message.includes("network")) {
        setError("Authentication service not configured. Please contact the administrator.");
      } else {
        setError(error2.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignUp = async () => {
    try {
      setError(null);
      setLoading(true);
      const supabase2 = createClientBrowser();
      const { error: error2 } = await supabase2.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error2) throw error2;
    } catch (error2) {
      setError(error2.message);
      setLoading(false);
    }
  };
  const handleGithubSignUp = async () => {
    try {
      setError(null);
      setLoading(true);
      const supabase2 = createClientBrowser();
      const { error: error2 } = await supabase2.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error2) throw error2;
    } catch (error2) {
      setError(error2.message);
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center min-h-screen bg-forge-cream relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-40 right-20 w-48 h-48 bg-forge-orange/10 rounded-full blur-2xl" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md bg-white/95 backdrop-blur-sm border border-forge-orange/20 shadow-xl relative z-10", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-forge-dark text-2xl font-bold", children: "Create Account" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("form", { onSubmit: handleSignUp, children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-forge-dark font-medium", children: "Email" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              placeholder: "m@example.com",
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", className: "text-forge-dark font-medium", children: "Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password",
              type: "password",
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "confirm-password", className: "text-forge-dark font-medium", children: "Confirm Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "confirm-password",
              type: "password",
              required: true,
              value: confirmPassword,
              onChange: (e) => setConfirmPassword(e.target.value),
              className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
            }
          )
        ] }),
        error && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200", children: error }),
        message && /* @__PURE__ */ jsx("p", { className: "text-green-500 text-sm bg-green-50 p-3 rounded-lg border border-green-200", children: message }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            className: "w-full bg-forge-orange text-white hover:bg-forge-orange-light transition-all duration-200 shadow-lg hover:shadow-xl font-semibold py-3 rounded-xl",
            disabled: loading,
            children: loading ? "Creating account..." : "Sign Up"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative my-6", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("span", { className: "w-full border-t border-forge-orange/20" }) }),
          /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsx("span", { className: "bg-white px-2 text-forge-gray", children: "Or continue with" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: handleGoogleSignUp,
              className: "w-full border-forge-orange/20 hover:border-forge-orange hover:bg-forge-orange/5 transition-all duration-200 font-medium py-3 rounded-xl group",
              disabled: loading,
              children: [
                /* @__PURE__ */ jsxs("svg", { className: "w-6 h-6 mr-3 transition-transform group-hover:scale-110", viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "#4285F4",
                      d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "#34A853",
                      d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "#FBBC05",
                      d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "#EA4335",
                      d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    }
                  )
                ] }),
                "Continue with Google"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: handleGithubSignUp,
              className: "w-full border-forge-orange/20 hover:border-forge-orange hover:bg-forge-orange/5 transition-all duration-200 font-medium py-3 rounded-xl group",
              disabled: loading,
              children: [
                /* @__PURE__ */ jsx(Github, { className: "w-6 h-6 mr-3 transition-transform group-hover:scale-110" }),
                "Continue with GitHub"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 text-center text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-forge-gray", children: "Already have an account?" }),
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-forge-orange hover:text-forge-orange-light font-medium underline transition-colors", children: "Login" })
        ] })
      ] }) }) })
    ] })
  ] });
}
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");
    setLoading(true);
    try {
      const supabase2 = createClientBrowser();
      const { error: error2 } = await supabase2.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`
      });
      if (error2) throw error2;
      setMessage("Check your email for a password reset link.");
    } catch (error2) {
      setError(error2.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center min-h-screen bg-forge-cream relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-40 right-20 w-48 h-48 bg-forge-orange/10 rounded-full blur-2xl" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md bg-white/95 backdrop-blur-sm border border-forge-orange/20 shadow-xl relative z-10", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-forge-dark text-2xl font-bold", children: "Forgot Password" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("form", { onSubmit: handlePasswordReset, children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-forge-dark font-medium", children: "Email" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              placeholder: "m@example.com",
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
            }
          )
        ] }),
        error && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200", children: error }),
        message && /* @__PURE__ */ jsx("p", { className: "text-green-500 text-sm bg-green-50 p-3 rounded-lg border border-green-200", children: message }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            className: "w-full bg-forge-orange text-white hover:bg-forge-orange-light transition-all duration-200 shadow-lg hover:shadow-xl font-semibold py-3 rounded-xl",
            disabled: loading,
            children: loading ? "Sending..." : "Send Reset Link"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 text-center text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-forge-gray", children: "Remembered your password?" }),
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-forge-orange hover:text-forge-orange-light font-medium underline transition-colors", children: "Login" })
        ] })
      ] }) }) })
    ] })
  ] });
}
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(void 0);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
const Sheet = SheetPrimitive.Root;
const SheetPortal = SheetPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxs(
    SheetPrimitive.Content,
    {
      ref,
      className: cn(sheetVariants({ side }), className),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
SheetContent.displayName = SheetPrimitive.Content.displayName;
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-muted", className),
      ...props
    }
  );
}
const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = React.createContext(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
const SidebarProvider = React.forwardRef(
  ({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
  }, ref) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open]
    );
    const toggleSidebar = React.useCallback(() => {
      return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
    }, [isMobile, setOpen, setOpenMobile]);
    React.useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);
    const state = open ? "expanded" : "collapsed";
    const contextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );
    return /* @__PURE__ */ jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style
        },
        className: cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
          className
        ),
        ref,
        ...props,
        children
      }
    ) }) });
  }
);
SidebarProvider.displayName = "SidebarProvider";
const Sidebar = React.forwardRef(
  ({
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    ...props
  }, ref) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    if (collapsible === "none") {
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          ),
          ref,
          ...props,
          children
        }
      );
    }
    if (isMobile) {
      return /* @__PURE__ */ jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsx(
        SheetContent,
        {
          "data-sidebar": "sidebar",
          "data-mobile": "true",
          className: "w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
          style: {
            "--sidebar-width": SIDEBAR_WIDTH_MOBILE
          },
          side,
          children: /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col", children })
        }
      ) });
    }
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: "group peer hidden md:block text-sidebar-foreground",
        "data-state": state,
        "data-collapsible": state === "collapsed" ? collapsible : "",
        "data-variant": variant,
        "data-side": side,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
                "group-data-[collapsible=offcanvas]:w-0",
                "group-data-[side=right]:rotate-180",
                variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
                side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
                // Adjust the padding for floating and inset variants.
                variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
                className
              ),
              ...props,
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  "data-sidebar": "sidebar",
                  className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
                  children
                }
              )
            }
          )
        ]
      }
    );
  }
);
Sidebar.displayName = "Sidebar";
const SidebarTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar, state } = useSidebar();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      ref,
      "data-sidebar": "trigger",
      variant: "ghost",
      size: "icon",
      className: cn("h-7 w-7", className),
      onClick: (event) => {
        onClick == null ? void 0 : onClick(event);
        toggleSidebar();
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx(ChevronLeft, { className: cn(
          "transition-transform duration-200",
          state === "collapsed" ? "rotate-180" : ""
        ) }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
});
SidebarTrigger.displayName = "SidebarTrigger";
const SidebarRail = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsx(
    "button",
    {
      ref,
      "data-sidebar": "rail",
      "aria-label": "Toggle Sidebar",
      tabIndex: -1,
      onClick: toggleSidebar,
      title: "Toggle Sidebar",
      className: cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      ),
      ...props
    }
  );
});
SidebarRail.displayName = "SidebarRail";
const SidebarInset = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "main",
    {
      ref,
      className: cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      ),
      ...props
    }
  );
});
SidebarInset.displayName = "SidebarInset";
const SidebarInput = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    Input,
    {
      ref,
      "data-sidebar": "input",
      className: cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      ),
      ...props
    }
  );
});
SidebarInput.displayName = "SidebarInput";
const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "header",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
});
SidebarHeader.displayName = "SidebarHeader";
const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "footer",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
});
SidebarFooter.displayName = "SidebarFooter";
const SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    Separator,
    {
      ref,
      "data-sidebar": "separator",
      className: cn("mx-2 w-auto bg-sidebar-border", className),
      ...props
    }
  );
});
SidebarSeparator.displayName = "SidebarSeparator";
const SidebarContent = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "content",
      className: cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
});
SidebarContent.displayName = "SidebarContent";
const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      ...props
    }
  );
});
SidebarGroup.displayName = "SidebarGroup";
const SidebarGroupLabel = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-label",
      className: cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
const SidebarGroupAction = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-action",
      className: cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";
const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    "data-sidebar": "group-content",
    className: cn("w-full text-sm", className),
    ...props
  }
));
SidebarGroupContent.displayName = "SidebarGroupContent";
const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    "data-sidebar": "menu",
    className: cn("flex w-full min-w-0 flex-col gap-1", className),
    ...props
  }
));
SidebarMenu.displayName = "SidebarMenu";
const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "li",
  {
    ref,
    "data-sidebar": "menu-item",
    className: cn("group/menu-item relative", className),
    ...props
  }
));
SidebarMenuItem.displayName = "SidebarMenuItem";
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const SidebarMenuButton = React.forwardRef(
  ({
    asChild = false,
    isActive = false,
    variant = "default",
    size = "default",
    tooltip,
    className,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();
    const button = /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        "data-sidebar": "menu-button",
        "data-size": size,
        "data-active": isActive,
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
        ...props
      }
    );
    if (!tooltip) {
      return button;
    }
    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip
      };
    }
    return /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: button }),
      /* @__PURE__ */ jsx(
        TooltipContent,
        {
          side: "right",
          align: "center",
          hidden: state !== "collapsed" || isMobile,
          ...tooltip
        }
      )
    ] });
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";
const SidebarMenuAction = React.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-action",
      className: cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";
const SidebarMenuBadge = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    "data-sidebar": "menu-badge",
    className: cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    ),
    ...props
  }
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
const SidebarMenuSkeleton = React.forwardRef(({ className, showIcon = false, ...props }, ref) => {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      "data-sidebar": "menu-skeleton",
      className: cn("rounded-md h-8 flex gap-2 px-2 items-center", className),
      ...props,
      children: [
        showIcon && /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: "size-4 rounded-md",
            "data-sidebar": "menu-skeleton-icon"
          }
        ),
        /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: "h-4 flex-1 max-w-[--skeleton-width]",
            "data-sidebar": "menu-skeleton-text",
            style: {
              "--skeleton-width": width
            }
          }
        )
      ]
    }
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
const SidebarMenuSub = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    "data-sidebar": "menu-sub",
    className: cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    ),
    ...props
  }
));
SidebarMenuSub.displayName = "SidebarMenuSub";
const SidebarMenuSubItem = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("li", { ref, ...props }));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
const SidebarMenuSubButton = React.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
function ProfileDropdown() {
  var _a;
  const { user } = useAuth();
  const { signOut: oAuthSignOut, loading: signOutLoading } = useOAuth();
  const handleLogout = async () => {
    try {
      await oAuthSignOut();
    } catch (error) {
      console.error("Error during logout:", error);
      window.location.href = "/";
    }
  };
  const getInitials = (email) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };
  const getUserDisplayName = () => {
    var _a2, _b;
    if ((_a2 = user == null ? void 0 : user.user_metadata) == null ? void 0 : _a2.full_name) {
      return user.user_metadata.full_name;
    }
    if ((_b = user == null ? void 0 : user.user_metadata) == null ? void 0 : _b.name) {
      return user.user_metadata.name;
    }
    if (user == null ? void 0 : user.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };
  if (!user) {
    return null;
  }
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "w-full justify-start gap-2 px-2", children: [
      /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8", children: [
        /* @__PURE__ */ jsx(AvatarImage, { src: (_a = user == null ? void 0 : user.user_metadata) == null ? void 0 : _a.avatar_url }),
        /* @__PURE__ */ jsx(AvatarFallback, { children: getInitials(user == null ? void 0 : user.email) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden flex-col items-start text-left group-data-[collapsible=icon]:hidden", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: getUserDisplayName() }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: user == null ? void 0 : user.email })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-56", children: [
      /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "My Account" }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard/profile", children: [
        /* @__PURE__ */ jsx(User, { className: "mr-2 h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { children: "Profile" })
      ] }) }),
      /* @__PURE__ */ jsxs(DropdownMenuItem, { children: [
        /* @__PURE__ */ jsx(Wallet, { className: "mr-2 h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { children: "Connect Wallet" })
      ] }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleLogout, disabled: signOutLoading, children: [
        /* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { children: signOutLoading ? "Signing out..." : "Log Out" })
      ] })
    ] })
  ] });
}
function DashboardLayout() {
  const { loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-forge-orange mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-forge-gray", children: "Loading dashboard..." })
    ] }) });
  }
  const isDashboard = location.pathname === DASHBOARD;
  const isExplore = location.pathname.startsWith(DASHBOARD_EXPLORE);
  return /* @__PURE__ */ jsxs(SidebarProvider, { children: [
    /* @__PURE__ */ jsxs(Sidebar, { collapsible: "icon", children: [
      /* @__PURE__ */ jsx(SidebarRail, {}),
      /* @__PURE__ */ jsx(SidebarHeader, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full", children: [
        /* @__PURE__ */ jsx(Link, { to: "/dashboard", className: "flex items-center gap-3", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "https://cdn.builder.io/api/v1/assets/a59c9d8d677c4c99bcaffef64866607b/forgecollege-2c35f0?format=webp&width=800",
            alt: "Forge College",
            className: "h-10 w-auto"
          }
        ) }),
        /* @__PURE__ */ jsx(SidebarTrigger, { className: "h-8 w-8 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-800" })
      ] }) }),
      /* @__PURE__ */ jsx(SidebarContent, { children: /* @__PURE__ */ jsx(SidebarGroup, { children: /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsxs(SidebarMenu, { children: [
        /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, isActive: isDashboard, tooltip: "Dashboard", children: /* @__PURE__ */ jsxs(Link, { to: DASHBOARD, children: [
          /* @__PURE__ */ jsx(LayoutDashboard, {}),
          /* @__PURE__ */ jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: ROUTE_LABELS[DASHBOARD] })
        ] }) }) }),
        /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, isActive: isExplore, tooltip: "Paths", children: /* @__PURE__ */ jsxs(Link, { to: DASHBOARD_EXPLORE, children: [
          /* @__PURE__ */ jsx(BookOpen, {}),
          /* @__PURE__ */ jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: "Paths" })
        ] }) }) }),
        /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(SidebarMenuButton, { disabled: true, children: [
            /* @__PURE__ */ jsx(Lock, {}),
            /* @__PURE__ */ jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: "Real-World Project" })
          ] }) }),
          /* @__PURE__ */ jsx(TooltipContent, { side: "right", children: "Coming soon!" })
        ] }) })
      ] }) }) }) }),
      /* @__PURE__ */ jsx(SidebarFooter, { className: "p-2", children: /* @__PURE__ */ jsx(ProfileDropdown, {}) })
    ] }),
    /* @__PURE__ */ jsxs(SidebarInset, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex h-16 items-center justify-between px-6 border-b bg-white border-forge-cream", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-3", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-forge-dark", children: isDashboard ? "Dashboard" : isExplore ? "Paths" : "Dashboard" }) }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-8 relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 -z-10 pointer-events-none", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -top-6 right-6 w-32 h-32 bg-forge-cream rounded-full blur-2xl" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-10 w-24 h-24 bg-forge-orange/10 rounded-full blur-2xl" })
        ] }),
        /* @__PURE__ */ jsx(Outlet, {})
      ] })
    ] })
  ] });
}
function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setLoading(true);
    setMessage("");
    try {
      const supabase2 = createClientBrowser();
      const { error: error2 } = await supabase2.auth.updateUser({ password });
      if (error2) throw error2;
      setMessage("Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3e3);
    } catch (error2) {
      setError(error2.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center min-h-screen bg-forge-cream relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-40 right-20 w-48 h-48 bg-forge-orange/10 rounded-full blur-2xl" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md bg-white/95 backdrop-blur-sm border border-forge-orange/20 shadow-xl relative z-10", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-forge-dark text-2xl font-bold", children: "Update Your Password" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("form", { onSubmit: handleUpdatePassword, children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", className: "text-forge-dark font-medium", children: "New Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password",
              type: "password",
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "confirm-password", className: "text-forge-dark font-medium", children: "Confirm New Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "confirm-password",
              type: "password",
              required: true,
              value: confirmPassword,
              onChange: (e) => setConfirmPassword(e.target.value),
              className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
            }
          )
        ] }),
        error && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200", children: error }),
        message && /* @__PURE__ */ jsx("p", { className: "text-green-500 text-sm bg-green-50 p-3 rounded-lg border border-green-200", children: message }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            className: "w-full bg-forge-orange text-white hover:bg-forge-orange-light transition-all duration-200 shadow-lg hover:shadow-xl font-semibold py-3 rounded-xl",
            disabled: loading,
            children: loading ? "Updating..." : "Update Password"
          }
        )
      ] }) }) })
    ] })
  ] });
}
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Item,
  {
    ref,
    className: cn("border-b", className),
    ...props
  }
));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
function CourseTableOfContents({ course, currentLessonId, onLessonClick }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState({});
  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      const allLessonIds = course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id));
      const { data, error } = await supabase.from("user_progress").select("lesson_id, status").eq("user_id", user.id).in("lesson_id", allLessonIds);
      if (error) {
        console.error("Error fetching progress:", error);
        return;
      }
      const progressMap = {};
      data.forEach((item) => {
        progressMap[item.lesson_id] = item.status;
      });
      allLessonIds.forEach((lessonId) => {
        if (!progressMap[lessonId]) {
          progressMap[lessonId] = "not_started";
        }
      });
      setProgress(progressMap);
    };
    fetchProgress();
  }, [user, course]);
  const getProgressIcon = (lessonId) => {
    const status = progress[lessonId] || "not_started";
    switch (status) {
      case "completed":
        return /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-600" });
      case "in_progress":
        return /* @__PURE__ */ jsx(Play, { className: "h-4 w-4 text-blue-600" });
      default:
        return /* @__PURE__ */ jsx(Circle, { className: "h-4 w-4 text-gray-400" });
    }
  };
  const getModuleProgress = (module) => {
    const totalLessons = module.lessons.length;
    const completedLessons = module.lessons.filter(
      (lesson) => progress[lesson.id] === "completed"
    ).length;
    return { completed: completedLessons, total: totalLessons };
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2", children: course.title }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-4", children: course.description }),
    /* @__PURE__ */ jsx(Accordion, { type: "multiple", defaultValue: course.modules.map((m) => m.id), className: "w-full", children: course.modules.map((module) => {
      const moduleProgress = getModuleProgress(module);
      return /* @__PURE__ */ jsxs(AccordionItem, { value: module.id, children: [
        /* @__PURE__ */ jsx(AccordionTrigger, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full pr-4", children: [
          /* @__PURE__ */ jsx("span", { children: module.title }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500", children: [
            moduleProgress.completed,
            "/",
            moduleProgress.total
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsx("ul", { children: module.lessons.map((lesson) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onLessonClick(lesson),
            className: `w-full text-left p-2 rounded-md flex items-center gap-2 transition-colors ${lesson.id === currentLessonId ? "bg-blue-100 border-l-4 border-blue-500" : "hover:bg-gray-100"}`,
            children: [
              getProgressIcon(lesson.id),
              /* @__PURE__ */ jsx("span", { className: "flex-1", children: lesson.title }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                lesson.xp_value,
                " XP"
              ] })
            ]
          }
        ) }, lesson.id)) }) })
      ] }, module.id);
    }) })
  ] });
}
function TextLesson({ content }) {
  return /* @__PURE__ */ jsx("div", { className: "prose max-w-none", children: /* @__PURE__ */ jsx(ReactMarkdown, { children: content }) });
}
function VideoLesson({ videoUrl }) {
  const getYouTubeEmbedUrl = (url) => {
    const regExp = new RegExp("^(?:https?:\\/\\/)?(?:www\\.)?(?:m\\.)?(?:youtube\\.com|youtu\\.be)\\/^(?:watch\\?v=|embed\\/|v\\/|)([^&?%]{11})");
    const match = url.match(regExp);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  };
  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  if (!embedUrl) {
    return /* @__PURE__ */ jsx("div", { className: "text-red-500", children: "Invalid YouTube video URL provided." });
  }
  return /* @__PURE__ */ jsx("div", { className: "relative", style: { paddingBottom: "56.25%", height: 0 }, children: /* @__PURE__ */ jsx(
    "iframe",
    {
      src: embedUrl,
      frameBorder: "0",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowFullScreen: true,
      className: "absolute top-0 left-0 w-full h-full",
      title: "YouTube video player"
    }
  ) });
}
const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Root,
    {
      className: cn("grid gap-2", className),
      ...props,
      ref
    }
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(RadioGroupPrimitive.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(Circle, { className: "h-2.5 w-2.5 fill-current text-current" }) })
    }
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
function QuizLesson({ quizData }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const currentQuestion = quizData[currentQuestionIndex];
  const handleSubmit = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    setShowResult(true);
  };
  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert(`Quiz Finished! Your score: ${score}/${quizData.length}`);
    }
  };
  if (!currentQuestion) {
    return /* @__PURE__ */ jsx("div", { className: "text-red-500", children: "No quiz data available." });
  }
  return /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "Quiz" }),
      /* @__PURE__ */ jsxs(CardDescription, { children: [
        "Question ",
        currentQuestionIndex + 1,
        " of ",
        quizData.length
      ] })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: currentQuestion.question }),
      /* @__PURE__ */ jsx(RadioGroup, { onValueChange: setSelectedAnswer, value: selectedAnswer, children: currentQuestion.options.map((option, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [
        /* @__PURE__ */ jsx(RadioGroupItem, { value: option, id: `option-${index}`, disabled: showResult }),
        /* @__PURE__ */ jsx(Label, { htmlFor: `option-${index}`, children: option })
      ] }, index)) }),
      !showResult && /* @__PURE__ */ jsx(Button, { onClick: handleSubmit, disabled: !selectedAnswer, className: "mt-6", children: "Submit Answer" }),
      showResult && /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
        selectedAnswer === currentQuestion.correctAnswer ? /* @__PURE__ */ jsx("p", { className: "text-green-600 font-semibold", children: "Correct!" }) : /* @__PURE__ */ jsxs("p", { className: "text-red-600 font-semibold", children: [
          "Incorrect. The correct answer was: ",
          currentQuestion.correctAnswer
        ] }),
        /* @__PURE__ */ jsx(Button, { onClick: handleNextQuestion, className: "mt-4", children: currentQuestionIndex < quizData.length - 1 ? "Next Question" : "Finish Quiz" })
      ] })
    ] })
  ] });
}
function LessonViewer({ lesson, course, onLessonChange }) {
  const { user } = useAuth();
  const [isCompleting, setIsCompleting] = useState(false);
  if (!lesson) {
    return /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsx("p", { children: "Select a lesson to begin." }) });
  }
  const getAllLessons = () => {
    if (!course) return [];
    return course.modules.flatMap((module) => module.lessons);
  };
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const markAsComplete = async () => {
    if (!user) {
      toast$1.error("You need to be logged in to track progress");
      return;
    }
    setIsCompleting(true);
    try {
      const { error } = await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          lesson_id: lesson.id,
          status: "completed",
          completed_at: (/* @__PURE__ */ new Date()).toISOString()
        },
        { onConflict: "user_id,lesson_id" }
      );
      if (error) throw error;
      toast$1.success("Lesson marked as completed!");
      if (nextLesson) {
        onLessonChange(nextLesson);
      }
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
      toast$1.error("Error marking lesson as completed");
    } finally {
      setIsCompleting(false);
    }
  };
  const renderLessonContent = () => {
    switch (lesson.lesson_type) {
      case "text":
        return /* @__PURE__ */ jsx(TextLesson, { content: lesson.content });
      case "video":
        return /* @__PURE__ */ jsx(VideoLesson, { videoUrl: lesson.content });
      case "quiz":
        return /* @__PURE__ */ jsx(QuizLesson, { quizData: typeof lesson.content === "string" ? JSON.parse(lesson.content) : lesson.content });
      default:
        return /* @__PURE__ */ jsxs("div", { className: "text-red-500", children: [
          "Unsupported lesson type: ",
          lesson.lesson_type
        ] });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col p-6 bg-white", children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: lesson.title }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500 mt-2", children: [
        "Lesson ",
        currentIndex + 1,
        " of ",
        allLessons.length,
        " • ",
        lesson.xp_value,
        " XP"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: renderLessonContent() }),
    /* @__PURE__ */ jsxs("footer", { className: "mt-6 border-t pt-4 flex justify-between", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          onClick: () => previousLesson && onLessonChange(previousLesson),
          disabled: !previousLesson,
          children: "Previous lesson"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: markAsComplete,
          disabled: isCompleting,
          children: isCompleting ? "Saving..." : nextLesson ? "Complete and Continue" : "Mark as Completed"
        }
      )
    ] })
  ] });
}
function CourseView() {
  const { courseId } = useParams();
  const [currentLesson, setCurrentLesson] = useState(null);
  const { data: course, isLoading } = useQuery({
    queryKey: ["courseView", courseId],
    enabled: Boolean(courseId),
    queryFn: async () => {
      const { data: courseData, error } = await supabase.from("courses").select(`
          id, title, description,
          modules:modules(id, title, order,
            lessons:lessons(id, title, content, lesson_type, order, xp_value)
          )
        `).eq("id", courseId).single();
      if (error) throw error;
      const normalized = {
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
        modules: (courseData.modules || []).map((m) => ({
          id: m.id,
          title: m.title,
          lessons: (m.lessons || []).map((l) => ({
            id: l.id,
            title: l.title,
            content: l.content,
            lesson_type: l.lesson_type,
            xp_value: l.xp_value ?? 0
          }))
        }))
      };
      if (normalized.modules.length && normalized.modules[0].lessons.length) {
        setCurrentLesson(normalized.modules[0].lessons[0]);
      }
      return normalized;
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
    /* @__PURE__ */ jsx("div", { className: "w-80 shrink-0 border rounded-md bg-white", children: isLoading || !course ? /* @__PURE__ */ jsx("div", { className: "p-4 text-gray-500", children: "Loading course..." }) : /* @__PURE__ */ jsx(
      CourseTableOfContents,
      {
        course,
        currentLessonId: currentLesson == null ? void 0 : currentLesson.id,
        onLessonClick: setCurrentLesson
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 border rounded-md bg-white min-h-[60vh]", children: /* @__PURE__ */ jsx(LessonViewer, { lesson: currentLesson, course: course ?? null, onLessonChange: setCurrentLesson }) })
  ] });
}
const getButtonClasses = (variant, size) => {
  const baseClasses = "relative group overflow-hidden rounded-2xl font-semibold transition-all duration-200 transform hover:scale-[1.02]";
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  const variantClasses = {
    primary: "bg-forge-orange text-white hover:bg-forge-orange-light shadow-lg hover:shadow-xl",
    secondary: "bg-forge-dark text-white hover:bg-forge-dark/90 shadow-lg hover:shadow-xl",
    outline: "border-2 border-forge-orange text-forge-orange hover:bg-forge-orange hover:text-white",
    ghost: "text-forge-dark hover:bg-forge-cream/50"
  };
  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
};
const EnhancedButton = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  withGradient = false,
  withIcon = false,
  className,
  asChild = false,
  ...props
}) => {
  var _a, _b;
  const gradientOverlay = withGradient && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-forge-orange to-forge-orange-light opacity-0 group-hover:opacity-100 transition-opacity duration-200" });
  const defaultIcon = withIcon && !icon && /* @__PURE__ */ jsx(Flame, { size: 16 });
  const displayIcon = icon || defaultIcon;
  if (asChild && React__default.isValidElement(children)) {
    const childElement = children;
    const mergedClassName = cn(
      getButtonClasses(variant, size),
      (_a = childElement.props) == null ? void 0 : _a.className,
      className
    );
    return React__default.cloneElement(
      childElement,
      {
        ...props,
        className: mergedClassName
      },
      /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("span", { className: "relative z-10 flex items-center gap-2", children: [
          displayIcon,
          (_b = childElement.props) == null ? void 0 : _b.children
        ] }),
        gradientOverlay
      ] })
    );
  }
  return /* @__PURE__ */ jsxs("button", { className: cn(getButtonClasses(variant, size), className), ...props, children: [
    /* @__PURE__ */ jsxs("span", { className: "relative z-10 flex items-center gap-2", children: [
      displayIcon,
      children
    ] }),
    gradientOverlay
  ] });
};
const DASHBOARD_STRINGS = {
  dashboardHome: {
    badge: "Welcome back",
    headlineSuffix: ", ready to continue your journey?",
    exploreCta: "View all paths"
  },
  availablePaths: {
    loadingError: "Error loading learning paths",
    mustLoginToEnroll: "You must be logged in to enroll",
    enrolledBadge: "Enrolled",
    enroll: "Enroll",
    enrolling: "Enrolling...",
    enrollSuccess: "Enrolled successfully!",
    enrollError: "Error while enrolling",
    continueLearning: "Continue learning",
    viewDetails: "View details",
    courses: (count2) => `${count2} course${count2 !== 1 ? "s" : ""}`
  },
  pathOverview: {
    notFound: "Learning path not found.",
    badge: "Path",
    continue: "Continue",
    enroll: "Enroll",
    enrolling: "Enrolling..."
  }
};
function PathOverview() {
  const { pathId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["pathOverview", pathId, user == null ? void 0 : user.id],
    enabled: Boolean(pathId),
    queryFn: async () => {
      const { data: pathData, error: pathError } = await supabase.from("learning_paths").select("id, title, description, courses(id, title, description)").eq("id", pathId).single();
      if (pathError) throw pathError;
      const path2 = {
        id: pathData.id,
        title: pathData.title,
        description: pathData.description,
        courses: (pathData.courses || []).map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description
        }))
      };
      let isEnrolled2 = false;
      if (user) {
        const { data: enroll, error: enrollErr } = await supabase.from("user_enrollments").select("learning_path_id").eq("user_id", user.id).eq("learning_path_id", pathId).eq("is_active", true).maybeSingle();
        if (!enrollErr) isEnrolled2 = Boolean(enroll);
      }
      return { path: path2, isEnrolled: isEnrolled2 };
    }
  });
  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!user || !pathId) throw new Error("Not authenticated");
      const { error } = await supabase.from("user_enrollments").insert({ user_id: user.id, learning_path_id: pathId });
      if (error) throw error;
    },
    onSuccess: () => {
      toast$1.success(DASHBOARD_STRINGS.pathOverview.continue);
      queryClient.invalidateQueries({ queryKey: ["availablePaths"] });
      queryClient.invalidateQueries({ queryKey: ["myPaths"] });
      queryClient.invalidateQueries({ queryKey: ["pathOverview"] });
    },
    onError: () => toast$1.error(DASHBOARD_STRINGS.availablePaths.enrollError)
  });
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [...Array(2)].map((_, i) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded mb-2" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded mb-4" }),
      /* @__PURE__ */ jsx("div", { className: "h-20 bg-gray-100 rounded" })
    ] }) }) }, i)) });
  }
  if (!data) {
    return /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: DASHBOARD_STRINGS.pathOverview.notFound });
  }
  const { path, isEnrolled } = data;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center px-2 py-1 rounded bg-forge-orange/10 text-forge-orange text-xs font-medium", children: DASHBOARD_STRINGS.pathOverview.badge }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mt-2 text-forge-dark", children: path.title }),
      path.description && /* @__PURE__ */ jsx("p", { className: "mt-2 text-forge-gray", children: path.description })
    ] }),
    !isEnrolled ? /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      EnhancedButton,
      {
        onClick: () => enrollMutation.mutate(),
        disabled: !user || enrollMutation.isPending,
        withGradient: true,
        children: enrollMutation.isPending ? DASHBOARD_STRINGS.pathOverview.enrolling : DASHBOARD_STRINGS.pathOverview.enroll
      }
    ) }) : /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(EnhancedButton, { asChild: true, withGradient: true, children: /* @__PURE__ */ jsx(Link, { to: path.courses[0] ? DASHBOARD_LEARN_COURSE(path.courses[0].id) : "#", children: DASHBOARD_STRINGS.pathOverview.continue }) }) }),
    /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Courses" }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: path.courses.map((course) => /* @__PURE__ */ jsxs(Card, { className: "border-forge-cream", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-forge-dark", children: course.title }),
          course.description && /* @__PURE__ */ jsx(CardDescription, { className: "text-forge-gray", children: course.description })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(EnhancedButton, { asChild: true, variant: "outline", className: "w-full", children: /* @__PURE__ */ jsx(Link, { to: DASHBOARD_LEARN_COURSE(course.id), children: DASHBOARD_STRINGS.availablePaths.viewDetails }) }) })
      ] }, course.id)) })
    ] })
  ] });
}
function AvailablePaths({ limit, className }) {
  const { user } = useAuth();
  const [enrollingId, setEnrollingId] = useState(null);
  const queryClient = useQueryClient();
  const supabase2 = createClientBrowser();
  const { data: paths = [], isLoading } = useQuery({
    queryKey: ["availablePaths", user == null ? void 0 : user.id],
    queryFn: async () => {
      const { data: pathsData, error: pathsError } = await supabase2.from("learning_paths").select(`
          id, title, description,
          courses!inner(id)
        `);
      if (pathsError) throw pathsError;
      let enrolledPaths = [];
      if (user) {
        const { data: enrollments, error: enrollmentError } = await supabase2.from("user_enrollments").select("learning_path_id").eq("user_id", user.id).eq("is_active", true);
        if (enrollmentError) {
          console.error("Error fetching enrollments:", enrollmentError);
        } else {
          enrolledPaths = (enrollments || []).map((e) => e.learning_path_id);
        }
      }
      return (pathsData || []).map((path) => ({
        id: path.id,
        title: path.title,
        description: path.description,
        isEnrolled: enrolledPaths.includes(path.id),
        courseCount: path.courses.length
      }));
    }
  });
  const enrollMutation = useMutation({
    mutationFn: async (pathId) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase2.from("user_enrollments").insert({ user_id: user.id, learning_path_id: pathId });
      if (error) throw error;
      return pathId;
    },
    onMutate: (pathId) => {
      setEnrollingId(pathId);
    },
    onSuccess: () => {
      toast$1.success(DASHBOARD_STRINGS.availablePaths.enrollSuccess);
      queryClient.invalidateQueries({ queryKey: ["availablePaths"] });
      queryClient.invalidateQueries({ queryKey: ["myPaths"] });
    },
    onError: (error) => {
      console.error("Error enrolling:", error);
      toast$1.error(DASHBOARD_STRINGS.availablePaths.enrollError);
    },
    onSettled: () => setEnrollingId(null)
  });
  const handleEnroll = async (pathId) => {
    if (!user) {
      toast$1.error(DASHBOARD_STRINGS.availablePaths.mustLoginToEnroll);
      return;
    }
    enrollMutation.mutate(pathId);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: [...Array(limit || 3)].map((_, i) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded" }),
      /* @__PURE__ */ jsx("div", { className: "h-8 bg-gray-200 rounded mt-4" })
    ] }) }) }, i)) });
  }
  const visiblePaths = typeof limit === "number" && limit > 0 ? paths.slice(0, limit) : paths;
  return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch", children: visiblePaths.map((path) => /* @__PURE__ */ jsxs(
    Card,
    {
      className: `relative border-forge-cream/80 hover:shadow-md transition-shadow h-full min-h-[300px] flex flex-col ${path.isEnrolled ? "ring-1 ring-forge-orange/20" : ""}`,
      children: [
        path.isEnrolled && /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 bg-forge-orange text-white px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 shadow-sm", children: [
          /* @__PURE__ */ jsx(Flame, { className: "h-3 w-3" }),
          DASHBOARD_STRINGS.availablePaths.enrolledBadge
        ] }),
        /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-start gap-2 text-forge-dark tracking-normal text-lg md:text-xl leading-tight line-clamp-2 break-words", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4 mt-0.5 text-forge-orange shrink-0" }),
            /* @__PURE__ */ jsx("span", { children: path.title })
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-[13px] text-forge-gray line-clamp-3 min-h-[3.75rem]", children: path.description }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-forge-gray", children: [
            /* @__PURE__ */ jsx(Users, { className: "h-3.5 w-3.5 text-forge-orange" }),
            DASHBOARD_STRINGS.availablePaths.courses(path.courseCount || 0)
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-2 mt-auto", children: path.isEnrolled ? /* @__PURE__ */ jsx(Link, { to: DASHBOARD_LEARN_PATH(path.id), children: /* @__PURE__ */ jsx(EnhancedButton, { className: "w-full text-sm py-2", size: "sm", withGradient: true, children: DASHBOARD_STRINGS.availablePaths.continueLearning }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            EnhancedButton,
            {
              onClick: () => handleEnroll(path.id),
              disabled: enrollingId === path.id || !user,
              className: "w-full text-sm py-2",
              variant: "outline",
              size: "sm",
              children: enrollingId === path.id ? DASHBOARD_STRINGS.availablePaths.enrolling : DASHBOARD_STRINGS.availablePaths.enroll
            }
          ),
          user && /* @__PURE__ */ jsx(Link, { to: DASHBOARD_LEARN_PATH(path.id), children: /* @__PURE__ */ jsx(EnhancedButton, { variant: "ghost", size: "sm", className: "w-full", children: DASHBOARD_STRINGS.availablePaths.viewDetails }) })
        ] }) })
      ]
    },
    path.id
  )) }) });
}
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();
  if (loading) {
    return null;
  }
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const isLoginPage = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/forgot-password" || location.pathname === "/login-oauth";
  if (isDashboardRoute) {
    return null;
  }
  if (isLoginPage) {
    return /* @__PURE__ */ jsx("nav", { className: "fixed top-4 left-0 right-0 z-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "flex justify-start items-center h-20", children: /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center space-x-3", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "https://cdn.builder.io/api/v1/assets/a59c9d8d677c4c99bcaffef64866607b/forgecollege-2c35f0?format=webp&width=800",
        alt: "Forge College",
        className: "h-12 w-auto",
        style: { minWidth: "120px" }
      }
    ) }) }) }) });
  }
  const landingPageNavItems = [
    { path: "/", label: "For Professionals" },
    { path: "/companies", label: "For Companies" },
    { path: "/investors", label: "For Investors" }
  ];
  return /* @__PURE__ */ jsx("nav", { className: "fixed top-4 left-0 right-0 z-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center h-20", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center space-x-3", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "https://cdn.builder.io/api/v1/assets/a59c9d8d677c4c99bcaffef64866607b/forgecollege-2c35f0?format=webp&width=800",
          alt: "Forge College",
          className: "h-12 w-auto",
          style: { minWidth: "120px" }
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center bg-forge-cream/95 backdrop-blur-sm rounded-2xl border border-forge-orange/20 shadow-lg overflow-hidden", children: landingPageNavItems.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.path,
            className: `px-6 py-3 text-sm font-semibold transition-all duration-300 relative group ${location.pathname === item.path ? "text-white" : "text-forge-gray hover:text-forge-dark"}`,
            children: [
              location.pathname === item.path && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-forge-orange rounded-full m-1 -z-10" }),
              location.pathname !== item.path && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-forge-dark/20 rounded-full m-1 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
              item.label
            ]
          }
        ),
        index < landingPageNavItems.length - 1 && /* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-forge-gray/30" })
      ] }, item.path)) }),
      /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center space-x-3", children: user ? /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/dashboard",
            className: "bg-forge-dark text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forge-dark/80 transition-colors shadow-lg",
            children: "Dashboard"
          }
        ),
        /* @__PURE__ */ jsx(ProfileDropdown, {})
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/login",
            className: "text-forge-orange transition-colors px-4 py-2 rounded-lg text-sm font-medium hover:bg-forge-cream/50",
            children: "Sign In"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/signup",
            className: "bg-forge-orange text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-forge-orange-dark transition-colors shadow-lg border border-forge-orange",
            children: "Sign Up"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsOpen(!isOpen),
          className: "text-forge-dark hover:text-forge-orange transition-colors p-2 bg-forge-cream/95 backdrop-blur-sm rounded-xl border border-forge-orange/20 shadow-lg",
          children: isOpen ? /* @__PURE__ */ jsx(X, { size: 24 }) : /* @__PURE__ */ jsx(Menu, { size: 24 })
        }
      ) })
    ] }),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "md:hidden py-6 bg-forge-cream/95 backdrop-blur-sm rounded-2xl mx-4 mt-4 border border-forge-orange/20 shadow-lg overflow-hidden", children: [
      landingPageNavItems.map((item, index) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.path,
            onClick: () => setIsOpen(false),
            className: `block py-4 px-6 text-base font-semibold transition-colors relative group ${location.pathname === item.path ? "text-white" : "text-forge-gray hover:text-forge-dark"}`,
            children: [
              location.pathname === item.path && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-forge-orange rounded-full m-1 -z-10" }),
              location.pathname !== item.path && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-forge-dark/20 rounded-full m-1 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
              item.label
            ]
          }
        ),
        index < landingPageNavItems.length - 1 && /* @__PURE__ */ jsx("div", { className: "h-px bg-forge-gray/30 mx-6" })
      ] }, item.path)),
      user ? /* @__PURE__ */ jsxs("div", { className: "pt-4 mt-4 space-y-3 px-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/dashboard",
            onClick: () => setIsOpen(false),
            className: "block text-center py-3 px-6 rounded-lg text-base font-medium bg-forge-dark text-white hover:bg-forge-dark/80 transition-colors shadow-lg",
            children: "Dashboard"
          }
        ),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(ProfileDropdown, {}) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "pt-4 mt-4 space-y-3 px-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/login",
            onClick: () => setIsOpen(false),
            className: "block text-center py-3 px-6 rounded-lg text-base font-medium text-forge-orange hover:bg-forge-orange/10 transition-colors",
            children: "Sign In"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/signup",
            onClick: () => setIsOpen(false),
            className: "block text-center py-3 px-6 rounded-full text-base font-semibold bg-forge-orange text-white hover:bg-forge-orange-dark transition-colors shadow-lg border border-forge-orange",
            children: "Sign Up"
          }
        )
      ] })
    ] })
  ] }) });
};
function PublicLayout() {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
function ContinueLearningCard({ className }) {
  const { user } = useAuth();
  const [recentCourse, setRecentCourse] = useState(null);
  const { isLoading } = useQuery({
    queryKey: ["continueLearning", user == null ? void 0 : user.id],
    enabled: !!(user == null ? void 0 : user.id),
    queryFn: async () => {
      const { data: progressData } = await supabase.from("user_progress").select("lesson_id").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(1).maybeSingle();
      if (!progressData) return null;
      const { data: lessonData, error: lessonError } = await supabase.from("lessons").select("modules(courses(id, title, description))").eq("id", progressData.lesson_id).single();
      if (lessonError || !lessonData) return null;
      const moduleEntry = Array.isArray(lessonData.modules) ? lessonData.modules[0] : lessonData.modules;
      const courseEntry = moduleEntry ? Array.isArray(moduleEntry.courses) ? moduleEntry.courses[0] : moduleEntry.courses : null;
      if (!courseEntry) return null;
      const course = {
        id: courseEntry.id,
        title: courseEntry.title,
        description: courseEntry.description
      };
      setRecentCourse(course);
      return course;
    }
  });
  const placeholder = /* @__PURE__ */ jsxs(Card, { className: `bg-blue-50/60 border-blue-100 mb-8 h-full min-h-[220px] flex flex-col ${className || ""}`, children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: "Pick up where you left off" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "You were studying:" })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "h-10 w-2/3 bg-blue-100 animate-pulse rounded" }) })
  ] });
  if (isLoading) return placeholder;
  if (!recentCourse) return null;
  return /* @__PURE__ */ jsxs(Card, { className: `bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 mb-8 h-full min-h-[220px] flex flex-col ${className || ""}`, children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl tracking-tight", children: "Pick up where you left off" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "You were studying:" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl font-semibold pt-2", children: recentCourse.title })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Link, { to: DASHBOARD_LEARN_COURSE(recentCourse.id), children: /* @__PURE__ */ jsx(Button, { size: "lg", className: "w-full md:w-auto", children: "Continue learning" }) }) })
  ] });
}
function UserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalXP: 0,
    completedLessons: 0,
    inProgressPaths: 0,
    totalTimeSpent: 0
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data: progressData, error: progressError } = await supabase.from("user_progress").select(`
            status,
            lessons!inner(
              xp_value,
              modules!inner(
                courses!inner(path_id)
              )
            )
          `).eq("user_id", user.id).in("status", ["in_progress", "completed"]);
        if (progressError) throw progressError;
        const completedLessons = (progressData || []).filter((p) => p.status === "completed").length;
        const totalXP = (progressData || []).reduce((sum, p) => {
          var _a;
          return sum + (((_a = p.lessons) == null ? void 0 : _a.xp_value) || 0);
        }, 0);
        const pathIds = /* @__PURE__ */ new Set();
        (progressData || []).forEach((p) => {
          var _a, _b, _c;
          const pid = (_c = (_b = (_a = p == null ? void 0 : p.lessons) == null ? void 0 : _a.modules) == null ? void 0 : _b.courses) == null ? void 0 : _c.path_id;
          if (pid) pathIds.add(pid);
        });
        const inProgressPaths = pathIds.size;
        setStats({
          totalXP,
          completedLessons,
          inProgressPaths,
          totalTimeSpent: Math.max(0, Math.floor(completedLessons * 15))
        });
      } catch (error) {
        console.error("Error fetching user statistics:", error);
        setStats({
          totalXP: 150,
          completedLessons: 12,
          inProgressPaths: 3,
          totalTimeSpent: 180
        });
      }
      setLoading(false);
    };
    fetchStats();
  }, [user]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-4", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 bg-gray-200 rounded mb-2" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded" })
    ] }) }) }, i)) });
  }
  const statCards = [
    {
      title: "Total XP",
      value: stats.totalXP,
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100"
    },
    {
      title: "Completed Lessons",
      value: stats.completedLessons,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100"
    },
    {
      title: "Active Paths",
      value: stats.inProgressPaths,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100"
    },
    {
      title: "Study Time",
      value: `${stats.totalTimeSpent} min`,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100"
    }
  ];
  return /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-4", children: statCards.map((stat, index) => {
    const Icon = stat.icon;
    return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsx("div", { className: `${stat.bgColor} p-2 rounded-md shadow-inner`, children: /* @__PURE__ */ jsx(Icon, { className: `h-6 w-6 ${stat.color}` }) }),
      /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-600", children: stat.title }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold tracking-tight", children: stat.value })
      ] })
    ] }) }) }, index);
  }) });
}
const Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;
const WEEKLY_GOAL = 5;
function LearningHabits({ className }) {
  const { user } = useAuth();
  const { data: completions = [], isLoading } = useQuery({
    queryKey: ["learningHabits", user == null ? void 0 : user.id],
    enabled: !!(user == null ? void 0 : user.id),
    queryFn: async () => {
      const { data, error } = await supabase.from("user_progress").select("completed_at").eq("user_id", user.id).eq("status", "completed").not("completed_at", "is", null).order("completed_at", { ascending: false }).limit(200);
      if (error) throw error;
      return data;
    }
  });
  const { streakDays, weekCount, weekSeries } = useMemo(() => {
    const byDay = /* @__PURE__ */ new Map();
    for (const row of completions) {
      if (!row.completed_at) continue;
      const date = new Date(row.completed_at);
      const key = date.toISOString().slice(0, 10);
      byDay.set(key, (byDay.get(key) || 0) + 1);
    }
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    for (let d = new Date(today); ; d.setDate(d.getDate() - 1)) {
      const key = d.toISOString().slice(0, 10);
      const count2 = byDay.get(key) || 0;
      if (streak === 0 && count2 === 0) {
        break;
      }
      if (count2 > 0) {
        streak += 1;
      } else {
        break;
      }
    }
    const last7 = [];
    let weekSum = 0;
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const key = day.toISOString().slice(0, 10);
      const count2 = byDay.get(key) || 0;
      last7.push(count2);
      weekSum += count2;
    }
    return {
      streakDays: streak,
      weekCount: weekSum,
      weekSeries: last7
    };
  }, [completions]);
  return /* @__PURE__ */ jsxs(Card, { className: `h-full min-h-[220px] flex flex-col ${className || ""}`, children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Study habits" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Current streak" }),
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-semibold", children: [
            isLoading ? "-" : streakDays,
            " day",
            !isLoading && streakDays !== 1 ? "s" : ""
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Keep it going daily" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Weekly goal" }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium", children: [
            isLoading ? "-" : weekCount,
            "/",
            WEEKLY_GOAL,
            " lessons"
          ] })
        ] }),
        /* @__PURE__ */ jsx(Progress, { value: Math.min(100, weekCount / WEEKLY_GOAL * 100) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1", children: weekSeries.map((v, idx) => /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-1", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "w-6 rounded bg-forge-orange/20",
          style: { height: Math.max(6, Math.min(28, v * 8)) },
          title: `${v} completions`
        }
      ) }, idx)) })
    ] })
  ] });
}
function DashboardHome() {
  const { user } = useAuth();
  const getUserDisplayName = () => {
    var _a, _b;
    console.log("User data:", user);
    console.log("User metadata:", user == null ? void 0 : user.user_metadata);
    if ((_a = user == null ? void 0 : user.user_metadata) == null ? void 0 : _a.full_name) {
      return user.user_metadata.full_name;
    }
    if ((_b = user == null ? void 0 : user.user_metadata) == null ? void 0 : _b.name) {
      return user.user_metadata.name;
    }
    if (user == null ? void 0 : user.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxs("div", { className: "text-gray-500", children: [
      /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-2 text-sm rounded-full bg-forge-cream text-forge-dark px-2 py-0.5 mr-2", children: DASHBOARD_STRINGS.dashboardHome.badge }),
      /* @__PURE__ */ jsx("span", { className: "font-medium text-forge-dark", children: getUserDisplayName() }),
      DASHBOARD_STRINGS.dashboardHome.headlineSuffix
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "col-span-12 lg:col-span-8 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "col-span-12 xl:col-span-8", children: /* @__PURE__ */ jsx(ContinueLearningCard, { className: "mb-0" }) }),
          /* @__PURE__ */ jsx("div", { className: "col-span-12 xl:col-span-4", children: /* @__PURE__ */ jsx(LearningHabits, { className: "mb-0" }) })
        ] }),
        /* @__PURE__ */ jsx(UserStats, {})
      ] }),
      /* @__PURE__ */ jsx("div", { className: "col-span-12 lg:col-span-4 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 sticky top-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold tracking-tight", children: ROUTE_LABELS[DASHBOARD_EXPLORE] }),
          /* @__PURE__ */ jsx(Link, { to: DASHBOARD_EXPLORE, className: "text-forge-orange hover:underline", children: DASHBOARD_STRINGS.dashboardHome.exploreCta })
        ] }),
        /* @__PURE__ */ jsx(AvailablePaths, { limit: 3, className: "mt-2" })
      ] }) })
    ] })
  ] });
}
const STORAGE_KEY = "forge-college-student-profile";
async function getProfile() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    fullName: "",
    email: "",
    country: "",
    city: "",
    languages: [],
    yearsExperience: 0,
    stacks: [],
    skillsToDevelop: [],
    positionCompany: "",
    linkedinUrl: "",
    githubUrl: ""
  };
}
async function updateProfile(data) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  if (Math.random() < 0.01) {
    throw new Error("Failed to update profile. Please try again.");
  }
}
const tabs = [
  {
    id: "personal",
    label: "Personal Information",
    icon: User,
    description: "Basic personal details and contact information"
  },
  {
    id: "professional",
    label: "Professional Profile",
    icon: Briefcase,
    description: "Work experience, skills, and career information"
  },
  {
    id: "learning",
    label: "Learning Progress",
    icon: BookOpen,
    description: "Track your learning journey and achievements"
  },
  {
    id: "career",
    label: "Career Preferences",
    icon: Target,
    description: "Job preferences and career goals"
  }
];
function ProfileSidebar({ activeTab, onTabChange }) {
  return /* @__PURE__ */ jsx("div", { className: "space-y-2", children: tabs.map((tab) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => onTabChange(tab.id),
        className: cn(
          "w-full text-left p-4 rounded-lg transition-all duration-200",
          "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
          isActive ? "bg-orange-500 text-white shadow-md" : "bg-white text-gray-700 hover:text-gray-900"
        ),
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Icon, { className: cn("h-5 w-5", isActive ? "text-white" : "text-gray-500") }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: tab.label }),
            /* @__PURE__ */ jsx("div", { className: cn("text-sm mt-1", isActive ? "text-orange-100" : "text-gray-500"), children: tab.description })
          ] })
        ] })
      },
      tab.id
    );
  }) });
}
function SectionCard({ title, description, children, className }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("bg-white rounded-lg shadow-sm border border-gray-200 p-6", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900", children: title }),
      description && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-1", children: description })
    ] }),
    children
  ] });
}
function FormField({ label, required = false, error, description, children, className }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("space-y-2", className), children: [
    /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-gray-700", children: [
      label,
      required && /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
    ] }),
    children,
    description && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: description }),
    error && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: error })
  ] });
}
function TagInput({ value, onChange, placeholder = "Type and press Enter", className, disabled }) {
  const [inputValue, setInputValue] = useState("");
  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
      setInputValue("");
    }
  };
  const removeTag = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: cn("space-y-2", className), children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 min-h-[40px] p-2 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500", children: [
    value.map((tag, index) => /* @__PURE__ */ jsxs(
      "span",
      {
        className: "inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded-md",
        children: [
          tag,
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => removeTag(tag),
              disabled,
              className: "text-orange-600 hover:text-orange-800 disabled:opacity-50",
              children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
            }
          )
        ]
      },
      index
    )),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: inputValue,
        onChange: (e) => setInputValue(e.target.value),
        onKeyDown: handleKeyDown,
        placeholder: value.length === 0 ? placeholder : "",
        disabled,
        className: "flex-1 min-w-[120px] outline-none text-sm bg-transparent placeholder-gray-400"
      }
    )
  ] }) });
}
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const countries = [
  "Brazil",
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Switzerland",
  "Austria",
  "Belgium",
  "Portugal",
  "Ireland",
  "Australia",
  "New Zealand",
  "Japan",
  "South Korea",
  "Singapore",
  "India",
  "China",
  "Mexico",
  "Argentina",
  "Chile",
  "Colombia",
  "Peru",
  "Uruguay",
  "Paraguay",
  "Venezuela",
  "Ecuador",
  "Bolivia",
  "Guyana",
  "Suriname",
  "French Guiana"
];
function Profile() {
  const { user } = useAuth();
  const { toast: toast2 } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    loadProfile();
  }, []);
  useEffect(() => {
    if (profile) {
      setHasChanges(true);
    }
  }, [profile]);
  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      if (user == null ? void 0 : user.email) {
        data.email = user.email;
      }
      setProfile(data);
    } catch (error) {
      toast2({
        title: "Error",
        description: "Failed to load profile. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    if (!profile) return;
    const newErrors = {};
    if (!profile.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!profile.country.trim()) {
      newErrors.country = "Country is required";
    }
    if (profile.linkedinUrl && !isValidUrl(profile.linkedinUrl)) {
      newErrors.linkedinUrl = "Please enter a valid LinkedIn URL";
    }
    if (profile.githubUrl && !isValidUrl(profile.githubUrl)) {
      newErrors.githubUrl = "Please enter a valid GitHub URL";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast2({
        title: "Validation Error",
        description: "Please fix the errors before saving."
      });
      return;
    }
    try {
      setSaving(true);
      await updateProfile(profile);
      setErrors({});
      setHasChanges(false);
      toast2({
        title: "Success",
        description: "Profile updated successfully!"
      });
    } catch (error) {
      toast2({
        title: "Error",
        description: "Failed to update profile. Please try again."
      });
    } finally {
      setSaving(false);
    }
  };
  const updateField = (field, value) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [field]: value
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: void 0
      });
    }
  };
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-orange-500" }),
      /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Loading profile..." })
    ] }) });
  }
  if (!profile) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Failed to load profile" }),
      /* @__PURE__ */ jsx(Button, { onClick: loadProfile, className: "mt-4", children: "Try Again" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "My Profile" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-2", children: "Manage your personal and professional information" })
    ] }),
    hasChanges && /* @__PURE__ */ jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-yellow-800", children: [
      /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-yellow-500 rounded-full" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "You have unsaved changes" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsx(ProfileSidebar, { activeTab, onTabChange: setActiveTab }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3", children: [
        activeTab === "personal" && /* @__PURE__ */ jsx(
          SectionCard,
          {
            title: "Personal Information",
            description: "Update your basic personal details and contact information",
            children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsx(FormField, { label: "Full Name", required: true, error: errors.fullName, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(User, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: profile.fullName,
                    onChange: (e) => updateField("fullName", e.target.value),
                    placeholder: "Enter your full name",
                    className: "pl-10"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxs(FormField, { label: "Email", required: true, children: [
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      value: profile.email,
                      disabled: true,
                      className: "pl-10 bg-gray-50"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Email can only be changed in your account settings" })
              ] }),
              /* @__PURE__ */ jsx(FormField, { label: "Country", required: true, error: errors.country, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Globe, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                /* @__PURE__ */ jsxs(Select, { value: profile.country, onValueChange: (value) => updateField("country", value), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "pl-10", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select your country" }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: countries.map((country) => /* @__PURE__ */ jsx(SelectItem, { value: country, children: country }, country)) })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx(FormField, { label: "City", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: profile.city,
                    onChange: (e) => updateField("city", e.target.value),
                    placeholder: "Enter your city",
                    className: "pl-10"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(FormField, { label: "Languages", description: "Add languages you speak", children: /* @__PURE__ */ jsx(
                TagInput,
                {
                  value: profile.languages,
                  onChange: (value) => updateField("languages", value),
                  placeholder: "Type a language and press Enter"
                }
              ) }) })
            ] })
          }
        ),
        activeTab === "professional" && /* @__PURE__ */ jsx(
          SectionCard,
          {
            title: "Professional Profile",
            description: "Share your work experience, skills, and career information",
            children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsx(FormField, { label: "Years of Experience in Technology", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Briefcase, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    min: "0",
                    value: profile.yearsExperience,
                    onChange: (e) => updateField("yearsExperience", parseInt(e.target.value) || 0),
                    placeholder: "0",
                    className: "pl-10"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx(FormField, { label: "Position & Company", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Building, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: profile.positionCompany,
                    onChange: (e) => updateField("positionCompany", e.target.value),
                    placeholder: "e.g., Senior Backend @ ACME",
                    className: "pl-10"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(FormField, { label: "Stacks Dominated", description: "Technologies you're proficient in", children: /* @__PURE__ */ jsx(
                TagInput,
                {
                  value: profile.stacks,
                  onChange: (value) => updateField("stacks", value),
                  placeholder: "e.g., Java, Python, Solidity, React"
                }
              ) }) }),
              /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(FormField, { label: "Skills to Develop", description: "Areas you want to improve", children: /* @__PURE__ */ jsx(
                TagInput,
                {
                  value: profile.skillsToDevelop,
                  onChange: (value) => updateField("skillsToDevelop", value),
                  placeholder: "e.g., DeFi, Smart Contracts, Web3"
                }
              ) }) }),
              /* @__PURE__ */ jsx(FormField, { label: "LinkedIn URL", error: errors.linkedinUrl, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Linkedin, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: profile.linkedinUrl,
                    onChange: (e) => updateField("linkedinUrl", e.target.value),
                    placeholder: "https://linkedin.com/in/username",
                    className: "pl-10"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx(FormField, { label: "GitHub URL", error: errors.githubUrl, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Github, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: profile.githubUrl,
                    onChange: (e) => updateField("githubUrl", e.target.value),
                    placeholder: "https://github.com/username",
                    className: "pl-10"
                  }
                )
              ] }) })
            ] })
          }
        ),
        activeTab === "learning" && /* @__PURE__ */ jsx(
          SectionCard,
          {
            title: "Learning Progress",
            description: "Track your learning journey and achievements",
            children: /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
              /* @__PURE__ */ jsx(BookOpen, { className: "h-16 w-16 text-gray-300 mx-auto mb-4" }),
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Coming Soon" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Learning progress tracking will be available in the next update." })
            ] })
          }
        ),
        activeTab === "career" && /* @__PURE__ */ jsx(
          SectionCard,
          {
            title: "Career Preferences",
            description: "Set your job preferences and career goals",
            children: /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
              /* @__PURE__ */ jsx(Target, { className: "h-16 w-16 text-gray-300 mx-auto mb-4" }),
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Coming Soon" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Career preferences will be available in the next update." })
            ] })
          }
        ),
        activeTab === "personal" || activeTab === "professional" ? /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleSave,
            disabled: saving || !hasChanges,
            className: "bg-orange-500 hover:bg-orange-600 text-white",
            children: saving ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }),
              "Saving..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Save, { className: "h-4 w-4 mr-2" }),
              "Save Changes"
            ] })
          }
        ) }) : null
      ] })
    ] })
  ] });
}
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-[40vh] flex items-center justify-center text-gray-500", children: "Loading..." });
  }
  if (!user) {
    return /* @__PURE__ */ jsx(Navigate, { to: LOGIN, replace: true, state: { from: location } });
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
function LoginOAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const supabase2 = createClientBrowser();
  async function signInWith(provider) {
    try {
      setIsLoading(true);
      setError(null);
      const { error: error2 } = await supabase2.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error2) {
        throw error2;
      }
    } catch (err) {
      console.error("OAuth error:", err);
      setError(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Sign in to Forge College" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: "Choose your preferred authentication method" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-4", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => signInWith("google"),
          disabled: isLoading,
          className: "group relative w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forge-orange disabled:opacity-50 disabled:cursor-not-allowed",
          children: [
            /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5 mr-3", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
              /* @__PURE__ */ jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
              /* @__PURE__ */ jsx("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }),
              /* @__PURE__ */ jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
            ] }),
            "Continue with Google"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => signInWith("github"),
          disabled: isLoading,
          className: "group relative w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 mr-3", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z", clipRule: "evenodd" }) }),
            "Continue with GitHub"
          ]
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "mt-4 bg-red-50 border border-red-200 rounded-md p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }),
      /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-800", children: error }) })
    ] }) }),
    isLoading && /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center", children: [
      /* @__PURE__ */ jsxs("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-forge-orange", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
        /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Redirecting to authentication..." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => navigate("/"),
        className: "text-forge-orange hover:text-forge-orange-dark text-sm font-medium",
        children: "← Back to Home"
      }
    ) })
  ] }) });
}
function AuthCallback() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Signing you in...");
  const navigate = useNavigate();
  const supabase2 = createClientBrowser();
  useEffect(() => {
    async function handleCallback() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        const { data: { session }, error } = await supabase2.auth.getSession();
        if (error) {
          throw error;
        }
        if (session == null ? void 0 : session.user) {
          setStatus("success");
          setMessage("Authentication successful! Redirecting...");
          await new Promise((resolve) => setTimeout(resolve, 1e3));
          navigate("/dashboard", { replace: true });
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2e3));
          const { data: { session: retrySession } } = await supabase2.auth.getSession();
          if (retrySession == null ? void 0 : retrySession.user) {
            setStatus("success");
            setMessage("Authentication successful! Redirecting...");
            await new Promise((resolve) => setTimeout(resolve, 1e3));
            navigate("/dashboard", { replace: true });
          } else {
            throw new Error("No session found after OAuth completion");
          }
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setMessage("Authentication failed. Please try again.");
        setTimeout(() => {
          navigate("/login");
        }, 3e3);
      }
    }
    handleCallback();
  }, [navigate, supabase2.auth]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-forge-cream relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-40 right-20 w-48 h-48 bg-forge-orange/10 rounded-full blur-2xl" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm border border-forge-orange/20 shadow-xl rounded-2xl p-8 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      status === "loading" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto h-12 w-12 animate-spin rounded-full border-4 border-forge-orange border-t-transparent" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-forge-dark", children: "Processing Authentication" }),
        /* @__PURE__ */ jsx("p", { className: "text-forge-gray", children: message })
      ] }),
      status === "success" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto h-12 w-12 rounded-full bg-forge-orange/10 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-forge-orange", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-forge-dark", children: "Welcome to Forge College!" }),
        /* @__PURE__ */ jsx("p", { className: "text-forge-gray", children: message })
      ] }),
      status === "error" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-red-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-forge-dark", children: "Authentication Failed" }),
        /* @__PURE__ */ jsx("p", { className: "text-forge-gray", children: message }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/login"),
            className: "mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-forge-orange hover:bg-forge-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forge-orange transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl",
            children: "Try Again"
          }
        )
      ] })
    ] }) })
  ] });
}
const TestPage = () => {
  const serverTimestamp = (/* @__PURE__ */ new Date()).toISOString();
  return /* @__PURE__ */ jsxs("div", { style: {
    padding: "2rem",
    textAlign: "center",
    fontFamily: "system-ui, sans-serif",
    maxWidth: "800px",
    margin: "0 auto"
  }, children: [
    /* @__PURE__ */ jsx("h1", { children: "🧪 Página de Teste - Forge College" }),
    /* @__PURE__ */ jsx("p", { children: "Esta é uma página de teste estática sem dependências externas." }),
    /* @__PURE__ */ jsxs("div", { style: {
      backgroundColor: "#f0f8ff",
      padding: "1rem",
      borderRadius: "8px",
      margin: "1rem 0"
    }, children: [
      /* @__PURE__ */ jsx("h2", { children: "Status do Sistema" }),
      /* @__PURE__ */ jsx("p", { children: "✅ React funcionando" }),
      /* @__PURE__ */ jsx("p", { children: "✅ TypeScript funcionando" }),
      /* @__PURE__ */ jsx("p", { children: "✅ Build funcionando" }),
      /* @__PURE__ */ jsx("p", { children: "✅ Deploy funcionando" }),
      /* @__PURE__ */ jsxs("p", { children: [
        "✅ SSR funcionando (timestamp: ",
        serverTimestamp,
        ")"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      backgroundColor: "#f0fff0",
      padding: "1rem",
      borderRadius: "8px",
      margin: "1rem 0"
    }, children: [
      /* @__PURE__ */ jsx("h3", { children: "Informações do Ambiente (SSR)" }),
      /* @__PURE__ */ jsxs("p", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Timestamp do Servidor:" }),
        " ",
        serverTimestamp
      ] }),
      /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("strong", { children: "Se você vê este texto sem JS, o SSR está OK" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      backgroundColor: "#fff8f0",
      padding: "1rem",
      borderRadius: "8px",
      margin: "1rem 0"
    }, children: [
      /* @__PURE__ */ jsx("h3", { children: "Teste de JavaScript (Client-side)" }),
      /* @__PURE__ */ jsx("p", { children: "Se o JavaScript estiver funcionando, você verá informações adicionais abaixo:" }),
      /* @__PURE__ */ jsx("div", { id: "js-test", style: {
        backgroundColor: "#e8f5e8",
        padding: "0.5rem",
        borderRadius: "4px",
        margin: "0.5rem 0"
      }, children: /* @__PURE__ */ jsx("p", { children: "Carregando informações do cliente..." }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => alert("JavaScript está funcionando!"),
          style: {
            padding: "0.5rem 1rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          },
          children: "Testar JavaScript"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("p", { style: { marginTop: "2rem", color: "#666" }, children: "Se você está vendo esta página, o problema não é de infraestrutura básica." }),
    /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: {
      __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const jsTest = document.getElementById('js-test');
            if (jsTest) {
              jsTest.innerHTML = \`
                <p><strong>✅ JavaScript funcionando!</strong></p>
                <p><strong>User Agent:</strong> \${navigator.userAgent}</p>
                <p><strong>URL:</strong> \${window.location.href}</p>
                <p><strong>Timestamp do Cliente:</strong> \${new Date().toISOString()}</p>
              \`;
            }
          });
        `
    } })
  ] });
};
const SSRTest = () => {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("pre", { children: [
      "SSR OK: ",
      (/* @__PURE__ */ new Date()).toISOString()
    ] }),
    /* @__PURE__ */ jsx("p", { children: "Se você está vendo este texto sem JavaScript, o SSR está funcionando." }),
    /* @__PURE__ */ jsxs("p", { children: [
      "Timestamp do servidor: ",
      (/* @__PURE__ */ new Date()).toLocaleString()
    ] })
  ] });
};
const BarePage = () => {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("title", { children: "Bare SSR Test" }),
      /* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsxs("pre", { children: [
        "BARE SSR OK: ",
        (/* @__PURE__ */ new Date()).toISOString()
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Se você vê este texto, o SSR básico está funcionando." }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Timestamp: ",
        (/* @__PURE__ */ new Date()).toLocaleString()
      ] })
    ] })
  ] });
};
const StaticBare = () => {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("title", { children: "Static Bare SSR Test" }),
      /* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsxs("pre", { children: [
        "STATIC BARE SSR OK: ",
        timestamp
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Se você vê este texto, o SSR está funcionando." }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Timestamp: ",
        (/* @__PURE__ */ new Date()).toLocaleString()
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Esta página renderiza HTML estático no servidor." })
    ] })
  ] });
};
const SSRCanary = () => {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("title", { children: "SSR Canary Test" }),
      /* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsxs("pre", { children: [
        "SSR CANARY OK: ",
        timestamp
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Se você vê este texto, o SSR está funcionando." }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Timestamp: ",
        (/* @__PURE__ */ new Date()).toLocaleString()
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Esta página renderiza HTML estático no servidor." }),
      /* @__PURE__ */ jsx("p", { children: "Runtime: Node.js" }),
      /* @__PURE__ */ jsx("p", { children: "Dynamic: force-dynamic" })
    ] })
  ] });
};
const App = () => {
  try {
    return /* @__PURE__ */ jsxs(TooltipProvider, { children: [
      /* @__PURE__ */ jsx(Toaster$1, {}),
      /* @__PURE__ */ jsx(Toaster, {}),
      /* @__PURE__ */ jsx(BrowserRouter, { children: /* @__PURE__ */ jsx(OAuthProvider, { children: /* @__PURE__ */ jsxs(Routes, { children: [
        /* @__PURE__ */ jsxs(Route, { element: /* @__PURE__ */ jsx(PublicLayout, {}), children: [
          /* @__PURE__ */ jsx(Route, { path: ROOT, element: /* @__PURE__ */ jsx(Professionals, {}) }),
          /* @__PURE__ */ jsx(Route, { path: COMPANIES, element: /* @__PURE__ */ jsx(Companies, {}) }),
          /* @__PURE__ */ jsx(Route, { path: INVESTORS, element: /* @__PURE__ */ jsx(Investors, {}) })
        ] }),
        /* @__PURE__ */ jsx(Route, { path: LOGIN, element: /* @__PURE__ */ jsx(Login, {}) }),
        /* @__PURE__ */ jsx(Route, { path: SIGNUP, element: /* @__PURE__ */ jsx(SignUp, {}) }),
        /* @__PURE__ */ jsx(Route, { path: FORGOT_PASSWORD, element: /* @__PURE__ */ jsx(ForgotPassword, {}) }),
        /* @__PURE__ */ jsx(Route, { path: UPDATE_PASSWORD, element: /* @__PURE__ */ jsx(UpdatePassword, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/login-oauth", element: /* @__PURE__ */ jsx(LoginOAuth, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/auth/callback", element: /* @__PURE__ */ jsx(AuthCallback, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/test", element: /* @__PURE__ */ jsx(TestPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/ssr-check", element: /* @__PURE__ */ jsx(SSRTest, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/bare", element: /* @__PURE__ */ jsx(BarePage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/static-bare", element: /* @__PURE__ */ jsx(StaticBare, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/ssr-canary", element: /* @__PURE__ */ jsx(SSRCanary, {}) }),
        /* @__PURE__ */ jsxs(
          Route,
          {
            path: DASHBOARD,
            element: /* @__PURE__ */ jsx(RequireAuth, { children: /* @__PURE__ */ jsx(DashboardLayout, {}) }),
            children: [
              /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(DashboardHome, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "explore", element: /* @__PURE__ */ jsx(AvailablePaths, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "profile", element: /* @__PURE__ */ jsx(Profile, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "learn/course/:courseId", element: /* @__PURE__ */ jsx(CourseView, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "learn/path/:pathId", element: /* @__PURE__ */ jsx(PathOverview, {}) })
            ]
          }
        ),
        /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFound, {}) })
      ] }) }) })
    ] });
  } catch (error) {
    console.error("App SSR error:", error);
    return /* @__PURE__ */ jsxs("div", { style: {
      padding: "2rem",
      textAlign: "center",
      fontFamily: "system-ui, sans-serif"
    }, children: [
      /* @__PURE__ */ jsx("h1", { children: "SSR Error" }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Erro no App principal: ",
        error instanceof Error ? error.message : "Erro desconhecido"
      ] }),
      /* @__PURE__ */ jsx("pre", { style: {
        backgroundColor: "#f5f5f5",
        padding: "1rem",
        borderRadius: "4px",
        textAlign: "left"
      }, children: error instanceof Error ? error.stack : String(error) })
    ] });
  }
};
async function render(url) {
  try {
    const html = renderToString(
      /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(App, {}) })
    );
    return html;
  } catch (error) {
    console.error("SSR render error:", error);
    return `
      <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
        <h1>SSR Error</h1>
        <p>Erro ao renderizar: ${error instanceof Error ? error.message : "Erro desconhecido"}</p>
        <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px;">
          ${error instanceof Error ? error.stack : String(error)}
        </pre>
      </div>
    `;
  }
}
export {
  render
};
