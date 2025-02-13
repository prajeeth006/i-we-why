using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;

namespace Frontend.Vanilla.Features.AntiForgery;

internal interface IAntiForgeryToken
{
    string? GetValue();
}

internal sealed class AntiForgeryToken(ICurrentUserAccessor currentUserAccessor) : IAntiForgeryToken
{
    public string? GetValue()
        => currentUserAccessor.User.FindValue(PosApiClaimTypes.SessionToken);
}
