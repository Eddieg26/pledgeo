

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.eF7FsWnW.js","_app/immutable/chunks/disclose-version.CM5iZPbz.js","_app/immutable/chunks/runtime.Ci7PfynW.js","_app/immutable/chunks/legacy.qef1ZQi_.js"];
export const stylesheets = [];
export const fonts = [];
