using System.Collections.Concurrent;
using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using TransNet.Application.Interfaces;

namespace TransNet.Infrastructure.Services;

public class RedisCacheService : ICacheService
{
    private readonly IDistributedCache? _distributedCache;
    private readonly ConcurrentDictionary<string, (string Value, DateTime? Expiry)> _fallbackCache = new();
    private readonly ILogger<RedisCacheService> _logger;
    private readonly bool _useRedis;

    public RedisCacheService(
        IDistributedCache? distributedCache,
        ILogger<RedisCacheService> logger,
        bool useRedis)
    {
        _distributedCache = distributedCache;
        _logger = logger;
        _useRedis = useRedis;
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        if (_useRedis && _distributedCache is not null)
        {
            try
            {
                var data = await _distributedCache.GetStringAsync(key, cancellationToken);
                return data is null ? default : JsonSerializer.Deserialize<T>(data);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Redis get failed for key {Key}, using fallback cache", key);
            }
        }

        if (_fallbackCache.TryGetValue(key, out var entry))
        {
            if (entry.Expiry is null || entry.Expiry > DateTime.UtcNow)
                return JsonSerializer.Deserialize<T>(entry.Value);
            _fallbackCache.TryRemove(key, out _);
        }

        return default;
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null, CancellationToken cancellationToken = default)
    {
        var json = JsonSerializer.Serialize(value);
        DateTime? expiryTime = expiry.HasValue ? DateTime.UtcNow.Add(expiry.Value) : null;

        if (_useRedis && _distributedCache is not null)
        {
            try
            {
                var options = new DistributedCacheEntryOptions();
                if (expiry.HasValue)
                    options.SetAbsoluteExpiration(expiry.Value);

                await _distributedCache.SetStringAsync(key, json, options, cancellationToken);
                return;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Redis set failed for key {Key}, using fallback cache", key);
            }
        }

        _fallbackCache[key] = (json, expiryTime);
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        if (_useRedis && _distributedCache is not null)
        {
            try
            {
                await _distributedCache.RemoveAsync(key, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Redis remove failed for key {Key}", key);
            }
        }

        _fallbackCache.TryRemove(key, out _);
    }

    public async Task RemoveByPrefixAsync(string prefix, CancellationToken cancellationToken = default)
    {
        foreach (var key in _fallbackCache.Keys.Where(k => k.StartsWith(prefix)))
            _fallbackCache.TryRemove(key, out _);

        if (_useRedis && _distributedCache is not null)
        {
            _logger.LogDebug("Redis prefix removal requested for {Prefix} (not supported without key scan)", prefix);
        }

        await Task.CompletedTask;
    }
}
