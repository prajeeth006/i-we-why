using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.HeaderBar;

internal sealed class HeaderBarClientConfigProvider(IHeaderBarConfiguration config) : LambdaClientConfigProvider("vnHeaderBar", async ct =>
{
    var isEnabledConditionTask = config.IsEnabledCondition.EvaluateForClientAsync(ct);
    var disableCloseConditionTask = config.DisableCloseCondition.EvaluateForClientAsync(ct);
    var showBackButtonConditionTask = config.ShowBackButtonCondition.EvaluateForClientAsync(ct);

    return new
    {
        config.WorkflowCloseAction,
        isEnabledCondition = await isEnabledConditionTask,
        disableCloseCondition = await disableCloseConditionTask,
        showBackButtonCondition = await showBackButtonConditionTask,
    };
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
