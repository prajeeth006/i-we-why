using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>Provides content from Sitecore.</summary>
[Description("Provides content from Sitecore.")]
public interface ISitecoreDslProvider
{
    /// <summary>Get URL from a Link Template at given path in Sitecore. Fails if the content is not found, filtered, invalid, given contentPath is invalid or something else goes wrong.</summary>
    [Description(
        "Get URL from a Link Template at given path in Sitecore. Fails if the content is not found, filtered, invalid, given contentPath is invalid or something else goes wrong.")]
    Task<string> GetLinkAsync(ExecutionMode mode, string contentPath);
}
