using System;
using Microsoft.Extensions.Configuration;

namespace Frontend.Vanilla.Caching.Hekaton;

internal interface IHekatonConfiguration
{
    string HekatonConnectionString { get; }
    TimeSpan MaxExpirationTime { get; }
    TimeSpan MinExpirationTime { get; }
    int MaxKeyLength { get; }
}

internal sealed class HekatonConfiguration : IHekatonConfiguration
{
    public HekatonConfiguration(IConfiguration configuration)
    {
        HekatonConnectionString = configuration.GetConnectionString("Hekaton") ?? throw new Exception("ConnectionStrings.Hekaton is required, but not found.");
    }
    public string HekatonConnectionString { get; }
    public TimeSpan MaxExpirationTime { get; } = TimeSpan.FromDays(1);
    public TimeSpan MinExpirationTime { get; } = TimeSpan.FromSeconds(90);
    public int MaxKeyLength { get; } = 1024;
}
