export class RateLimiter {
    maxTokens;
    refillRate;
    tokens;
    lastRefillRate;
    constructor(maxTokens = 5, refillRate = 2500) {
        // refillRate is in Ms
        this.maxTokens = maxTokens;
        this.refillRate = refillRate;
        this.tokens = maxTokens;
        this.lastRefillRate = Date.now();
    }
    init() {
        return (this.tokens, this.lastRefillRate);
    }
    allowMessage() {
        const now = Date.now();
        const timePassed = now - this.lastRefillRate;
        const tokenToAdd = timePassed / this.refillRate;
        this.tokens = Math.min(this.maxTokens, this.tokens + tokenToAdd);
        this.lastRefillRate = now;
        if (this.tokens >= 1) {
            this.tokens -= 1;
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=RateLimiter.class.js.map