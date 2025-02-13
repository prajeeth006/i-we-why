using Frontend.Host.Features.Index;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host;

/// <summary>Controller in charge of returning initial html to client.</summary>
public class HostController : Controller
{
    private readonly IIndexHtmlConfiguration indexHtmlConfiguration;
    private readonly IClientIndexHtmlProvider clientIndexHtmlProvider;
    private const string IndexHtmlContentType = "text/html";

    public HostController(IServiceProvider services)
        : this(services.GetRequiredService<IIndexHtmlConfiguration>(), services.GetRequiredService<IClientIndexHtmlProvider>())
    {
    }

    internal HostController(IIndexHtmlConfiguration indexHtmlConfiguration, IClientIndexHtmlProvider clientIndexHtmlProvider)
    {
        this.indexHtmlConfiguration = indexHtmlConfiguration;
        this.clientIndexHtmlProvider = clientIndexHtmlProvider;
    }

    /// <summary>Returns initial html to client.</summary>
    public async Task<IActionResult> Index()
    {
        if (indexHtmlConfiguration.Mode == IndexHtmlMode.RazorIndexView)
        {
            return View();
        }

        ControllerContext.HttpContext.Response.DisableCache();
        return Content(await clientIndexHtmlProvider.GetAsync(ControllerContext.HttpContext), IndexHtmlContentType);
    }
}
