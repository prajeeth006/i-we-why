using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Features.App;
using Frontend.Vanilla.Features.WebIntegration.Core;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Core;

public class WebAppContextSwitchMiddlewareTests
{
    [Fact]
    public async Task ShouldExecuteAllSwitchHandlers()
    {
        var next = new Mock<RequestDelegate>();
        var handler1 = new Mock<ICurrentContextSwitchHandler>();
        var handler2 = new Mock<ICurrentContextSwitchHandler>();
        var appConfiguration = new Mock<IAppConfiguration>();
        appConfiguration.SetupGet(c => c.UseSwitchMiddleware).Returns(true);
        var target = new WebAppContextSwitchMiddleware(next.Object, new[] { handler1.Object, handler2.Object }, appConfiguration.Object);

        var ct = TestCancellationToken.Get();
        var ctx = Mock.Of<HttpContext>(c => c.RequestAborted == ct);

        var executed = new List<string>();
        next.Setup(n => n(ctx)).Callback(() => executed.Add("Next")).Returns(Task.CompletedTask);
        handler1.Setup(h => h.OnContextBeginAsync(ct)).Callback(() => executed.Add("Begin1")).Returns(Task.CompletedTask);
        handler1.Setup(h => h.OnContextEndAsync(ct)).Callback(() => executed.Add("End1")).Returns(Task.CompletedTask);
        handler2.Setup(h => h.OnContextBeginAsync(ct)).Callback(() => executed.Add("Begin2")).Returns(Task.CompletedTask);
        handler2.Setup(h => h.OnContextEndAsync(ct)).Callback(() => executed.Add("End2")).Returns(Task.CompletedTask);

        // Act
        await target.InvokeAsync(ctx);
        executed.Should().Equal("Begin1", "Begin2", "Next", "End1", "End2");
    }
}
