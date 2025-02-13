using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Login.Integration;

internal sealed class LoginIntegrationClientConfigProvider(ILoginIntegrationConfiguration config) : LambdaClientConfigProvider("vnLoginIntegration", () => new
{
    config.Type, Options = new
    {
        config.Options.Version,
        config.Options.LoginUrl,
        config.Options.LogoutUrl,
        config.Options.RelayUrl,
        config.Options.ActiveSessionUrl,
        config.Options.StandaloneLoginUrl,
        RedirectAfterLogin = config.Options.RedirectAfterLoginCondition != null
            ? config.Options.RedirectAfterLoginCondition?.EvaluateForClient()
            : ClientEvaluationResult<bool>.FromClientExpression("FALSE"),
    },
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
