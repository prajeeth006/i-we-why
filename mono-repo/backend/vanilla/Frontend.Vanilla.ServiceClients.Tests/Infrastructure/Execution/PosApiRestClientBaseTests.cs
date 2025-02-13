using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Execution;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Execution;

public sealed class PosApiRestClientBaseTests
{
    private IPosApiRestClient target;
    private Mock<PosApiRestClientBase> underlyingMock;
    private PosApiRestRequest request;
    private IFoo testValue;
    private CancellationToken ct;

    public PosApiRestClientBaseTests()
    {
        underlyingMock = new Mock<PosApiRestClientBase>();
        target = underlyingMock.Object;
        request = new PosApiRestRequest(new PathRelativeUri("test"));
        testValue = Mock.Of<IFoo>();
        ct = new CancellationTokenSource().Token;
    }

    public interface IFoo { }

    [Fact]
    public void Void_Sync_ShouldExecute()
    {
        target.Execute(request); // Act

        underlyingMock.Verify(c => c.ExecuteAsync(ExecutionMode.Sync, request));
    }

    [Fact]
    public async Task Void_Async_ShouldExecute()
    {
        await target.ExecuteAsync(request, ct); // Act

        underlyingMock.Verify(c => c.ExecuteAsync(ExecutionMode.Async(ct), request));
    }

    [Fact]
    public void ReturnValue_Sync_ShouldExecute()
    {
        underlyingMock.Setup(c => c.ExecuteAsync<IFoo>(ExecutionMode.Sync, request)).ReturnsAsync(testValue);

        var result = target.Execute<IFoo>(request); // Act

        result.Should().BeSameAs(testValue);
    }

    [Fact]
    public async Task ReturnValue_Async_ShouldExecute()
    {
        underlyingMock.Setup(c => c.ExecuteAsync<IFoo>(ExecutionMode.Async(ct), request)).ReturnsAsync(testValue);

        var result = await target.ExecuteAsync<IFoo>(request, ct); // Act

        result.Should().BeSameAs(testValue);
    }
}
