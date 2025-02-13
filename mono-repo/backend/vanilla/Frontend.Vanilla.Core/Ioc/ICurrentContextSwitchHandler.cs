using System.Threading;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Core.Ioc;

/// <summary>
/// Registers to events related to switching app context e.g. static, HttpContext, some other scope...
/// </summary>
internal interface ICurrentContextSwitchHandler
{
    Task OnContextBeginAsync(CancellationToken cancellationToken);
    Task OnContextEndAsync(CancellationToken cancellationToken);
}
