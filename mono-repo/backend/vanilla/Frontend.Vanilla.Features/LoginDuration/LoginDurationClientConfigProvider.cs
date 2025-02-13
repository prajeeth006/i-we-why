using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.LoginDuration;

internal sealed class LoginDurationClientConfigProvider(
    ILoginDurationProvider loginDurationProvider,
    ILogger<LoginDurationClientConfigProvider> log)
    : LambdaClientConfigProvider("vnLoginDuration", async cancellationToken =>
    {
        var textTask = loginDurationProvider.TryAsync(p => p.GetTextAsync(cancellationToken), log, failedResult: null);
        var text = await textTask;

        return new { loginDurationProvider.SlotName, text, loginDurationProvider.TimeFormat };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
