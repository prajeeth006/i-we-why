#nullable disable
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Content.Client;

namespace Frontend.Vanilla.Features.ContentEndpoint;

/// <summary>
/// Options for content endpoint that fetches documents from cms.
/// </summary>
public class ContentEndpointOptions
{
    /// <summary>
    /// List of allowed path patterns.
    ///
    /// For example: <c>App-v1.0/Partials/.*</c> will allow all paths under <c>Appv-1.0/Partials</c> (not the parent <c>Partials</c> folder).
    /// </summary>
    public List<Regex> AllowedPaths { get; } = new List<Regex>();

    /// <summary>
    /// List of disallowed path patterns.
    ///
    /// For example: <c>App-v1.0/Partials/Configuration.*</c> will disallow all paths under <c>Appv-1.0/Partials/Configuration</c> (including the parent <c>Configuration</c> folder - note the missing trailing slash).
    /// This is only needed if a child of an already allowed (<see cref="AllowedPaths"/>) path needs to be disallowed).
    /// </summary>
    public List<Regex> DisallowedPaths { get; } = new List<Regex>();

    /// <summary>
    /// List of allowed path when user is not authenticated and IsAnonymousAccessRestricted is true patterns.
    ///
    /// For example: <c>App-v1.0/Partials/.*</c> will allow all paths under <c>Appv-1.0/Partials</c> (not the parent <c>Partials</c> folder).
    /// </summary>
    public List<Regex> AllowedAnonymousAccessRestrictedPaths { get; } = new List<Regex>();

    /// <summary>
    /// The service instance to use to use to get the client side mapped content.
    /// </summary>
    [Required]
    public IClientContentService ClientContentService { get; set; }
}
