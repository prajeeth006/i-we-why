#nullable disable
using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class BrowserDslProvider(IDeviceDslProvider deviceDslProvider) : IBrowserDslProvider
{
    public Task<string> GetNameAsync(ExecutionMode mode)
        => deviceDslProvider.GetCapabilityAsync(mode, "browserName");

    public Task<string> GetVersionAsync(ExecutionMode mode)
        => deviceDslProvider.GetCapabilityAsync(mode, "browserVersion");

    public async Task<decimal> GetMajorVersionAsync(ExecutionMode mode)
    {
        var browserVersion = await GetVersionAsync(mode);

        var version = browserVersion?.Split('.')[0];

        return int.TryParse(version, out var result)
            ? result
            : throw new Exception($"Failed to parse major version from {browserVersion}. This value comes from DeviceAtlas api.");
    }

    public bool IsStandaloneApp()
        => throw new ClientSideOnlyException();
}
