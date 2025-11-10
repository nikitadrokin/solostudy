// // biome-ignore lint/style/noExportedImports: we need to export the handler
// import { xmcpHandler } from '@xmcp/adapter';

// export { xmcpHandler as GET, xmcpHandler as POST };

export function GET() {
  return new Response(
    "MCP hasn't been implemented yet because XMCP hasn't published their package -.-"
  );
}
