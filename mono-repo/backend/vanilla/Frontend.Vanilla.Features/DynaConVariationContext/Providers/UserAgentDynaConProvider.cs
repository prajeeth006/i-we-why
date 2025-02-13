using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.DeviceAtlas;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.DynaConVariationContext.Providers;

/// <summary>
/// Provides specific user agents from request for config variation context.
/// </summary>
internal sealed class UserAgentDynaConProvider(IHttpContextAccessor httpContextAccessor, IDeviceAtlasService deviceAtlasService) : IWebDynaConVariationContextProvider
{
    private const string WebPageTestIdentifier = "PTST";

    public TrimmedRequiredString Name { get; } = "UserAgent";
    public TrimmedRequiredString DefaultValue { get; } = UserAgentTypes.Other;

    public string GetCurrentRawValue()
    {
        var userAgent = httpContextAccessor.HttpContext?.Request.Headers[HttpHeaders.UserAgent].ToString();

        if (string.IsNullOrEmpty(userAgent))
            return DefaultValue;

        if (userAgent.ContainsIgnoreCase(UserAgentTypes.Prerender)) return UserAgentTypes.Prerender;
        if (userAgent.ContainsIgnoreCase(UserAgentTypes.Catchpoint)) return UserAgentTypes.Catchpoint;
        if (userAgent.ContainsIgnoreCase(WebPageTestIdentifier)) return UserAgentTypes.WebPageTest;
        if (userAgent == UserAgentTypes.Scom) return UserAgentTypes.Scom;
        if (userAgent.EndsWithIgnoreCase(UserAgentTypes.FrontendAutomation)) return UserAgentTypes.FrontendAutomation;

        var deviceProperties = deviceAtlasService.Get();
        if (deviceProperties.Item1 && deviceProperties.Item2.TryGetValue("isRobot", out var value) && value == "1")
        {
            return UserAgentTypes.Robot;
        }

        return DefaultValue;
    }
}

internal static class UserAgentTypes
{
    public const string Prerender = "Prerender";
    public const string Scom = "SCOM";
    public const string Catchpoint = "Catchpoint";
    public const string WebPageTest = "WebPageTest";
    public const string FrontendAutomation = "Frontend-Automation";
    public const string Robot = "Robot";
    public const string Other = "Other";
}
