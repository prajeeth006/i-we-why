using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Json.ActionResults;

/// <summary>
/// Base class for extending <see cref="IActionResult"/>. Implementations of this class
/// are meant to be used through extension methods <see cref="ActionResultExtensions"/>.
/// </summary>
public abstract class ExtendResultBase : IActionResult
{
    /// <summary>
    /// The next <see cref="IActionResult"/> that this class decorates.
    /// </summary>
    public IActionResult InnerResult { get; }

    /// <summary>
    /// Initializes a new instance of the <see cref="ExtendResultBase"/> class.
    /// </summary>
    /// <param name="innerResult">Current action result that will be wrapped and decorated by this class.</param>
    public ExtendResultBase(IActionResult innerResult)
    {
        InnerResult = innerResult;
    }

    /// <summary>
    /// Executes the result operation of the action method asynchronously. This method is called by MVC to process
    /// the result of an action method.
    /// </summary>
    /// <param name="context">The context in which the result is executed. The context information includes
    /// information about the action that was executed and request information.</param>
    /// <returns>A task that represents the asynchronous execute operation.</returns>
    public virtual async Task ExecuteResultAsync(ActionContext context)
    {
        var writer = await CreateWriter(context.HttpContext);

        if (writer != null)
        {
            context.HttpContext.RequestServices.GetRequiredService<IJsonResponseBodyExtender>().AddForThisRequest(writer);
        }

        await InnerResult.ExecuteResultAsync(context);
    }

    /// <summary>Creates a writer to extend JSON result.</summary>
    protected abstract Task<IJsonResponseBodyExtensionWriter?> CreateWriter(HttpContext httpContext);
}
