using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.DynaConVariationContext.Providers;

/// <summary>
/// Provides user specific states for config variation context.
/// </summary>
internal sealed class UserDynaConProvider(IHttpContextAccessor httpContextAccessor, ILastVisitorCookie lastVisitorCookie) : IWebDynaConVariationContextProvider
{
    public TrimmedRequiredString Name { get; } = "User";
    public TrimmedRequiredString DefaultValue { get; } = UserTypes.Unknown;

    public string GetCurrentRawValue()
    {
        var httpContext = httpContextAccessor.HttpContext;

        if (httpContext == null) return UserTypes.Unknown;

        var user = httpContext.User;

        if (user.IsAnonymous())
        {
            return UserTypes.Anonymous;
        }

        if (user.Identity?.IsAuthenticated is true)
        {
            return UserTypes.LoggedIn;
        }

        if (user.IsAuthenticatedOrHasWorkflow())
        {
            return UserTypes.Workflow;
        }

        return lastVisitorCookie.GetValue() != null ? UserTypes.Known : UserTypes.Unknown;
    }
}

internal static class UserTypes
{
    public const string Anonymous = "anonymous";
    public const string Unknown = "unknown";
    public const string Known = "known";
    public const string LoggedIn = "logged-in";
    public const string Workflow = "workflow";
}
