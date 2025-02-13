using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.ReCaptcha;

internal interface IVerificationEvaluationService
{
    Task<bool> VerifyUsersResponseAsync(
        TrimmedRequiredString area,
        string? usersResponse,
        Dictionary<string, object> additionalParameters,
        CancellationToken cancellationToken);
}

internal sealed class VerificationEvaluationService(IVerificationService verificationService) : IVerificationEvaluationService
{
    public async Task<bool> VerifyUsersResponseAsync(
        TrimmedRequiredString area,
        string? usersResponse,
        Dictionary<string, object> additionalParameters,
        CancellationToken cancellationToken)
    {
        var response = await verificationService.VerifyAsync(area, usersResponse, additionalParameters, cancellationToken);

        return response.ErrorCodes.Contains(ReCaptchaErrorCodes.Disabled) || response is { Success: true, ErrorCodes.Count: 0 };
    }
}
