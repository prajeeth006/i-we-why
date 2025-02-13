using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Rest;

public class RestClientBaseTests
{
    private IRestClient target;
    private Mock<RestClientBase> underlyingMock;
    private RestRequest request;
    private RestResponse response;

    public RestClientBaseTests()
    {
        underlyingMock = new Mock<RestClientBase>();
        target = underlyingMock.Object;
        request = new RestRequest(new HttpUri("http://test"));
        response = new RestResponse(request);

        underlyingMock.SetupWithAnyArgs(x => x.ExecuteAsync(default, null)).ReturnsAsync(response);
    }

    [Fact]
    public void Execute_ShouldDelegateToExecutionMode()
    {
        var result = target.Execute(request); // Act

        result.Should().BeSameAs(response);
        underlyingMock.Verify(x => x.ExecuteAsync(ExecutionMode.Sync, request));
    }

    [Fact]
    public async Task ExecuteAsync_ShouldDelegateToExecutionMode()
    {
        var ct = TestCancellationToken.Get();

        var result = await target.ExecuteAsync(request, ct); // Act

        result.Should().BeSameAs(response);
        underlyingMock.Verify(x => x.ExecuteAsync(ExecutionMode.Async(ct), request));
    }
}
