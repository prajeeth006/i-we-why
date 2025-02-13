#nullable disable
using System.Collections.Generic;
using Frontend.Vanilla.DomainSpecificLanguage;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Features.Login;

internal interface ILoginSettingsConfiguration
{
    IReadOnlyDictionary<string, ErrorHandler> ErrorCodeHandlers { get; }
    IReadOnlyDictionary<string, IDslExpression<bool>> DisableFeatureDataPrefetch { get; }
    IReadOnlyDictionary<string, PostLoginRedirect> PostLoginRedirects { get; }
    IReadOnlyDictionary<string, ProviderParameters> Providers { get; }
    IReadOnlyDictionary<string, WorkflowIdUrlWhitelist> WorkflowIdUrlWhitelist { get; }
    IReadOnlyDictionary<string, int> FailedLoginRetryCount { get; }
    IReadOnlyList<string> LoginOptions { get; }
    bool AutoFocusUsername { get; }
    bool DisableLoginOnFormInvalid { get; }
    bool EnableLimitsToaster { get; }
    bool FastLoginOptionsEnabled { get; }
    bool FastLoginToggleEnabled { get; }
    bool IsDateOfBirthEnabled { get; }
    bool IsLoginWithMobileEnabled { get; }
    bool PrefillUsernameToggleEnabled { get; }
    bool RecaptchaEnterpriseEnabled { get; }
    bool RememberMeEnabled { get; }
    bool SelectedTabEnabled { get; }
    bool ShowCloseButtonAsText { get; }
    bool ShowRegisterButton { get; }
    bool SignInByEmail { get; }
    bool UseOpenRegistrationEvent { get; }
    bool UseProviderProfile { get; }
    bool UseV2 { get; }
    int Version { get; }
    int ConnectCardVersion { get; }
    int PasswordHintsOnNthAttempt { get; }
    int RecaptchaVersion { get; }
    string CloseButtonTextCssClass { get; }
    string TitleCssClass { get; }
    string VanillaIdToken { get; }
    int SuperCookieMaxAge { get; }
    bool ShowLoginSpinner { get; }
}

internal sealed class LoginSettingsConfiguration : ILoginSettingsConfiguration
{
    public static readonly string FeatureName = "LabelHost.LoginSettings";

    public IReadOnlyDictionary<string, ErrorHandler> ErrorCodeHandlers { get; set; }
    public IReadOnlyDictionary<string, IDslExpression<bool>> DisableFeatureDataPrefetch { get; set; }
    public IReadOnlyDictionary<string, PostLoginRedirect> PostLoginRedirects { get; set; }
    public IReadOnlyDictionary<string, ProviderParameters> Providers { get; set; }
    public IReadOnlyDictionary<string, WorkflowIdUrlWhitelist> WorkflowIdUrlWhitelist { get; set; }
    public IReadOnlyDictionary<string, int> FailedLoginRetryCount { get; set; }
    public IReadOnlyList<string> LoginOptions { get; set; }
    public bool AutoFocusUsername { get; set; }
    public bool DisableLoginOnFormInvalid { get; set; }
    public bool EnableLimitsToaster { get; set; }
    public bool FastLoginOptionsEnabled { get; set; }
    public bool FastLoginToggleEnabled { get; set; }
    public bool IsDateOfBirthEnabled { get; set; }
    public bool IsLoginWithMobileEnabled { get; set; }
    public bool PrefillUsernameToggleEnabled { get; set; }
    public bool RecaptchaEnterpriseEnabled { get; set; }
    public bool RememberMeEnabled { get; set; }
    public bool SelectedTabEnabled { get; set; }
    public bool ShowCloseButtonAsText { get; set; }
    public bool ShowRegisterButton { get; set; }
    public bool SignInByEmail { get; set; }
    public bool UseOpenRegistrationEvent { get; set; }
    public bool UseProviderProfile { get; set; }
    public bool UseV2 { get; set; }
    public int Version { get; set; }
    public int ConnectCardVersion { get; set; }
    public int PasswordHintsOnNthAttempt { get; set; }
    public int RecaptchaVersion { get; set; }
    public string CloseButtonTextCssClass { get; set; }
    public string TitleCssClass { get; set; }
    public string VanillaIdToken { get; set; }
    public int SuperCookieMaxAge { get; set; }
    public bool ShowLoginSpinner { get; set; }
}

internal sealed class PostLoginRedirect
{
    public int Order { get; set; }
    public IDslExpression<bool> Enabled { get; set; }
    public string Url { get; set; }
    public string Action { get; set; }
    public PostLoginRedirectOptions Options { get; set; }
}

internal sealed class ProviderParameters
{
    public bool Enabled { get; set; }
    public bool AppendNonce { get; set; }
    public string LoginUrl { get; set; }
    public string RedirectUrl { get; set; }
    public string ClientId { get; set; }
    public bool? WelcomeDialog { get; set; }

    [CanBeNull]
    public string SdkUrl { get; set; }

    [CanBeNull]
    public string SdkVersion { get; set; }

    public bool? SdkCookie { get; set; }
    public bool? SdkLogin { get; set; }

    [CanBeNull]
    public IDslExpression<bool> IsEnabledCondition { get; set; }

    [CanBeNull]
    public IReadOnlyDictionary<string, string> RedirectQueryParams { get; set; }
}

internal sealed class PostLoginRedirectOptions
{
    public bool Logout { get; set; }
    public bool WorkflowMode { get; set; }
    public bool PostLoginWorkflowMode { get; set; }
    public int OverrideWorkflowType { get; set; }
}

internal sealed class ErrorHandler
{
    public ErrorHandlerEnabled Enabled { get; set; }

    // SiteCore name of the error
    [CanBeNull]
    public string Name { get; set; }

    // Redirect URL
    [CanBeNull]
    public string RedirectUrl { get; set; }

    // Login attempts before redirect
    public int? AttemptsBeforeRedirect { get; set; }

    public IEnumerable<ErrorHandlerParameter> Parameters { get; set; }

    // Display mode of the error i.e. Error, Warning, Information
    public string MessageType { get; set; }

    // Whether form should be reset.
    public bool ResetForm { get; set; }
}

internal sealed class ErrorHandlerEnabled
{
    public int Code { get; set; }
    public string ParameterName { get; set; }
    public string Operator { get; set; }
    public int ParameterValue { get; set; }
}

internal sealed class ErrorHandlerParameter
{
    public string Name { get; set; }
    public string Type { get; set; }
    public string Format { get; set; }
    public string FromTimeZoneId { get; set; }
    public string ToTimeZoneId { get; set; }
    public string From { get; set; }
    public string To { get; set; }
}

internal sealed class WorkflowIdUrlWhitelist
{
    public int Order { get; set; }
    public IDslExpression<bool> Enabled { get; set; }
    public IList<string> Urls { get; set; }
}
