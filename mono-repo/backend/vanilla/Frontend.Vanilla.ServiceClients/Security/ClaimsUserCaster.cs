#nullable enable

using System;
using System.Security.Claims;
using System.Security.Principal;
using Frontend.Vanilla.Core.Diagnostics;

namespace Frontend.Vanilla.ServiceClients.Security;

internal static class ClaimsUserCaster
{
    public static ClaimsPrincipal Cast(IPrincipal? user, string userSource)
    {
        switch (user)
        {
            case null:
                throw new Exception($"User in {userSource} is null.");

            case ClaimsPrincipal claimsUser:
                return claimsUser;

            default:
                var userDetails = user.Identity != null
                    ? $"IsAuthenticated = {user.Identity.IsAuthenticated}, Name = '{user.Identity.Name}', AuthenticationType = '{user.Identity.AuthenticationType}'"
                    : "(null identity)";

                throw new InvalidCastException(
                    $"Vanilla requires {typeof(ClaimsPrincipal)} but current user {userDetails} in {userSource} is {user.GetType()}."
                    + $" Vanilla sets the user to correct type ASAP when processing HTTP request. Investigate who/when/why changes the user in {userSource}."
                    + $" Called from: {CallerInfo.Get()}");
        }
    }
}
