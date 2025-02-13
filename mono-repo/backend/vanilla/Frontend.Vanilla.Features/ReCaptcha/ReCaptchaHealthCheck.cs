using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Diagnostics.Health;

namespace Frontend.Vanilla.Features.ReCaptcha;

internal class ReCaptchaEnterpriseHealthCheck(IVerificationService verificationService, IReCaptchaConfiguration config) : IHealthCheck
{
    public bool IsEnabled => true;

    public HealthCheckMetadata Metadata { get; } = new (
        name: "RecaptchaEnterprise",
        description: "Checks if configured RecaptchaEnterprise secret keys are valid.",
        whatToDoIfFailed: "Check if configured site/secret RecaptchaEnterprise keys (maintained by infosec@gvcgroup.com) are valid, or if google service is accessible.",
        severity: HealthCheckSeverity.Default,
        configurationFeatureName: ReCaptchaConfiguration.FeatureName,
        documentationUri: new Uri("https://docs.vanilla.intranet/features-recaptcha.html"));

    public async Task<HealthCheckResult> ExecuteAsync(CancellationToken cancellationToken)
    {
        if (!config.InstrumentationOnPageLoad && config.Areas.All(x => x.Value == ReCaptchaEnablement.Disabled))
        {
            return HealthCheckResult.DisabledFeature;
        }

        try
        {
            await verificationService.VerifyEnterpriseRawAsync("test", cancellationToken);
        }
        catch (Exception ex)
        {
            return HealthCheckResult.CreateFailed(ex);
        }

        return HealthCheckResult.Success;
    }
}

internal enum ReCaptchaHealthStatus
{
    Ok,
    Disabled,
    InvalidSecretKey,
    TestSecretKey,
    CheckNotFinished,
}
