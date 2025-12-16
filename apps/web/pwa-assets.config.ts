import {
  defineConfig,
  minimal2023Preset,
  combinePresetAndAppleSplashScreens,
} from '@vite-pwa/assets-generator/config';

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset: combinePresetAndAppleSplashScreens(minimal2023Preset, {
    darkResizeOptions: { background: '#000000', fit: 'contain' },
  }),
  images: ['src/app/favicon.ico'],
});
