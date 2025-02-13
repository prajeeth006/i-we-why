using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Authentication;

public class AnonymousClaimsMiddlewareTests
{
    private readonly AnonymousClaimsMiddleware target;
    private readonly Mock<RequestDelegate> next;
    private readonly Mock<IPosApiAuthenticationServiceInternal> posApiAuthenticationService;

    private readonly Mock<HttpContext> httpContext;

    public AnonymousClaimsMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        posApiAuthenticationService = new Mock<IPosApiAuthenticationServiceInternal>();
        target = new AnonymousClaimsMiddleware(next.Object, posApiAuthenticationService.Object);

        httpContext = new Mock<HttpContext>();
        httpContext.SetupProperty(c => c.User, new ClaimsPrincipal());
        httpContext.SetupGet(c => c.RequestAborted).Returns(TestCancellationToken.Get());
    }

    [Fact]
    public async Task ShouldSetupAnonymousUserWithClaims()
    {
        var executed = new List<string>();
        var testUser = new ClaimsPrincipal();

        posApiAuthenticationService.Setup(s => s.SetupAnonymousUserAsync(httpContext.Object.RequestAborted))
            .Callback(() => executed.Add("SetupClaims"))
            .ReturnsAsync(testUser);
        next.Setup(n => n(httpContext.Object))
            .Callback(() => executed.Add("Next"))
            .Returns(Task.CompletedTask);

        // Act
        await target.InvokeAsync(httpContext.Object);

        executed.Should().Equal("SetupClaims", "Next");
        httpContext.Object.User.Should().BeSameAs(testUser);
    }

    [Theory]
    [InlineData(AuthState.Workflow)]
    [InlineData(AuthState.Authenticated)]
    internal void ShouldDoNothing_IfUserIsAuthenticatedWithPosApi(AuthState authState)
    {
        var initialUser = TestUser.Get(authState);
        var nextTask = Task.FromResult(66);
        httpContext.SetupProperty(c => c.User, initialUser);
        next.Setup(n => n(httpContext.Object)).Returns(nextTask);

        // Act
        var task = target.InvokeAsync(httpContext.Object);

        task.Should().BeSameAs(nextTask);
        httpContext.Object.User.Should().BeSameAs(initialUser);
    }
}
