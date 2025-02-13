using System;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ClientConfig;

public sealed class LambdaClientConfigProviderTests
{
    private CancellationToken ct;
    private object clientConfig;

    public LambdaClientConfigProviderTests()
    {
        ct = TestCancellationToken.Get();
        clientConfig = new object();
    }

    [Fact]
    public async Task ShouldExposeProvidedLogic()
    {
        var func = new Mock<Func<object>>();
        var target = new LambdaClientConfigProvider("test", func.Object);
        func.VerifyNoOtherCalls(); // Not called in ctor
        func.Setup(f => f()).Returns(clientConfig);

        await RunTest(target);
    }

    [Fact]
    public async Task ShouldExposeProvidedLogic_Async()
    {
        var func = new Mock<Func<CancellationToken, Task<object>>>();
        var target = new LambdaClientConfigProvider("test", func.Object);
        func.VerifyNoOtherCalls(); // Not called in ctor
        func.Setup(f => f(ct)).ReturnsAsync(clientConfig);

        await RunTest(target);
    }

    private async Task RunTest(IClientConfigProvider target)
    {
        // Act
        var result = await target.GetClientConfigAsync(ct);

        result.Should().BeSameAs(clientConfig);
        target.Name.Should().Be("test");
        target.Type.Should().Be(ClientConfigType.Eager);
    }

    [Fact]
    public void DisabledConfig_ShouldContainsIsEnabledFalsePRoperty()
    {
        var configJson = ((JRaw)LambdaClientConfigProvider.DisabledConfig).Value;

        configJson.Should().BeJson("{ isEnabled: false }");
        configJson.ToString().Should().NotContain(" ", "should be minified");
    }
}
