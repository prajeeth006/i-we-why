#nullable enable

using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Model.Authentication.Filters;

public class LoginFilterTests
{
    private readonly ILoginFilter target;
    private readonly Mock<LoginFilter> underlyingMock;

    public LoginFilterTests()
    {
        underlyingMock = new Mock<LoginFilter> { CallBase = true };
        target = underlyingMock.Object;
    }

    [Fact]
    public void BeforeLoginAsync_ShouldCallThrough()
    {
        var ctx = new BeforeLoginContext(default, null!);

        // Act
        var task = target.BeforeLoginAsync(ctx);

        task.Should().BeSameAs(Task.CompletedTask);
        underlyingMock.Verify(m => m.BeforeLogin(ctx));
    }

    [Fact]
    public void AfterLoginAsync_ShouldCallThrough()
    {
        var ctx = new AfterLoginContext(default, null!, null!);

        // Act
        var task = target.AfterLoginAsync(ctx);

        task.Should().BeSameAs(Task.CompletedTask);
        underlyingMock.Verify(m => m.AfterLogin(ctx));
    }
}
