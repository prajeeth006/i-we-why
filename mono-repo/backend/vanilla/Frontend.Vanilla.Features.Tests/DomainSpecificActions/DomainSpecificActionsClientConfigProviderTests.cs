using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.DomainSpecificActions;
using Frontend.Vanilla.Features.DomainSpecificActions.Configuration;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DomainSpecificActions;

public class DomainSpecificActionsClientConfigProviderTests
{
    private IClientConfigProvider target;
    private Mock<IDsaConfiguration> config;
    private TestLogger<DomainSpecificActionsClientConfigProvider> log;

    private Mock<IDslAction> dslAction;
    private CancellationToken ct;

    public DomainSpecificActionsClientConfigProviderTests()
    {
        config = new Mock<IDsaConfiguration>();
        log = new TestLogger<DomainSpecificActionsClientConfigProvider>();
        target = new DomainSpecificActionsClientConfigProvider(config.Object, log);

        dslAction = new Mock<IDslAction>();
        ct = TestCancellationToken.Get();

        config.SetupGet(c => c.HtmlDocumentClientDslAction).Returns(dslAction.Object);
    }

    private Task<object> Act() => target.GetClientConfigAsync(ct);

    [Fact]
    public async Task ShouldReturnClientAction()
    {
        dslAction.Setup(a => a.ExecuteToClientScriptAsync(ct)).ReturnsAsync("test");

        var result = await Act();

        result.Should().BeEquivalentTo(new { DslAction = "test" });
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldReturnEmptyObject_IfNothingConfigured()
    {
        config.SetupGet(c => c.HtmlDocumentClientDslAction).Returns(() => null);

        var result = await Act();

        result.Should().BeSameAs(EmptyDictionary<string, object>.Singleton);
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldHandleErrors()
    {
        var ex = new Exception("Oups");
        dslAction.Setup(a => a.ExecuteToClientScriptAsync(ct)).ThrowsAsync(ex);
        dslAction.Setup(a => a.ToString()).Returns("expr");

        var result = await Act();

        result.Should().BeSameAs(EmptyDictionary<string, object>.Singleton);
        log.Logged.Single().Verify(LogLevel.Error, ex, ("dslAction", "expr"));
    }
}
