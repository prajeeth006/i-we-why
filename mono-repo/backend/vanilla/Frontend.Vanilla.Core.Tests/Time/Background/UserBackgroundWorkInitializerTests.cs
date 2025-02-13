using System.Linq;
using System.Security.Claims;
using System.Threading;
using FluentAssertions;
using Frontend.Vanilla.Core.Time.Background;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Time.Background;

public class UserBackgroundWorkInitializerTests
{
    private IBackgroundWorkInitializer target;

    public UserBackgroundWorkInitializerTests()
        => target = new UserBackgroundWorkInitializer();

    [Fact]
    public void ShouldSetBackgroundUser()
    {
        var initialUser = new ClaimsPrincipal(new ClaimsIdentity());
        Thread.CurrentPrincipal = initialUser;

        // Act 1
        var func = target.CaptureParentContext();

        Thread.CurrentPrincipal.Should().BeSameAs(initialUser);

        // Act 2
        func();

        var user = (ClaimsPrincipal)Thread.CurrentPrincipal;
        user.Claims.Select(c => c.Type).Should().BeEquivalentTo(ClaimsIdentity.DefaultNameClaimType);
        user.Identity.IsAuthenticated.Should().BeFalse();
        user.Identity.Name.Should().Be("Background Worker");
    }
}
