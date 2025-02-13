using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.SingleSignOn;

[Route("api/[controller]")]
[ApiController]
[BypassAntiForgeryToken]
[AllowAnonymous]
public class SingleSignOnController(ICurrentUserAccessor currentUserAccessor, ICookieHandler cookieHandler, ILogger<SingleSignOnController> log)
    : BaseController
{
    [HttpPost("setssotoken")]
    [NeverRenewAuthentication]
    public IActionResult SetSsoToken([FromBody] SsoTokenRequest ssoTokenRequest)
    {
        try
        {
            if (!currentUserAccessor.User.IsAuthenticatedOrHasWorkflow())
                cookieHandler.Set(CookieConstants.SsoTokenCrossDomain, ssoTokenRequest.SsoToken, new CookieSetOptions
                {
                    HttpOnly = true,
                });

            return Ok();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed saving sso token cookie");

            return BadRequest();
        }
    }
}

/// <summary>
/// SsoTokenRequest.
/// </summary>
public sealed class SsoTokenRequest(string ssoToken)
{
    /// <summary>
    /// SsoToken.
    /// </summary>
    public string SsoToken { get; set; } = ssoToken;
}
