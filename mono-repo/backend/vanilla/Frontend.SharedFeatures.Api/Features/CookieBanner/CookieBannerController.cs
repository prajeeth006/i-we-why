using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.CookieBanner;

[Route("api/[controller]")]
[ApiController]
[BypassAntiForgeryToken]
[AllowAnonymous]
public class CookieBannerController(ICookieHandler cookieHandler, ILogger<CookieBannerController> log)
    : BaseController
{
    [HttpPost("setOptanonGroupCookie")]
    [NeverRenewAuthentication]
    public IActionResult SetOptanonGroupCookie([FromBody] CookieBannerRequest cookieBannerRequest)
    {
        try
        {
            cookieHandler.Set(CookieConstants.OptanonGroups, cookieBannerRequest.CookieValue, new CookieSetOptions
            {
                MaxAge = TimeSpan.FromDays(365),
            });

            return Ok();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed saving cookie banner cookie value");

            return BadRequest();
        }
    }
}

public sealed class CookieBannerRequest(string cookieValue)
{
    public string CookieValue { get; set; } = cookieValue;
}
