using System;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Model.Authentication;

public class RememberMeLoginParametersTests : CommonParametersTests
{
    private RememberMeLoginParameters target;

    public RememberMeLoginParametersTests()
        => target = new RememberMeLoginParameters("abc");

    [Fact]
    public void ShouldSetupCommon()
    {
        ShouldHaveCorrectCommonProperties(target);
    }

    [Fact]
    public void Constructor_ShouldCreate()
        => target.RememberMeToken.Should().Be("abc");

    [Theory, ValuesData(null, "", "  ")]
    public void RememberMeToken_ShouldThrow_IfNullOrWhiteSpace(string value)
        => target.Invoking(t => t.RememberMeToken = value).Should().Throw<ArgumentException>();

    [Fact]
    public void ShouldBeSerializedCorrectly()
        => RunSerializationTest(target, $@"{{
                rememberMeToken: 'abc',
                {CommonJsonProperties},
                vanillaIdToken: null,
            }}");

    [Fact]
    public void ShouldBeSerializedCorrectlyWithTokenType()
    {
        target.TokenType = "legacy";
        RunSerializationTest(target, $@"{{
                rememberMeToken: 'abc',
                tokenType: 'legacy',
                {CommonJsonProperties},
                vanillaIdToken: null,
            }}");
    }
}
