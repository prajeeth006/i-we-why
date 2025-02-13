using System;
using System.Collections.Generic;
using System.Net;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebIntegration.Core.ClientIP;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Core.ClientIP;

public class MockedClientIpResolutionAlgorithmTestsWithTracing() : MockedClientIpResolutionAlgorithmTests(true) { }

public class MockedClientIpResolutionAlgorithmTestsWithoutTracing() : MockedClientIpResolutionAlgorithmTests(false) { }

public abstract class MockedClientIpResolutionAlgorithmTests
{
    private readonly IClientIpResolutionAlgorithm target;
    private readonly Mock<IEnvironmentProvider> envProvider;
    private readonly Mock<ICookieHandler> cookieHandler;

    private readonly List<string> trace;
    private readonly IPAddress requestPhysicalIp;
    private readonly IReadOnlyCollection<IpSubnet> companyInternalSubnets;
    private readonly IPAddress innerIp;

    protected MockedClientIpResolutionAlgorithmTests(bool useTrace)
    {
        var inner = new Mock<IClientIpResolutionAlgorithm>();
        envProvider = new Mock<IEnvironmentProvider>();
        cookieHandler = new Mock<ICookieHandler>();
        target = new MockedClientIpResolutionAlgorithm(inner.Object, envProvider.Object, cookieHandler.Object);

        trace = useTrace ? new List<string>() : null;
        requestPhysicalIp = IPAddress.Parse("1.1.1.1");
        companyInternalSubnets = new[] { new IpSubnet("10.1.0.0/16") };
        innerIp = IPAddress.Parse("6.6.6.6");

        inner.Setup(i => i.Resolve(requestPhysicalIp, "Header", companyInternalSubnets, trace)).Returns(innerIp);
        cookieHandler.Setup(a => a.GetValue(It.IsAny<string>())).Returns((string)null);
    }

    private IPAddress Target_Resolve() => target.Resolve(requestPhysicalIp, "Header", companyInternalSubnets, trace);

    private void RunTest(IPAddress expectedIp, string expectedTrace)
    {
        var result = Target_Resolve(); // Act

        result.Should().Be(expectedIp);
        trace?.Should().Equal(expectedTrace);
    }

    [Fact]
    public void ShouldReturnMockedIP_IfValidCookie()
    {
        cookieHandler.Setup(a => a.GetValue(ClientIpResolutionAlgorithm.MockedIpCookie)).Returns("2.2.2.2");
        RunTest(
            expectedIp: IPAddress.Parse("2.2.2.2"),
            expectedTrace: $"Returning mocked IP '2.2.2.2' resolved from cookie '{ClientIpResolutionAlgorithm.MockedIpCookie}' hence skipping regular algorithm.");
    }

    [Theory, ValuesData("", "gibberish")]
    public void ShouldThrow_IfInvalidCookie(string cookieValue)
    {
        cookieHandler.Setup(a => a.GetValue(ClientIpResolutionAlgorithm.MockedIpCookie)).Returns(cookieValue);

        new Func<object>(Target_Resolve).Should().Throw() // Act
            .WithMessage(
                $"Failed client IP resolution because cookie '{ClientIpResolutionAlgorithm.MockedIpCookie}' contains value '{cookieValue}' which isn't a valid IP address.");
    }

    [Fact]
    public void ShouldReturnInnerIP_IfProduction()
    {
        envProvider.SetupGet(e => e.IsProduction).Returns(true);
        envProvider.SetupGet(e => e.Environment).Returns("qa66");

        RunTest(
            expectedIp: innerIp,
            expectedTrace: $"Cookie '{ClientIpResolutionAlgorithm.MockedIpCookie}' isn't considered because the environment is production.");
    }

    [Fact]
    public void ShouldReturnInnerIP_IfNoCookie()
        => RunTest(
            expectedIp: innerIp,
            expectedTrace: $"Cookie '{ClientIpResolutionAlgorithm.MockedIpCookie}' doesn't exist hence regular resolution is executed.");
}
