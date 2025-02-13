using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LoginDuration;

namespace Frontend.Vanilla.Features.CurrentSession;

internal sealed class CurrentSessionClientConfigProvider(ILoginExpirationProvider loginExpirationProvider) : LambdaClientConfigProvider("vnCurrentSession",
    async cancellationToken =>
    {
        (long? remainingLoginTime, long? loginDuration) currentSession =
            await loginExpirationProvider.GetRemainingTimeAndLoginDurationInMillisecondsAsync(cancellationToken);

        return new { currentSession.remainingLoginTime, currentSession.loginDuration };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
