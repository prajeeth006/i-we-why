using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Security;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Security;

public class PosApiAuthTokensTests
{
    [Fact]
    public void Constructor_ShouldCreateCorrectly()
    {
        var target = new PosApiAuthTokens("user-token", "session-token");
        target.UserToken.Should().Be("user-token");
        target.SessionToken.Should().Be("session-token");
    }

    private static readonly IEnumerable<string> InvalidValues = new[] { null, "", "  " };
    public const string ValidValue = "token";

    public static readonly IEnumerable<object[]> ConstructorInvalidTestCases =
        from ut in EnumerableExtensions.Append(InvalidValues, ValidValue)
        from st in EnumerableExtensions.Append(InvalidValues, ValidValue)
        where ut != ValidValue && st != ValidValue
        select new object[] { ut, st };

    [Theory, MemberData(nameof(ConstructorInvalidTestCases))]
    public void Constructor_ShouldThrow_IfAtLeastOneTokenMissing(string userToken, string sessionToken)
        => RunFailedCtorTest(userToken, sessionToken, () => new PosApiAuthTokens(userToken, sessionToken));

    [Fact]
    public void ToString_ShouldIncludeTokens()
    {
        var target = new PosApiAuthTokens("user-token", "session-token");
        target.ToString().Should().Be("UserToken='user-token', SessionToken='session-token'");
    }

    [Fact]
    public void ToDebugString_ShouldReturnToString()
    {
        var target = new PosApiAuthTokens("user-token", "session-token");
        target.ToDebugString().Should().Be(target.ToString());
    }

    [Fact]
    public void ToDebugString_ShouldHandleNull()
        => ((PosApiAuthTokens)null).ToDebugString().Should().Be("Anonymous");

    [Fact]
    public void TryCreate_ShouldReturnTokens_IfAuthenticated()
    {
        var target = PosApiAuthTokens.TryCreate("user-token", "session-token");
        target.Should().Be(new PosApiAuthTokens("user-token", "session-token"));
    }

    [Fact]
    public void TryCreate_ShouldReturnNull_IfAnonymous()
        => PosApiAuthTokens.TryCreate(null, null).Should().BeNull();

    public static readonly IEnumerable<object[]> TryCreateInvalidTestCases = ConstructorInvalidTestCases
        .Where(tc => tc.All(t => t != null));

    [Theory, MemberData(nameof(TryCreateInvalidTestCases))]
    public void TryCreate_ShouldThrow_IfOneTokenIsInvalid(string userToken, string sessionToken)
        => RunFailedCtorTest(userToken, sessionToken, () => PosApiAuthTokens.TryCreate(userToken, sessionToken));

    private static void RunFailedCtorTest(string userToken, string sessionToken, Action act)
        => act.Should().Throw<ArgumentException>().WithMessage(
            $"Both tokens must be trimmed non-null strings but UserToken={userToken.Dump()} and SessionToken={sessionToken.Dump()} were provided.");
}
