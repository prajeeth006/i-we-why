using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.ServiceClients.Services.Promohub.BonusAward;

internal interface IPosApiBonusAwardServiceClient
{
    Task<BonusAwardResponse> GetBonusAwardAsync(ExecutionMode mode, string offerId);
}
