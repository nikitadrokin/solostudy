// biome-ignore lint/nursery/noTsIgnore: do we seriously need MORE explanations??
// @ts-ignore - @xmcp/adapter is a reference to the `.xmcp/adapter` folder. The package does exist as a local build.
// biome-ignore lint/style/noExportedImports: we need to export the handler
import { xmcpHandler } from '@xmcp/adapter';

export { xmcpHandler as GET, xmcpHandler as POST };

// export function GET() {
//   return new Response(
//     "MCP hasn't been implemented yet because XMCP hasn't published their package -.-"
//   );
// }
