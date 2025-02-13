using Frontend.Host.Features.Assets.AssetTypes;
using Frontend.Vanilla.Features.API;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.Assets;

[AllowAnonymous]
[Route("{culture}/api/[controller]")]
[ApiController]
public class AssetsController : BaseController
{
    private readonly IBootstrapAssetsContext bootstrapAssetsContext;
    private readonly ILazyAssetsConfigProvider lazyAssetsConfigProvider;

    public AssetsController(IBootstrapAssetsContext bootstrapAssetsContext, IServiceProvider container)
        : this(bootstrapAssetsContext, container.GetRequiredService<ILazyAssetsConfigProvider>()) { }

    internal AssetsController(IBootstrapAssetsContext bootstrapAssetsContext, ILazyAssetsConfigProvider lazyAssetsConfigProvider)
    {
        this.bootstrapAssetsContext = bootstrapAssetsContext;
        this.lazyAssetsConfigProvider = lazyAssetsConfigProvider;
    }

    [HttpGet]
    [Route("manifest")]
    public async Task<IActionResult> GetManifest(CancellationToken cancellationToken)
    {
        var data = await bootstrapAssetsContext.GetWebpackManifestFileEntriesAsync(cancellationToken);

        return OkResult(data);
    }

    [HttpGet]
    [Route("")]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var scriptsTask = lazyAssetsConfigProvider.GetConfigAsync<ScriptBootstrapAsset>(cancellationToken);
        var stylesheetsTask = lazyAssetsConfigProvider.GetConfigAsync<StylesheetBootstrapAsset>(cancellationToken);
        return Ok(new
        {
            scripts = await scriptsTask,
            stylesheets = await stylesheetsTask,
        });
    }
}
