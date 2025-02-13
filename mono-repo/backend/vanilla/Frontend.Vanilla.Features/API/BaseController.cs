using Frontend.Vanilla.Features.Json;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.Vanilla.Features.API;

/// <summary>
/// Abstraction class over .NET Core ControllerBase.
/// </summary>
[ResponseCacheControlCore]
public abstract class BaseController : ControllerBase
{
    /// <summary>
    /// Override Ok action result in order to always use `OkObjectResult` and apply custom formatter
    /// <see cref="VanillaJsonAndStringOutputFormatter"/>.
    /// </summary>
    /// <returns>OkObjectResult.</returns>
    [NonAction]
    protected new OkObjectResult Ok()
        => Ok(new { });

    /// <summary>
    /// Override BadRequest action result in order to always use `BadRequestObjectResult` and apply custom formatter
    /// <see cref="VanillaJsonAndStringOutputFormatter"/>.
    /// </summary>
    /// <returns>BadRequestObjectResult.</returns>
    [NonAction]
    protected new BadRequestObjectResult BadRequest()
        => BadRequest(new { });

    /// <summary>
    /// Overload BadRequest action result in order to always use `BadRequestObjectResult` and apply custom formatter
    /// <see cref="VanillaJsonAndStringOutputFormatter"/>.
    /// </summary>
    /// <returns>BadRequestObjectResult.</returns>
    [NonAction]
    protected BadRequestObjectResult BadRequest(string message)
        => BadRequest(new { message });

    /// <summary>
    /// Overload Ok action result in order to always use `OkObjectResult` and apply custom formatter
    /// <see cref="VanillaJsonAndStringOutputFormatter"/>.
    /// </summary>
    /// <returns>OkObjectResult.</returns>
    [NonAction]
    protected OkObjectResult OkResult(object? value)
        => Ok(value ?? new { value });
}
