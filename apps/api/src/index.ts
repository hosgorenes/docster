import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { registerRoutes } from "./routes";

const app: FastifyInstance = Fastify({ logger: true });

async function bootstrap() {
    await app.register(cors, { origin: true, credentials: true });

    await registerRoutes(app);

    const port = Number(process.env.PORT || 4000);
    const host = process.env.HOST || "0.0.0.0";

    try {
        await app.listen({ port, host });
        app.log.info(`API listening on http://${host}:${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

bootstrap();