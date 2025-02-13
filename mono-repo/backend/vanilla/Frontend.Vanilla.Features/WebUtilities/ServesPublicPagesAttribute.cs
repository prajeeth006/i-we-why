using System;

namespace Frontend.Vanilla.Features.WebUtilities;

/// <summary>Indicates this controller action serves public page so all related logic should be executed e.g. 404 if page not found.</summary>
[AttributeUsage(AttributeTargets.Method)]
internal sealed class ServesPublicPagesAttribute(string rootPath) : Attribute
{
    /// <summary>
    /// Indicates the sitecore path for public page serving.
    /// </summary>
    public string RootPath { get; } = rootPath;
}
