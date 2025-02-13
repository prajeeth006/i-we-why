using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.Features.AntiForgery;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.AntiForgery;

public class AntiForgeryTokenTests
{
    private IAntiForgeryToken target;
    private ClaimsPrincipal user;

    public AntiForgeryTokenTests()
    {
        user = new ClaimsPrincipal(new ClaimsIdentity());
        target = new AntiForgeryToken(Mock.Of<ICurrentUserAccessor>(a => a.User == user));
    }

    [Fact]
    public void ShouldGetSessionToken()
    {
        user.SetOrRemoveClaim(PosApiClaimTypes.SessionToken, "sss");
        target.GetValue().Should().Be("sss");
    }

    [Fact]
    public void ShouldGetNull_IfAnonymous()
        => target.GetValue().Should().BeNull(); // Act
}
