using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.MohDetails;

[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class MohDetailsController : BaseController
{
    private readonly IPosApiAccountServiceInternal accountService;
    private readonly ILogger logger;

    public MohDetailsController(IServiceProvider provider, ILogger<MohDetailsController> log)
        : this(provider.GetRequiredService<IPosApiAccountServiceInternal>(), log) { }

    internal MohDetailsController(IPosApiAccountServiceInternal accountService, ILogger<MohDetailsController> logger)
    {
        this.accountService = accountService;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken, bool cached = true)
    {
        try
        {
            var mode = ExecutionMode.Async(cancellationToken);

            var mohDetails = await accountService.GetMohDetailsAsync(mode, cached);

            return OkResult(mohDetails);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Service exception while getting Moh details");

            return BadRequest();
        }
    }
}
