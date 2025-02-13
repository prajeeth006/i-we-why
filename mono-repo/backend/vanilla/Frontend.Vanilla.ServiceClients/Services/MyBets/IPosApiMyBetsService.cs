using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.ServiceClients.Services.MyBets.CustomerHasBets;

namespace Frontend.Vanilla.ServiceClients.Services.MyBets;

/// <summary>
/// Represents MyBets BPOS service.
/// </summary>
internal interface IPosApiMyBetsService
{
    /// <summary>User must be authenticated or in workflow.</summary>
    [DelegateTo(typeof(ICustomerHasBetsServiceClient), nameof(ICustomerHasBetsServiceClient.GetAsync))]
    Task<bool> GetAsync(CancellationToken cancellationToken, bool cached = true);
}
