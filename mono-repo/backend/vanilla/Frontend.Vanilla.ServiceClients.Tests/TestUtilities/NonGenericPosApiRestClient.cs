using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Execution;

namespace Frontend.Vanilla.ServiceClients.Tests.TestUtilities;

internal abstract class NonGenericPosApiRestClient : PosApiRestClientBase
{
    public abstract object Execute(ExecutionMode mode, PosApiRestRequest request, Type resultType);

    public sealed override Task ExecuteAsync(ExecutionMode mode, PosApiRestRequest request)
        => Task.FromResult(Execute(mode, request, null));

    public sealed override Task<T> ExecuteAsync<T>(ExecutionMode mode, PosApiRestRequest request)
        => Task.FromResult((T)Execute(mode, request, typeof(T)));
}
