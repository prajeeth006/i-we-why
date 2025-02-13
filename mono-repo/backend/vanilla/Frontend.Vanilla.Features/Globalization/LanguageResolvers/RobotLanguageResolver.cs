using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DeviceAtlas;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Globalization.LanguageResolvers;

/// <summary>
/// Tries to resolve Default language when request comes from a bot.
/// </summary>
internal interface IRobotLanguageResolver
{
    LanguageInfo? Resolve();
}

internal sealed class RobotLanguageResolver(
    IGlobalizationConfiguration config,
    IHttpContextAccessor httpContextAccessor,
    IDeviceAtlasService deviceAtlasService)
    : IRobotLanguageResolver
{
    /// <summary>We want search engine (with configured lang) to index default lang asap when it comes freshly to root URL.</summary>
    public LanguageInfo? Resolve()
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        if (!httpContext.Request.Path.IsRoot())
        {
            return null;
        }

        var deviceProperties = deviceAtlasService.Get();
        if (deviceProperties.Item1 && deviceProperties.Item2.TryGetValue("isRobot", out var robot) && robot == "1")
        {
            return config.DefaultLanguage;
        }

        return null;
    }
}
