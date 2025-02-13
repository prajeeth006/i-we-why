using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Login;

internal sealed class Login2ClientConfigProvider(ILoginSettingsConfiguration config) : LambdaClientConfigProvider("vnLogin2",
    async cancellationToken =>
    {
        var disableFeatureDataPrefetch = new Dictionary<string, ClientEvaluationResult<bool>>();

        foreach (var feature in config.DisableFeatureDataPrefetch)
        {
            disableFeatureDataPrefetch.Add(feature.Key, await feature.Value.EvaluateForClientAsync(cancellationToken));
        }

        var providers = new Dictionary<string, ProviderParameters>();

        foreach (var provider in config.Providers)
        {
            if (provider.Value.Enabled || (provider.Value.IsEnabledCondition != null && await provider.Value.IsEnabledCondition.EvaluateAsync(cancellationToken)))
            {
                providers.Add(provider.Key, provider.Value);
            }
        }

        return new
        {
            config.AutoFocusUsername,
            config.CloseButtonTextCssClass,
            config.ConnectCardVersion,
            config.DisableLoginOnFormInvalid,
            config.EnableLimitsToaster,
            config.FailedLoginRetryCount,
            config.FastLoginOptionsEnabled,
            config.FastLoginToggleEnabled,
            config.IsDateOfBirthEnabled,
            config.IsLoginWithMobileEnabled,
            config.LoginOptions,
            config.PasswordHintsOnNthAttempt,
            config.PrefillUsernameToggleEnabled,
            config.RecaptchaEnterpriseEnabled,
            config.RememberMeEnabled,
            config.SelectedTabEnabled,
            config.ShowCloseButtonAsText,
            config.ShowRegisterButton,
            config.SignInByEmail,
            config.TitleCssClass,
            config.UseOpenRegistrationEvent,
            config.UseProviderProfile,
            disableFeatureDataPrefetch,
            providers,
            resetLoginFormErrorCodes = config.ErrorCodeHandlers.Where(e => e.Value.ResetForm).Select(o => o.Key),
            v2 = config.UseV2,
            version = config.Version,
            config.ShowLoginSpinner,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
