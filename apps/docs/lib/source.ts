import { loader } from 'fumadocs-core/source';
import { docs } from '@/.source';

/**
 * In-app docs root. Next.js `basePath: '/docs'` prefixes the public URL, so
 * pages resolve at https://study.nkdr.me/docs/... rather than /docs/docs/...
 */
export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
});
