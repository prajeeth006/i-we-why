using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Retail;
using Frontend.Vanilla.ServiceClients.Services.Retail.PayoutValueTicket;
using Frontend.Vanilla.ServiceClients.Services.Retail.ValueTicket;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Retail;

[Authorize]
[Route("{culture}/api/[controller]")]
[ApiController]
public sealed class RetailController : BaseController
{
    private readonly IPosApiRetailServiceInternal posApiRetailServiceInternal;
    private readonly ILogger logger;

    public RetailController(IServiceProvider container, ILogger<RetailController> log)
        : this(container.GetRequiredService<IPosApiRetailServiceInternal>(), log) { }

    internal RetailController(IPosApiRetailServiceInternal posApiRetailServiceInternal, ILogger<RetailController> logger)
    {
        this.posApiRetailServiceInternal = posApiRetailServiceInternal;
        this.logger = logger;
    }

    [HttpGet("valueticket")]
    public async Task<IActionResult> GetValueTicket([FromQuery] ValueTicketRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await posApiRetailServiceInternal.GetValueTicketAsync(request, cancellationToken);

            return OkResult(result);
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling GetValueTicket action");

            return BadRequest(sex.ErrorMessage()).WithTechnicalErrorMessage(sex.ErrorCode());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling GetValueTicket action");

            return BadRequest().WithTechnicalErrorMessage(scope: "valueticket");
        }
    }

    [HttpPost("payoutvalueticket")]
    public async Task<IActionResult> PayoutValueTicket(PayoutValueTicketRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await posApiRetailServiceInternal.PayoutValueTicketAsync(request, cancellationToken);

            return OkResult(result);
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, $"Error from PosAPI while calling PayoutValueTicket with ID: {request.Id}");

            return BadRequest(sex.ErrorMessage()).WithTechnicalErrorMessage(sex.ErrorCode());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"General error while calling PayoutValueTicket with ID: {request.Id}");

            return BadRequest().WithTechnicalErrorMessage(scope: "payoutvalueticket");
        }
    }

    [HttpGet("terminalsession")]
    public async Task<IActionResult> GetTerminalSession(CancellationToken cancellationToken)
    {
        try
        {
            var mode = ExecutionMode.Async(cancellationToken);
            var result = await posApiRetailServiceInternal.GetTerminalSessionAsync(mode);

            return OkResult(result);
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling GetTerminalSession action");

            return BadRequest(sex.ErrorMessage()).WithTechnicalErrorMessage(sex.ErrorCode());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling GetTerminalSession action");

            return BadRequest().WithTechnicalErrorMessage(scope: "terminalsession");
        }
    }
}
