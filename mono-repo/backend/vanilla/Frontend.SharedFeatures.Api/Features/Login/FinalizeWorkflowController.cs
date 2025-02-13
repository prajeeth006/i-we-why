using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Login;

[Route("{culture}/api/[controller]")]
[ApiController]
public sealed class FinalizeWorkflowController : BaseController
{
    private readonly ILoginResultHandlerInternal loginResultHandler;

    internal FinalizeWorkflowController(ILoginResultHandlerInternal loginResultHandler)
    {
        this.loginResultHandler = loginResultHandler;
    }

    public FinalizeWorkflowController(IServiceProvider c)
        : this(c.GetRequiredService<ILoginResultHandlerInternal>()) { }

    [BypassAntiForgeryToken]
    [HttpPost]
    public async Task<IActionResult> Post(WorkflowParameters request, CancellationToken cancellationToken)
    {
        return await loginResultHandler.HandleAsync(loginService => loginService.FinalizeWorkflow(request, cancellationToken), cancellationToken);
    }
}
