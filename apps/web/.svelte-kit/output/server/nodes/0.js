

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.1avT4dwp.js","_app/immutable/chunks/disclose-version.CM5iZPbz.js","_app/immutable/chunks/runtime.Ci7PfynW.js"];
export const stylesheets = ["_app/immutable/assets/0.BpAVHVrk.css"];
export const fonts = [];
