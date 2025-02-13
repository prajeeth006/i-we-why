using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;

namespace Frontend.Vanilla.Features.ContentEndpoint;

internal sealed class ContentEndpointOptionsBootstrapper : IConfigureOptions<ContentEndpointOptions>
{
    public void Configure(ContentEndpointOptions options)
    {
        options.AllowedPaths.Add(new Regex($"^{AppPlugin.ContentRoot}/Partials/.*", RegexOptions.IgnoreCase));
        options.AllowedPaths.Add(new Regex($"^{AppPlugin.ContentRoot}/PreLogin", RegexOptions.IgnoreCase));
        options.AllowedPaths.Add(new Regex($"^{AppPlugin.ContentRoot}/Toasts.*", RegexOptions.IgnoreCase));
        options.AllowedPaths.Add(new Regex($"^{AppPlugin.ContentRoot}/LazyStyles/.*", RegexOptions.IgnoreCase));
        options.AllowedPaths.Add(new Regex($"^{AppPlugin.ContentRoot}/PublicPages/.*", RegexOptions.IgnoreCase));
        options.AllowedPaths.Add(new Regex($"^{AppPlugin.ContentRoot}/Hints.*", RegexOptions.IgnoreCase));
        options.AllowedPaths.Add(new Regex($"^{AppPlugin.ContentRoot}/Tooltips.*", RegexOptions.IgnoreCase));
        options.AllowedPaths.Add(new Regex($"^{AppPlugin.ContentRoot}/AdobeTarget.*", RegexOptions.IgnoreCase));
        options.AllowedPaths.Add(new Regex($"^*TargetTeasers*", RegexOptions.IgnoreCase));
        options.AllowedAnonymousAccessRestrictedPaths.Add(new Regex($"^{AppPlugin.ContentRoot}/LazyStyles/.*", RegexOptions.IgnoreCase));
    }
}
