using System;
using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Claims;

public class ClaimsParserTests
{
    private ClaimsPrincipal user;
    private string claimType;
    private Mock<Func<string, int>> parseValue;

    public ClaimsParserTests()
    {
        user = new ClaimsPrincipal(new ClaimsIdentity());
        claimType = Guid.NewGuid().ToString();
        parseValue = new Mock<Func<string, int>>();
    }

    [Fact]
    public void ShouldParseValue()
    {
        user.SetOrRemoveClaim(claimType, "arg");
        parseValue.Setup(p => p("arg")).Returns(666);

        var result = ClaimsParser.Parse(user, claimType, parseValue.Object); // Act

        result.Should().Be(666);
    }

    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public void ShouldReturnDefault_IfAnonymousOrNoClaimFlag(bool defaultForAnonymous, bool defaultIfNoClaim)
    {
        var result = ClaimsParser.Parse(user, claimType, parseValue.Object, defaultForAnonymous, defaultIfNoClaim); // Act
        result.Should().Be(0);
    }

    [Fact]
    public void ShouldThrow_IfNoClaim()
        => RunExceptionTest(null, "null", "The claim doesn't exist.");

    [Theory, ValuesData("", "  ")]
    public void ShouldThrow_IfNoClaimOrWhiteSpaceValue(string claimValue)
        => RunExceptionTest(claimValue, $"'{claimValue}'", "The claim value can't be null nor white-space.");

    [Fact]
    public void ShouldThrow_IfGivenParseFuncFailed()
    {
        parseValue.SetupWithAnyArgs(p => p(null)).Throws(new Exception("Parse func error"));
        RunExceptionTest("arg", "'arg'", "Parse func error");
    }

    private void RunExceptionTest(string claimValue, string reportedClaim, string expectedError)
    {
        user.SetOrRemoveClaim(claimType, claimValue);

        Action act = () => ClaimsParser.Parse(user, claimType, parseValue.Object); // Act

        act.Should().Throw<InvalidClaimException>()
            .WithMessage($"Failed parsing claim {claimType} which is {reportedClaim} for anonymous user.")
            .WithInnerMessage(expectedError);
    }
}
