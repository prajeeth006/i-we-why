using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.TestWeb.Api;

[Route("{culture}/playground/api/[controller]")]
public class LoginController(IServiceProvider serviceProvider) : BaseController
{
    private readonly IWebAuthenticationService authenticationService = serviceProvider.GetRequiredService<IWebAuthenticationService>();

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Post(CancellationToken cancellationToken)
    {
        await authenticationService.LoginAsync(new LoginParameters("DefaultUser", "pwd"), cancellationToken);

        return Ok();
    }

    [HttpPost("workflow")]
    [AllowAnonymous]
    public async Task<IActionResult> Workflow(CancellationToken cancellationToken)
    {
        await authenticationService.LoginAsync(new LoginParameters("DefaultUser", "pwd"), cancellationToken);

        return Ok();
    }

    [HttpPost("danish")]
    [AllowAnonymous]
    public async Task<IActionResult> Danish(CancellationToken cancellationToken)
    {
        await authenticationService.LoginAsync(new LoginParameters("DefaultUser", "pwd"), cancellationToken);

        return Ok();
    }

    [HttpPost("coral")]
    public async Task<IActionResult> Coral(CancellationToken cancellationToken)
    {
        var result = await authenticationService.LoginAsync(new LoginParameters("DefaultUser", "pwd"), cancellationToken);

        return OkResult(result);
    }

    [HttpPost("french")]
    public async Task<IActionResult> French(CancellationToken cancellationToken)
    {
        var result = await authenticationService.LoginAsync(new LoginParameters("DefaultUser", "pwd"), cancellationToken);

        return OkResult(result);
    }

    [HttpPost("malta")]
    public async Task<IActionResult> Malta(CancellationToken cancellationToken)
    {
        var result = await authenticationService.LoginAsync(new LoginParameters("DefaultUser", "pwd"), cancellationToken);

        return OkResult(result);
    }

    [HttpPost("lowbalance")]
    public async Task<IActionResult> LowBalance(CancellationToken cancellationToken)
    {
        var result = await authenticationService.LoginAsync(new LoginParameters("DefaultUser", "pwd"), cancellationToken);

        return OkResult(result);
    }

    [HttpGet("authorized")]
    [Authorize]
    public IActionResult Authorized()
    {
        return new JsonResult("User is authorized (logged in)");
    }
}
