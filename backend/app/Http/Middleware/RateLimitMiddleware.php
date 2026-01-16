<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Response;

/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse and DoS attacks
 */
class RateLimitMiddleware
{
    /**
     * Rate limit storage (in production, use Redis or database)
     */
    protected static $requests = [];

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  int  $maxRequests  Maximum requests per window
     * @param  int  $windowMinutes  Time window in minutes
     * @return mixed
     */
    public function handle($request, Closure $next, $maxRequests = 60, $windowMinutes = 1)
    {
        // Get client identifier (IP address)
        $clientId = $this->getClientId($request);
        $key = $this->getRateLimitKey($request, $clientId);
        
        // Get current request count
        $currentCount = $this->getCurrentCount($key);
        
        // Check if rate limit exceeded
        if ($currentCount >= $maxRequests) {
            return $this->rateLimitExceeded($maxRequests, $windowMinutes);
        }
        
        // Increment request count
        $this->incrementCount($key, $windowMinutes);
        
        // Add rate limit headers to response
        $response = $next($request);
        
        return $this->addRateLimitHeaders($response, $maxRequests, $currentCount + 1);
    }

    /**
     * Get client identifier from request
     */
    protected function getClientId($request)
    {
        // Try to get real IP behind proxy
        $ip = $request->header('X-Forwarded-For') 
            ?? $request->header('X-Real-IP') 
            ?? $request->ip();
        
        // Take first IP if multiple (from proxy chain)
        if (strpos($ip, ',') !== false) {
            $ip = trim(explode(',', $ip)[0]);
        }
        
        return $ip;
    }

    /**
     * Generate rate limit key
     */
    protected function getRateLimitKey($request, $clientId)
    {
        $endpoint = $request->path();
        $minute = floor(time() / 60);
        
        return "rate_limit:{$clientId}:{$endpoint}:{$minute}";
    }

    /**
     * Get current request count for key
     */
    protected function getCurrentCount($key)
    {
        // Clean old entries
        $this->cleanOldEntries();
        
        return self::$requests[$key] ?? 0;
    }

    /**
     * Increment request count
     */
    protected function incrementCount($key, $windowMinutes)
    {
        if (!isset(self::$requests[$key])) {
            self::$requests[$key] = 0;
        }
        
        self::$requests[$key]++;
    }

    /**
     * Clean entries older than 2 minutes
     */
    protected function cleanOldEntries()
    {
        $currentMinute = floor(time() / 60);
        
        foreach (self::$requests as $key => $count) {
            // Extract minute from key
            $parts = explode(':', $key);
            $keyMinute = (int) end($parts);
            
            // Remove if older than 2 minutes
            if ($currentMinute - $keyMinute > 2) {
                unset(self::$requests[$key]);
            }
        }
    }

    /**
     * Return rate limit exceeded response
     */
    protected function rateLimitExceeded($maxRequests, $windowMinutes)
    {
        return response()->json([
            'error' => 'Rate limit exceeded',
            'message' => "Too many requests. Maximum {$maxRequests} requests per {$windowMinutes} minute(s).",
            'message_ar' => 'تم تجاوز الحد المسموح به من الطلبات. يرجى الانتظار قليلاً.',
            'retry_after' => $windowMinutes * 60
        ], 429, [
            'Retry-After' => $windowMinutes * 60,
            'X-RateLimit-Limit' => $maxRequests,
            'X-RateLimit-Remaining' => 0
        ]);
    }

    /**
     * Add rate limit headers to response
     */
    protected function addRateLimitHeaders($response, $maxRequests, $currentCount)
    {
        $remaining = max(0, $maxRequests - $currentCount);
        
        if (method_exists($response, 'header')) {
            $response->header('X-RateLimit-Limit', $maxRequests);
            $response->header('X-RateLimit-Remaining', $remaining);
        }
        
        return $response;
    }
}
