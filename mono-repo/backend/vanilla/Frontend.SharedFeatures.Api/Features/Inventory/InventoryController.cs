using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Terminal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Inventory;

[Authorize]
[Route("{culture}/api/[controller]")]
[ApiController]
public sealed class InventoryController : BaseController
{
    private readonly IPosApiCommonServiceInternal posApiCommonServiceInternal;
    private readonly ILogger logger;

    public InventoryController(IServiceProvider container, ILogger<InventoryController> log)
        : this(container.GetRequiredService<IPosApiCommonServiceInternal>(), log) { }

    internal InventoryController(IPosApiCommonServiceInternal posApiCommonServiceInternal, ILogger<InventoryController> logger)
    {
        this.posApiCommonServiceInternal = posApiCommonServiceInternal;
        this.logger = logger;
    }

    [HttpGet("shopdetails")]
    public async Task<IActionResult> GetShopDetails(string id, CancellationToken cancellationToken, bool cached = true)
    {
        try
        {
            var mode = ExecutionMode.Async(cancellationToken);
            var result = await posApiCommonServiceInternal.GetShopDetailsAsync(mode, id, cached);

            return OkResult(result);
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, $"Error from PosAPI while calling GetShopDetails with ID: {id}");

            return BadRequest().WithTechnicalErrorMessage(sex.PosApiCode.ToString());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"General error while calling GetShopDetails with ID: {id}");

            return BadRequest().WithTechnicalErrorMessage(scope: "shopdetails");
        }
    }

    [HttpGet("terminaldetails")]
    public async Task<IActionResult> GetTerminalDetails([FromQuery] TerminalDetailsRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var mode = ExecutionMode.Async(cancellationToken);
            var result = await posApiCommonServiceInternal.GetTerminalDetailsAsync(mode, request);

            return OkResult(result);
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, $"Error from PosAPI while calling GetTerminalDetails with Shop ID: {request.ShopId} and Terminal ID: {request.TerminalId}");

            return BadRequest().WithTechnicalErrorMessage(sex.PosApiCode.ToString());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"General error while calling GetTerminalDetails with Shop ID: {request.ShopId} and Terminal ID: {request.TerminalId}");

            return BadRequest().WithTechnicalErrorMessage(scope: "terminaldetails");
        }
    }
}
