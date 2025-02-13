using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Shop;

[ApiController]
[Route("{culture}/api/[controller]")]
public class ShopController : BaseController
{
    private readonly IPosApiCommonServiceInternal posApiCommonServiceInternal;
    private readonly ICookieHandler cookieHandler;
    private readonly ILogger logger;
    private string ShopId => cookieHandler.GetValue(CookieConstants.ShopId) ?? string.Empty;

    public ShopController(IServiceProvider provider, ICookieHandler cookieHandler, ILogger<ShopController> log)
        : this(provider.GetRequiredService<IPosApiCommonServiceInternal>(), cookieHandler, log) { }

    internal ShopController(IPosApiCommonServiceInternal posApiCommonServiceInternal, ICookieHandler cookieHandler, ILogger<ShopController> logger)
    {
        this.posApiCommonServiceInternal = posApiCommonServiceInternal;
        this.cookieHandler = cookieHandler;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        try
        {
            var mode = ExecutionMode.Async(cancellationToken);
            var shopDetails = await posApiCommonServiceInternal.GetShopDetailsAsync(mode, ShopId);

            return Ok(new
            {
                shopDetails,
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling Get Shop action");

            return BadRequest();
        }
    }
}
