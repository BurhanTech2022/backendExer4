import rateLimit from 'express-rate-limit';
export const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 minutes
  max: 100,                 // Limit each IP to 100 requests per windowMs
  standardHeaders: true,   // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,    // Disable `X-RateLimit-*` headers
});
