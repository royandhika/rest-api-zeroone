import { web } from "./src/application/web.js";
import { logger } from "./src/application/logging.js";
import "dotenv/config";
const PORT = process.env.PORT;

web.listen(PORT, () => {
    logger.info(`App start, on port ${PORT}`)
});