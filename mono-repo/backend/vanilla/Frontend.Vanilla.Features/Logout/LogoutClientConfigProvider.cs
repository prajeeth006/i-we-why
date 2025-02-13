using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Logout;

internal sealed class LogoutClientConfigProvider(ILogoutConfiguration logoutConfiguration) : LambdaClientConfigProvider("vnLogout",
    () => new
    {
        LogoutMessage = logoutConfiguration.LogoutMessage ?? string.Empty,
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
