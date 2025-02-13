using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.DepositPrompt;

internal class DepositPromptClientConfigProvider(IDepositPromptConfiguration depositPromptConfiguration) : LambdaClientConfigProvider("vnDepositPrompt",
    async cancellationToken => new
    {
        condition = await depositPromptConfiguration.Condition.EvaluateForClientAsync(cancellationToken),
        depositPromptConfiguration.Trigger,
        repeatTime = depositPromptConfiguration.RepeatTime.TotalMilliseconds,
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
