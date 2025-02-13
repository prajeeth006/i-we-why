using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.API;

/// <summary>Serves client config.</summary>
[Route("{culture}/api/clientconfig")]
[ApiController]
public sealed class ClientConfigController : BaseController
{
    private readonly IClientConfigMerger clientConfigurationMerger;

    /// <summary>Creates a new instance.</summary>
    public ClientConfigController(IServiceProvider services)
        : this(services.GetRequiredService<IClientConfigMerger>()) { }

    internal ClientConfigController(IClientConfigMerger clientConfigurationMerger)
        => this.clientConfigurationMerger = clientConfigurationMerger;

    /// <summary>Gets full client config.</summary>
    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
        => Ok(await clientConfigurationMerger.GetMergedConfigAsync(cancellationToken));

    /// <summary>Gets partial client config.</summary>
    [HttpGet("partial")]
    public async Task<IActionResult> GetPartial([FromQuery] string[] configNames, CancellationToken cancellationToken)
    {
        try
        {
            return Ok(await clientConfigurationMerger.GetMergedConfigForAsync(configNames, cancellationToken));
        }
        catch (ClientConfigException ex)
        {
            return BadRequest(ex.GetMessageIncludingInner());
        }
    }
}
