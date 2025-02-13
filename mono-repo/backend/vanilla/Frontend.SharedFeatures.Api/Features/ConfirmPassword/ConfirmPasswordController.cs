using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Account.Password;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.ConfirmPassword;

[Authorize]
[Route("{culture}/api/[controller]")]
[ApiController]
public sealed class ConfirmPasswordController : BaseController
{
    private readonly IPasswordServiceClient passwordServiceClient;
    private readonly ILogger logger;

    public ConfirmPasswordController(IServiceProvider container, ILogger<ConfirmPasswordController> log)
        : this(container.GetRequiredService<IPasswordServiceClient>(), log) { }

    internal ConfirmPasswordController(IPasswordServiceClient passwordServiceClient, ILogger<ConfirmPasswordController> logger)
    {
        this.passwordServiceClient = passwordServiceClient;
        this.logger = logger;
    }

    [HttpGet("ispasswordvalidationrequired")]
    public async Task<IActionResult> IsPasswordValidationRequired(CancellationToken cancellationToken)
    {
        try
        {
            var isPasswordValidationRequired = await passwordServiceClient.GetAsync(ExecutionMode.Async(cancellationToken));

            return Ok(new { isPasswordValidationRequired.ValidationRequired });
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosApi while checking if password validation is required");

            return BadRequest(new { errorCode = sex.PosApiCode });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while checking if password validation is required");

            return BadRequest();
        }
    }
}
