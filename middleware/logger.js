// Very simple request logger without external packages
module.exports = function logger(req, res, next) {
  const start = process.hrtime.bigint();
  const { method, originalUrl } = req;

  // Log when response finishes to get status and duration
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000; // ns -> ms
    const status = res.statusCode;
    const userId = req.user?.id || '-';
    // Keep it compact and single-line for easy reading
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} ${status} ${durationMs.toFixed(1)}ms user:${userId}`);
  });

  next();
};
