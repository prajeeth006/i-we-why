using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Model.Authentication.Filters;

public class LoginContextTests
{
    private readonly ExecutionMode mode;
    private readonly PosApiRestRequest request;

    public LoginContextTests()
    {
        mode = TestExecutionMode.Get();
        request = new PosApiRestRequest(new PathRelativeUri("path"));
    }

    [Fact]
    public void BeforeLoginContext_ShouldCreateCorrectly()
    {
        // Act
        var target = new BeforeLoginContext(mode, request);

        VerifyBeforeContext(target);
    }

    [Fact]
    public void AfterLoginContext_ShouldCreateCorrectly()
    {
        var response = new LoginResponse();

        // Act
        var target = new AfterLoginContext(mode, request, response);

        VerifyBeforeContext(target);
        target.Response.Should().BeSameAs(response);
    }

    private void VerifyBeforeContext(BeforeLoginContext target)
    {
        target.Mode.Should().Be(mode);
        target.Request.Should().BeSameAs(request);
    }
}
