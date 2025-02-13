using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Promohub.BonusAward;

namespace Frontend.Vanilla.ServiceClients.Services.Promohub;

internal interface IPosApiPromohubServiceInternal
{
    [DelegateTo(typeof(IPosApiBonusAwardServiceClient), nameof(IPosApiBonusAwardServiceClient.GetBonusAwardAsync))]
    Task<BonusAwardResponse> GetBonusAwardAsync(ExecutionMode mode, string offerId);
}
