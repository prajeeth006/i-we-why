using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class SessionFundSummaryDslProvider(ISessionFundSummaryDslExecutor executor) : ISessionFundSummaryDslProvider
{
    public Task<decimal> GetProfitAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.Profit);

    public Task<decimal> GetLossAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.Loss);

    public Task<decimal> GetTotalStakeAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.TotalStake);

    public Task<decimal> GetInitialBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.InitialBalance);

    public Task<decimal> GetCurrentBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.CurrentBalance);
}
