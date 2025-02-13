using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Login;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Login;

[Route("{culture}/api/[controller]")]
[ApiController]
public sealed class FinalizePostLoginWorkflowController : BaseController
{
    private readonly ILoginResultHandlerInternal loginResultHandler;

    internal FinalizePostLoginWorkflowController(ILoginResultHandlerInternal loginResultHandler)
    {
        this.loginResultHandler = loginResultHandler;
    }

    public FinalizePostLoginWorkflowController(IServiceProvider c)
        : this(c.GetRequiredService<ILoginResultHandlerInternal>()) { }

    [BypassAntiForgeryToken]
    [HttpPost]
    public async Task<IActionResult> Post(object request, CancellationToken cancellationToken)
    {
        return await loginResultHandler.HandleAsync(loginService => loginService.FinalizePostLoginWorkflow(cancellationToken), cancellationToken);
    }
}
