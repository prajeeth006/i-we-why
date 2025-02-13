using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Xml.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.Utils;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Net;

public class ClientIpResolutionAlgorithmTestsWithTracing() : ClientIpResolutionAlgorithmTests(true) { }

public class ClientIpResolutionAlgorithmTestsWithoutTracing() : ClientIpResolutionAlgorithmTests(false) { }

public abstract class ClientIpResolutionAlgorithmTests(bool useTrace)
{
    private static readonly IClientIpResolutionAlgorithm Target = new ClientIpResolutionAlgorithm();

    private void RunTest(string expectedIp, string[] expectedTrace, string requestPhysicalIp = "10.66.12.13", string xForwardedForHeader = null)
    {
        var trace = useTrace ? new List<string>() : null;
        var companyInternalSubnets = new[] { new IpSubnet("10.66.0.0/16"), new IpSubnet("6.6.6.0/24") };
        var expectedParamTrace = $"Resolving client IP address based on request physical IP address '{requestPhysicalIp}',"
                                 + $" header '{HttpHeaders.XForwardedFor}' with value {xForwardedForHeader.Dump()}, configured company internal subnets: '10.66.0.0/16', '6.6.6.0/24'.";
        expectedTrace = new[] { expectedParamTrace }.Append(expectedTrace).ToArray();

        // Act
        var result = Target.Resolve(IPAddress.Parse(requestPhysicalIp), xForwardedForHeader, companyInternalSubnets, trace);

        result.Should().Be(IPAddress.Parse(expectedIp));
        trace?.Should().Equal(expectedTrace);
    }

    [Fact]
    public void ShouldReturnRequestIP_IfNoHeader()
        => RunTest(
            requestPhysicalIp: "1.1.1.1",
            expectedIp: "1.1.1.1",
            expectedTrace: new[] { "Returning request physical IP because the header is null or white-space." });

    [Theory]
    [InlineData("127.0.0.1")]
    [InlineData("::1")]
    public void ShouldEvaluateHeader_IfLocalhost_EvenIfNotConfiguredAsInternalSubnet(string requestPhysicalIP)
        => RunTest(
            requestPhysicalIp: requestPhysicalIP,
            xForwardedForHeader: "2.2.2.2",
            expectedIp: "2.2.2.2",
            expectedTrace: new[]
            {
                "Examining IP addresses from the header in this order: '2.2.2.2'.",
                "Returning IP address '2.2.2.2' which is first one outside company internal subnets.",
            });

    [Fact]
    public void ShouldReturnFirstOutsideInternalSubnetsFromHeader()
        => RunTest(
            xForwardedForHeader: "2.2.2.2, 3.3.3.3, 10.66.5.4, 6.6.6.12",
            expectedIp: "3.3.3.3",
            expectedTrace: new[]
            {
                "Examining IP addresses from the header in this order: '6.6.6.12', '10.66.5.4', '3.3.3.3', '2.2.2.2'.",
                "Skipping IP '6.6.6.12' because it's within company internal subnet '6.6.6.0/24'.",
                "Skipping IP '10.66.5.4' because it's within company internal subnet '10.66.0.0/16'.",
                "Returning IP address '3.3.3.3' which is first one outside company internal subnets.",
            });

    [Fact]
    public void ShouldReturnRequestIP_IfInvalidHeaderFromBeginning()
        => RunTest(
            xForwardedForHeader: "2.2.2.2, shit",
            expectedIp: "10.66.12.13",
            expectedTrace: new[]
            {
                "Examining IP addresses from the header in this order: 'shit', '2.2.2.2'.",
                "Value 'shit' isn't a valid IP address.",
                "Returning request physical IP because there wasn't any previous one.",
            });

    [Fact]
    public void ShouldReturnRequestIP_IfInvalidHeaderInMiddle()
        => RunTest(
            xForwardedForHeader: "2.2.2.2, shit, 6.6.6.12",
            expectedIp: "6.6.6.12",
            expectedTrace: new[]
            {
                "Examining IP addresses from the header in this order: '6.6.6.12', 'shit', '2.2.2.2'.",
                "Skipping IP '6.6.6.12' because it's within company internal subnet '6.6.6.0/24'.",
                "Value 'shit' isn't a valid IP address.",
                "Returning previous IP '6.6.6.12' from the header even despite it's within company network but it's the only IP present.",
            });

    [Fact]
    public void ShouldReturnLastInternalIP_IfOnlyInternalIPInHeader()
        => RunTest(
            xForwardedForHeader: "6.6.6.12",
            expectedIp: "6.6.6.12",
            expectedTrace: new[]
            {
                "Examining IP addresses from the header in this order: '6.6.6.12'.",
                "Skipping IP '6.6.6.12' because it's within company internal subnet '6.6.6.0/24'.",
                "Returning previous IP '6.6.6.12' from the header even despite it's within company network but it's the only IP present.",
            });

    [Fact]
    public void ShouldReturnLastInternalIP_IfOnlyInternalIPAndGarbageInHeader()
        => RunTest(
            xForwardedForHeader: "bla, 10.66.12.20",
            expectedIp: "10.66.12.20",
            expectedTrace: new[]
            {
                "Examining IP addresses from the header in this order: '10.66.12.20', 'bla'.",
                "Skipping IP '10.66.12.20' because it's within company internal subnet '10.66.0.0/16'.",
                "Value 'bla' isn't a valid IP address.",
                "Returning previous IP '10.66.12.20' from the header even despite it's within company network but it's the only IP present.",
            });

    [Fact]
    public void DocumentationHtml_ShouldBeValidXml()
        => XElement.Parse("<root>" + ClientIpResolutionAlgorithm.DocumentationHtml + "</root>");
}
