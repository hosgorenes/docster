export { registerUploadRoute } from "./upload";
export { registerResultsRoute } from "./results";

// Optional aggregator
export async function registerRoutes(app: import("fastify").FastifyInstance) {
    await (await import("./upload")).registerUploadRoute(app);
    await (await import("./results")).registerResultsRoute(app);
}