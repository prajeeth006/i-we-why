using System.Text.RegularExpressions;
using Frontend.Vanilla.Features.ContentEndpoint;
using Microsoft.Extensions.Options;

namespace Frontend.SharedFeatures.Api;

public class ContentEndpointBootstrapper : IConfigureOptions<ContentEndpointOptions>
{
    public void Configure(ContentEndpointOptions options)
    {
        options.AllowedPaths.Add(new Regex("M2ThemePark-v1.0/PublicPages/.*"));
        options.AllowedPaths.Add(new Regex("Playground-v1.0/PublicPages/.*"));
        options.AllowedPaths.Add(new Regex("MobilePortal-v1.0/PublicPages/.*"));
    }
}
