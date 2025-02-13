using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.LanguageSwitcher;

internal sealed class LanguageSwitcherClientConfigProvider(ILanguageSwitcherConfiguration languageSwitcherConfiguration) : LambdaClientConfigProvider(
    "vnLanguageSwitcher", async cancellationToken =>
    {
        var isEnabledDslExpressionTask = languageSwitcherConfiguration.IsEnabledDslExpression.EvaluateForClientAsync(cancellationToken);
        var openPopupDslExpressionTask = languageSwitcherConfiguration.OpenPopupDslExpression.EvaluateForClientAsync(cancellationToken);
        var showHeaderDslExpressionTask = languageSwitcherConfiguration.ShowHeaderDslExpression.EvaluateForClientAsync(cancellationToken);

        var isEnabledDslExpression = await isEnabledDslExpressionTask;
        var openPopupDslExpression = await openPopupDslExpressionTask;
        var showHeaderDslExpression = await showHeaderDslExpressionTask;

        return new { isEnabledDslExpression, openPopupDslExpression, showHeaderDslExpression, languageSwitcherConfiguration.Version, languageSwitcherConfiguration.UseFastIcons };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;

    // Run in parallel
}
