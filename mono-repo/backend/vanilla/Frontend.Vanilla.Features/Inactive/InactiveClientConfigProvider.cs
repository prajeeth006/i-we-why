using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Inactive;

internal sealed class InactiveClientConfigProvider(IInactiveConfiguration inactiveConfiguration) : LambdaClientConfigProvider("vnInactive",
    () => new
    {
        toastTimeout = inactiveConfiguration.ToastTimeout.TotalMilliseconds,
        logoutTimeout = inactiveConfiguration.LogoutTimeout.TotalMilliseconds,
        activityInterval = inactiveConfiguration.ActivityInterval.TotalMilliseconds,
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
