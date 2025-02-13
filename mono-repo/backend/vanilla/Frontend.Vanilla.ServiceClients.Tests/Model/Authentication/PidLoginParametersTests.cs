using System;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Model.Authentication;

public class PidLoginParametersTests : CommonParametersTests
{
    private PidLoginParameters target;

    public PidLoginParametersTests()
        => target = new PidLoginParameters("123asdf");

    [Fact]
    public void ShouldSetupCommon()
    {
        ShouldHaveCorrectCommonProperties(target);
    }

    [Fact]
    public void Constructor_ShouldInitializeCorrectly()
    {
        target.Pid.Should().Be("123asdf");
        target.Username.Should().BeNull();
        target.Password.Should().BeNull();
    }

    [Fact]
    public void Pid_ShouldThrow_IfNull()
        => target.Invoking(t => t.Pid = null).Should().Throw<ArgumentException>();

    [Fact]
    public void ShouldSerializeCorrectly()
    {
        target.Username = "Chuck Norris";
        target.Password = "Hail To The King, Baby";

        RunSerializationTest(target, $@"{{
                pid: '123asdf',
                username: 'Chuck Norris',
                password: 'Hail To The King, Baby',
                {CommonJsonProperties},
                vanillaIdToken: null,
            }}");
    }
}
