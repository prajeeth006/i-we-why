using System.Security.Claims;
using System.Security.Principal;
using Frontend.Vanilla.ServiceClients.Claims;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.PosApi;

public static class PosApiIdentity
{
    public static ClaimsIdentity Create(
        bool isAuthenticated = true,
        string name = "Vanilla",
        string userToken = "UserToken",
        string sessionToken = "01054cc0-e936-4071-badf-bcda4f993808")
    {
        var authType = isAuthenticated ? "VanillaAuth" : null;

        return new ClaimsIdentity(
            new[]
            {
                new Claim(PosApiClaimTypes.Name, name),
                new Claim(PosApiClaimTypes.UserToken, userToken),
                new Claim(PosApiClaimTypes.SessionToken, sessionToken),
            },
            authType);
    }

    public static IIdentity CreateAnonymous()
    {
        return new ClaimsIdentity();
    }
}
