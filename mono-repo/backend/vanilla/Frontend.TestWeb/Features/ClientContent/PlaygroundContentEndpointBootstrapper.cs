using System.Text.RegularExpressions;
using Frontend.Vanilla.Features.ContentEndpoint;
using Microsoft.Extensions.Options;

namespace Frontend.TestWeb.Features.ClientContent;

public class PlaygroundContentEndpointBootstrapper(IPlaygroundClientContentService playgroundClientContentService) : IConfigureOptions<ContentEndpointOptions>
{
    public void Configure(ContentEndpointOptions options)
    {
        options.ClientContentService = playgroundClientContentService;
        options.AllowedPaths.Add(new Regex($"{PlaygroundPlugin.PublicPagePath}.*"));
        options.AllowedPaths.Add(new Regex($"M2ThemePark-v1.0/PublicPages/*",
            RegexOptions.IgnoreCase));
    }
}
