using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.ReCaptcha;

/// <summary>
/// Determines if reCAPTCHA should be enabled for particular context according to the configuration.
/// </summary>
internal interface IEnablementService
{
    Task<bool> IsEnabledAsync(TrimmedRequiredString area, CancellationToken cancellationToken);
}

internal sealed class EnablementService(IReCaptchaConfiguration config, IFailureCounter counter, ILogger<EnablementService> log)
    : IEnablementService
{
    public Task<bool> IsEnabledAsync(TrimmedRequiredString area, CancellationToken cancellationToken)
    {
        Guard.NotNull(area, nameof(area));

        if (!config.Areas.TryGetValue(area, out var enablement))
        {
            log.LogError(
                "reCAPTCHA {area} is missing in the configuration VanillaFramework.Features.ReCaptcha -> Areas"
                + " therefore the widget will be enabled to restrict potential attacker from faking the area",
                area);

            return Task.FromResult(true);
        }

        return enablement == ReCaptchaEnablement.EnableOnFailureCount
            ? counter.HasFailedAsync(area, cancellationToken)
            : Task.FromResult(enablement == ReCaptchaEnablement.Enabled);
    }
}
