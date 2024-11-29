/* eslint-disable import/no-extraneous-dependencies */
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import copy from 'rollup-plugin-copy'
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';


export default {
  input: './scl-wizarding.ts',
  output: {
    sourcemap: true,        // Add source map to build output
    format:'es',            // ES module type export
    dir: 'dist',            // The build output folder
    // preserveModules: true,  // Keep directory structure and files
  },
  preserveEntrySignatures: 'strict', // leaves export of the plugin entry point

  plugins: [
    /** Resolve bare module imports */
    nodeResolve(),
    typescript(),
    dynamicImportVars(),
    importMetaAssets(),
    copy({
      targets: [
        { src: 'ace', dest: 'dist' },
      ]
    })
   ],
};
