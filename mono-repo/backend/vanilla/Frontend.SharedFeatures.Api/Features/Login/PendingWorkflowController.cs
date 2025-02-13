using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.PlaceholderReplacers;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Login;

[Route("{culture}/api/[controller]")]
[ApiController]
public sealed class PendingWorkflowController : BaseController
{
    private readonly ILoginResultHandlerInternal loginResultHandler;
    private readonly ILoginService loginService;
    private readonly IProductPlaceholderReplacer productPlaceholderReplacer;
    private readonly ICurrentUserAccessor currentUserAccessor;
    private readonly ILogger log;

    public PendingWorkflowController(IServiceProvider c, ICurrentUserAccessor currentUserAccessor, ILogger<PendingWorkflowController> log)
        : this(c.GetRequiredService<ILoginResultHandlerInternal>(),
            c.GetRequiredService<ILoginService>(),
            c.GetRequiredService<IProductPlaceholderReplacer>(),
            currentUserAccessor,
            log) { }

    internal PendingWorkflowController(
        ILoginResultHandlerInternal loginResultHandler,
        ILoginService loginService,
        IProductPlaceholderReplacer productPlaceholderReplacer,
        ICurrentUserAccessor currentUserAccessor,
        ILogger<PendingWorkflowController> log)
    {
        this.loginResultHandler = loginResultHandler;
        this.loginService = loginService;
        this.productPlaceholderReplacer = productPlaceholderReplacer;
        this.currentUserAccessor = currentUserAccessor;
        this.log = log;
    }

    [BypassAntiForgeryToken]
    [HttpPost]
    public async Task<IActionResult> Post(PendingWorkflowRequest request, CancellationToken cancellationToken)
    {
        if ((string.IsNullOrEmpty(request.NativeClientSessionKey) || string.IsNullOrEmpty(request.NativeClientUsertoken))
            && currentUserAccessor.User.GetWorkflowTypeId() != 0)
        {
            request.NativeClientUsertoken = currentUserAccessor.User.FindValue(PosApiClaimTypes.UserToken);
            request.NativeClientSessionKey = currentUserAccessor.User.FindValue(PosApiClaimTypes.SessionToken);
        }

        return await loginResultHandler.HandleAsync(
            _ => loginService.LoginUsingTokens(request.NativeClientUsertoken, request.NativeClientSessionKey, cancellationToken),
            cancellationToken);
    }

    [HttpGet("postloginredirecturl")]
    public async Task<IActionResult> GetPostLoginRedirectUrl(CancellationToken cancellationToken)
    {
        var currentPostLoginRedirectKey = loginService.GetPostLoginRedirectKeyFromCache();

        if (currentPostLoginRedirectKey == null)
        {
            log.LogError("No post login redirect stored in cache");

            throw new Exception("No post login redirect key stored in cache");
        }

        var url = loginService.GetPostLoginRedirect(currentPostLoginRedirectKey).Url;
        var currentPostLoginUrl = await productPlaceholderReplacer.ReplaceAsync(ExecutionMode.Async(cancellationToken), url);

        return Ok(new
        {
            RedirectUrl = currentPostLoginUrl,
        });
    }

    [HttpGet("postlogin")]
    public async Task<IActionResult> GetPostLogin(CancellationToken cancellationToken)
    {
        var (key, redirectInfo) = await loginService.GetNextPostLoginRedirectAsync(ExecutionMode.Async(cancellationToken));

        if (key == null)
        {
            return Ok(new
            {
                isCompleted = true,
            });
        }

        var url = redirectInfo.Url;
        var redirectUrl = await productPlaceholderReplacer.ReplaceAsync(ExecutionMode.Async(cancellationToken), url);

        return Ok(new
        {
            isCompleted = false,
            redirectUrl,
        });
    }
}
