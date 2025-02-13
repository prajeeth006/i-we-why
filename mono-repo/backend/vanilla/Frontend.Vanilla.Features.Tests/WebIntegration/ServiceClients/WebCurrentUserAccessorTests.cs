using System;
using System.Security.Claims;
using System.Security.Principal;
using FluentAssertions;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Features.WebIntegration.ServiceClients;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.ServiceClients;

public class WebCurrentUserAccessorTests
{
    private ICurrentUserAccessor target;
    private IThread thread;
    private Mock<IHttpContextAccessor> httpContextAccessor;
    private ClaimsPrincipal testUser;

    public WebCurrentUserAccessorTests()
    {
        thread = Mock.Of<IThread>();
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        target = new WebCurrentUserAccessor(thread, httpContextAccessor.Object);
        testUser = new ClaimsPrincipal();
    }

    [Fact]
    public void Get_ShouldGetUserFromHttpContext()
    {
        thread.CurrentPrincipal = Mock.Of<IPrincipal>(); // Should be ignored
        httpContextAccessor.SetupGet(o => o.HttpContext.User).Returns(testUser);

        var result = target.User; // Act

        result.Should().BeSameAs(testUser);
    }

    [Theory, BooleanData]
    public void Get_ShouldGetUserFromThread_IfNullUserOrHttpContext(bool noHttpContext)
    {
        httpContextAccessor.SetupGet(o => o.HttpContext).Returns(noHttpContext ? null : Mock.Of<HttpContext>());
        thread.CurrentPrincipal = testUser;

        var result = target.User; // Act

        result.Should().BeSameAs(testUser);
    }

    [Theory, BooleanData]
    public void Set_ShouldSetToHttpContextAndThread(bool noHttpContext)
    {
        var contextMock = new Mock<HttpContext>();

        httpContextAccessor.SetupGet(o => o.HttpContext).Returns(noHttpContext ? null : contextMock.Object);
        target.User = testUser; // Act

        thread.CurrentPrincipal.Should().BeSameAs(testUser);
        contextMock.VerifySet(o => o.User = testUser, () => noHttpContext ? Times.Never() : Times.Once());
    }

    [Fact]
    public void Set_ShouldThrow_IfNullArgument()
        => new Action(() => target.User = null)
            .Should().Throw<ArgumentNullException>();
}
