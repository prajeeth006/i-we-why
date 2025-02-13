using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Security;

public class UserIdentityKeyTests
{
    [Fact]
    public void GetUserName_ShouldConcatenateTokens()
    {
        var authTokens = new PosApiAuthTokens("uu", "ss");

        // Act
        UserIdentityKey.GetUserName(authTokens).Should().Be("uu:ss");
    }

    [Fact]
    public void ExtractTokens_ShouldSplitUserName()
    {
        // Act
        var authTokens = UserIdentityKey.ExtractPosApiTokens("uu:ss");

        authTokens.Should().Be(new PosApiAuthTokens("uu", "ss"));
    }

    [Theory, ValuesData(null, "", "  ", "shit", "a:b:c")]
    public void ExtractTokens_ShouldThrow_IfInvalid(string userName)
        => new Action(() => UserIdentityKey.ExtractPosApiTokens(userName))
            .Should().Throw()
            .WithMessage($"Expected username in format 'userToken:sessionToken' to comply with Vanilla authentication but there is {userName.Dump()}.");
}
