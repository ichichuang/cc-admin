import legacy from '@vitejs/plugin-legacy'
import type { PluginOption } from 'vite'

export const configLegacyPlugin = (): PluginOption => {
  return legacy({
    targets: ['defaults', 'not IE 11'],
    additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    renderLegacyChunks: true,
    polyfills: [
      'es.symbol',
      'es.array.filter',
      'es.promise',
      'es.promise.finally',
      'es/map',
      'es/set',
      'es.array.for-each',
      'es.object.define-properties',
      'es.object.define-property',
      'es.object.get-own-property-descriptor',
      'es.object.get-own-property-descriptors',
      'es.object.keys',
      'es.object.to-string',
      'web.dom-collections.for-each',
      'esnext.global-this',
      'esnext.string.match-all',
    ],
  })
}
