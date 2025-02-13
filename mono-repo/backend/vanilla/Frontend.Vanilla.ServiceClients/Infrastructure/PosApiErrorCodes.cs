using System.Linq;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.ServiceClients.Infrastructure;

/// <summary>
/// List of common PosAPI error codes returned in <see cref="PosApiException.PosApiCode" />.
/// </summary>
internal static class PosApiErrorCodes
{
    public const int SessionTokenExpired = 207;
    public const int UserTokenExpired = 208;
    public const int InvalidSessionToken = 209;
    public const int InvalidUserToken = 210;

    public static bool IsInvalidOrExpiredAuthToken(this PosApiException exception)
        => exception.PosApiCode.EqualsAny(SessionTokenExpired, UserTokenExpired, InvalidSessionToken, InvalidUserToken);

    public static string ErrorCode(this PosApiException ex)
        => ex.PosApiValues.FirstOrDefault(value => value.Key == "ErrorCode").Value;

    public static string ErrorMessage(this PosApiException ex)
        => ex.PosApiValues.FirstOrDefault(value => value.Key == "ErrorMessage").Value ?? ex.PosApiMessage ?? "An error occurred";
}
