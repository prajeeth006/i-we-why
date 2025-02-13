using System.Linq;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.ServiceClients.Security;

namespace Frontend.Vanilla.Features.Claims;

internal sealed class ClaimsClientConfigProvider(ICurrentUserAccessor currentUserAccessor) : LambdaClientConfigProvider("vnClaims", () =>
{
    var claims = currentUserAccessor.User.Claims.Where(c => !string.IsNullOrEmpty(c.Value)).ToDictionary(c => c.Type, c => c.Value);

    return claims;
}) { }
