using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.WebIntegration.Core.ClientIP;
using Frontend.Vanilla.Features.WebIntegration.Core.DynaconAppBoot;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Core.ClientIP;

public class WebClientIPResolverTests
{
    private WebClientIpResolver target;
    private Mock<IHttpContextAccessor> httpContextAccessor;
    private Mock<IClientIpResolutionAlgorithm> clientIPResolutionAlgorithm;
    private Mock<IIsInternalRequestAlgorithm> isInternalRequestAlgorithm;
    private Mock<IDynaconAppBootRestClientService> dynaconAppBootRestClientService;
    private readonly IReadOnlyList<IpSubnet> subnets;

    public WebClientIPResolverTests()
    {
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        clientIPResolutionAlgorithm = new Mock<IClientIpResolutionAlgorithm>();
        isInternalRequestAlgorithm = new Mock<IIsInternalRequestAlgorithm>();
        dynaconAppBootRestClientService = new Mock<IDynaconAppBootRestClientService>();
        target = new WebClientIpResolver(httpContextAccessor.Object, clientIPResolutionAlgorithm.Object, isInternalRequestAlgorithm.Object, dynaconAppBootRestClientService.Object);

        var serviceProviderMock = new Mock<IServiceProvider>();
        serviceProviderMock.Setup(_ => _.GetService(typeof(IRequestScopedValuesProvider))).Returns(new RequestScopedValuesProvider());
        httpContextAccessor.Setup(c => c.HttpContext.RequestServices).Returns(serviceProviderMock.Object);
        httpContextAccessor.SetupGet(a => a.HttpContext.Connection.RemoteIpAddress).Returns(IPAddress.Parse("1.1.1.1"));
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Headers).Returns(new HeaderDictionary { [HttpHeaders.XForwardedFor] = "ForwardedIPs" });
        clientIPResolutionAlgorithm.SetupWithAnyArgs(a => a.Resolve(null, null, null, null)).Returns(IPAddress.Parse("6.6.6.6"));

        var dynaconResponse = """
                                {
                                "ChangesetId": 294231,
                                "ValidFrom": "2024-09-06T12:46:32.8227712Z",
                                "Configuration": {
                                    "Networking.CompanyInternalNetwork": {
                                            "Subnets": {
                                            "DataType": "json",
                                            "Values": [
                                            {
                                            "Value": [
                                                    "127.0.0.0/8",
                                                    "10.0.0.0/8",
                                                    "103.21.244.0/22",
                                                    "103.22.200.0/22",
                                                    "103.31.4.0/22",
                                                    "104.16.0.0/13",
                                                    "104.24.0.0/14",
                                                    "108.162.192.0/18",
                                                    "131.0.72.0/22",
                                                    "141.101.64.0/18",
                                                    "162.158.0.0/15",
                                                    "172.64.0.0/13",
                                                    "173.245.48.0/20",
                                                    "188.114.96.0/20",
                                                    "190.93.240.0/20",
                                                    "197.234.240.0/22",
                                                    "198.41.128.0/17",
                                                    "95.101.136.0/24",
                                                    "23.192.162.0/23",
                                                    "96.7.51.0/24",
                                                    "23.55.58.0/23",
                                                    "23.212.108.0/23",
                                                    "2.16.48.0/24",
                                                    "104.103.71.0/24",
                                                    "104.117.183.0/24",
                                                    "104.103.232.0/24",
                                                    "92.123.64.0/22",
                                                    "95.101.137.0/24",
                                                    "23.205.170.0/24",
                                                    "92.122.155.0/24",
                                                    "81.16.153.192/27",
                                                    "195.72.132.0/24",
                                                    "195.72.134.254/31",
                                                    "195.72.135.254/31",
                                                    "193.126.246.130/31",
                                                    "88.157.153.74/31",
                                                    "2.16.0.0/13",
                                                    "23.0.0.0/12",
                                                    "23.32.0.0/11",
                                                    "23.48.168.0/22",
                                                    "23.50.48.0/20",
                                                    "23.64.0.0/14",
                                                    "23.72.0.0/13",
                                                    "23.192.0.0/11",
                                                    "66.198.8.128/27",
                                                    "67.220.142.16/29",
                                                    "69.192.0.0/16",
                                                    "72.246.0.0/15",
                                                    "88.221.0.0/16",
                                                    "92.122.0.0/15",
                                                    "95.100.0.0/15",
                                                    "96.6.0.0/15",
                                                    "96.16.0.0/15",
                                                    "104.64.0.0/10",
                                                    "118.214.0.0/16",
                                                    "173.222.0.0/15",
                                                    "184.24.0.0/13",
                                                    "184.50.0.0/15",
                                                    "184.84.0.0/14"
                                            ],
                                            "Context": {},
                                            "Priority": 0
                                            }
                                            ],
                                            "CriticalityLevel": 1
                                            }
                                            }
                    }
                }
                """;

        subnets = JsonConvert.DeserializeObject<DynaconAppBootConfigurationResponse>(dynaconResponse)!.Configuration.CompanyInternalNetwork.Subnets.Values.First().Convert();
        dynaconAppBootRestClientService.Setup(x => x.GetSubnets()).Returns(subnets);
    }

    [Fact]
    public void Resolve_ShouldResolveClientIP()
    {
        var result = target.Resolve(); // Act

        result.Should().Be(IPAddress.Parse("6.6.6.6"));
        VerifyIPResolution();
    }

    [Theory, BooleanData]
    public void IsInternal_ShouldDetermineIfRequestIsInternal(bool isInternal)
    {
        isInternalRequestAlgorithm.SetupWithAnyArgs(a => a.Resolve(null, null, null)).Returns(isInternal);

        var result = target.IsInternal(); // Act

        result.Should().Be(isInternal);
        VerifyIPResolution();
        VerifyIsInternalResolution();
    }

    private void VerifyIPResolution(ICollection<string> trace = null, int cached = 1)
    {
        clientIPResolutionAlgorithm.Verify(a => a.Resolve(IPAddress.Parse("1.1.1.1"), "ForwardedIPs", subnets, trace));
    }

    private void VerifyIsInternalResolution(ICollection<string> trace = null)
        => isInternalRequestAlgorithm.Verify(a => a.Resolve(httpContextAccessor.Object.HttpContext, IPAddress.Parse("6.6.6.6"), trace));

    [Fact]
    public void Metadata_ShouldBeSingleton()
        => target.Metadata.Should().BeSameAs(target.Metadata);

    [Theory, BooleanData]
    public void GetDiagnosticInfo_ShouldCollectTrace(bool isInternal)
    {
        isInternalRequestAlgorithm.SetupWithAnyArgs(a => a.Resolve(null, null, null)).Returns(isInternal);

        var result = (List<string>)target.GetDiagnosticInfo(); // Act

        result.Should().Equal($"ClientIP = '6.6.6.6', IsInternalRequest = {isInternal}.");
        VerifyIPResolution(result, cached: 0);
        VerifyIsInternalResolution(result);
    }
}
