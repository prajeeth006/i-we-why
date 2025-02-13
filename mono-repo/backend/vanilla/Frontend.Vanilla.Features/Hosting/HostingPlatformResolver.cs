using System;
using Frontend.Vanilla.Core.Abstractions;

namespace Frontend.Vanilla.Features.Hosting;

/// <summary>Provides information about hosting platform of running application.</summary>
internal interface IHostingPlatformResolver
{
    /// <summary>Current value.</summary>
    HostingPlatform Current { get; }
}

internal sealed class HostingPlatformResolver : IHostingPlatformResolver
{
    public const string HostingPlatformEnvVariableName = "VANILLA_HOSTING_PLATFORM";

    public HostingPlatformResolver(IEnvironment environment)
    {
        Enum.TryParse(environment.GetEnvironmentVariable(HostingPlatformEnvVariableName), out HostingPlatform hostingPlatform); // will default to 0 (Windows) even if parsing fails
        Current = hostingPlatform;
    }

    public HostingPlatform Current { get; }
}
