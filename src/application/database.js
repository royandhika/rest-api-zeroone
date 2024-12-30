import { PrismaClient } from "@prisma/client";
import { logger } from "./logging.js";

export const prismaClient = new PrismaClient({
    log: [
        {
            emit: "event",
            level: "error",
        },
        {
            emit: "event",
            level: "warn",
        },
        {
            emit: "event",
            level: "info",
        },
        {
            emit: "event",
            level: "query",
        },
    ]
});

prismaClient.$on("error", (e) => {
    if (e.timestamp) {
        delete e.timestamp
    };
    logger.warn(e);
});

prismaClient.$on("warn", (e) => {
    if (e.timestamp) {
        delete e.timestamp
    };
    logger.warn(e);
});

prismaClient.$on("info", (e) => {
    if (e.timestamp) {
        delete e.timestamp
    };
    logger.info(e);
});

prismaClient.$on("query", (e) => {
    if (e.timestamp) {
        delete e.timestamp
    };
    logger.info(e);
});
