using System;
using System.Collections.Generic;

namespace Frontend.Vanilla.Features.Authentication;

internal interface IAuthorizationConfiguration
{
    /// <summary>
    /// Gets the value indicating if access of anonymous users is restricted globally.
    /// Only pages with allowed anonymous access are accessible.
    /// </summary>
    bool IsAnonymousAccessRestricted { get; }

    IReadOnlyList<string> AuthRequired { get; }
}

internal sealed class AuthorizationConfiguration : IAuthorizationConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.Authorization";
    public bool IsAnonymousAccessRestricted { get; set; }

    public IReadOnlyList<string> AuthRequired { get; set; } = Array.Empty<string>();
}
