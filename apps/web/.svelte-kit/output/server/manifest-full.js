export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.wvG11b1x.js","app":"_app/immutable/entry/app.CL5HB98N.js","imports":["_app/immutable/entry/start.wvG11b1x.js","_app/immutable/chunks/entry.CyKNQ3yS.js","_app/immutable/chunks/runtime.Ci7PfynW.js","_app/immutable/chunks/index-client.DmBygm_o.js","_app/immutable/entry/app.CL5HB98N.js","_app/immutable/chunks/runtime.Ci7PfynW.js","_app/immutable/chunks/render.8_pJGQwa.js","_app/immutable/chunks/disclose-version.CM5iZPbz.js","_app/immutable/chunks/index-client.DmBygm_o.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
