using Frontend.Host.Features.Assets;

namespace Frontend.Host;

internal sealed class WebpackDevServerConfiguration(string? url) : IWebpackDevServerConfiguration
{
    public string? Url { get; } = url;
}
