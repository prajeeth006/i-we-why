using System;
using Frontend.Vanilla.Core.System.Uris;
using Microsoft.Extensions.Configuration;

namespace Frontend.Vanilla.Features.DeviceAtlas;

internal interface IDeviceAtlasConfiguration
{
    HttpUri Host { get; }
}

internal sealed class DeviceAtlasConfiguration : IDeviceAtlasConfiguration
{
    public DeviceAtlasConfiguration(IConfiguration configuration)
    {
        var section = configuration.GetRequiredSection("DeviceAtlas");
        var host = section.GetValue<string>("Host") ?? throw new Exception("Failed to read DeviceAtlas.Host from settings.");
        Host = new HttpUri(host);
    }

    public HttpUri Host { get; }
}
