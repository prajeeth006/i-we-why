using System;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Frontend.Vanilla.Core.Caching;

internal sealed class ConfigureRedisCacheOptions(IConfiguration configuration) : IConfigureOptions<RedisCacheOptions>
{
    public void Configure(RedisCacheOptions options)
    {
        options.Configuration = configuration.GetConnectionString("Redis") ?? throw new Exception($"{nameof(ConfigureRedisCacheOptions)} failed to obtain redis connection string from ConnectionStrings.Redis.");
    }
}
