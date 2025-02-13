using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.EntryWeb.Prerender;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.EntryWeb.Prerender;

public class PrerenderHealthCheckTests
{
    private const string UserAgent = "GoogleBot";
    private const string HostName = "bwin.com";
    private const string XForwardedFor = "10.10.1.1";
    private const string XCorrelationId = "x-c-id";

    [Theory]
    [InlineData(null, HealthCheckSeverity.Default)]
    [InlineData(HealthCheckSeverity.Default, HealthCheckSeverity.Default)]
    // [InlineData(HealthCheckSeverity.Critical, HealthCheckSeverity.Critical)]
    public void HealthCheckSeverityTests(
        HealthCheckSeverity? healthCheckSeverity,
        HealthCheckSeverity expectedHealthCheckSeverity)
    {
        var config = new Mock<IPrerenderConfiguration>();
        config.Setup(s => s.HealthCheckSeverity).Returns(healthCheckSeverity);
        var target = GetTarget(null, config.Object);
        target.Metadata.Severity.Should().Be(expectedHealthCheckSeverity);
    }

    [Theory]
    [MemberData(nameof(GetHealthCheckExecutionTestCases))]
    public async Task HealthCheckExecutionTests(
#pragma warning disable xUnit1026 // Theory methods should use all of their parameters
#pragma warning disable SA1114 // Parameter list should follow declaration
        string description,
#pragma warning restore SA1114 // Parameter list should follow declaration
#pragma warning restore xUnit1026 // Theory methods should use all of their parameters
        bool enabled,
        Exception exceptionThrown)
    {
        var uri = new HttpUri($"http://{HostName}");
        var cancellationToken = CancellationToken.None;
        var service = new Mock<IPrerenderService>();
        var request = new RestRequest(new HttpUri($"http://prerender.io/{HostName}"));

        var callConfiguration = service.Setup(s => s.GetPrerenderedPageAsync(
            uri,
            UserAgent,
            XForwardedFor,
            XCorrelationId,
            cancellationToken));

        if (exceptionThrown != null)
            callConfiguration.ThrowsAsync(exceptionThrown);
        else
            callConfiguration.ReturnsAsync(
                new RestResponse(request)
                {
                    StatusCode = HttpStatusCode.Accepted,
                    Content = "<prerendered-html />".EncodeToBytes(),
                });

        var result = await GetTarget(service.Object, enabled).ExecuteAsync(cancellationToken);

        service.Verify(s => s.GetPrerenderedPageAsync(uri, UserAgent, XForwardedFor, It.IsAny<string>(), cancellationToken), enabled ? Times.Once() : Times.Never());

        if (enabled)
        {
            if (exceptionThrown != null)
            {
                result.Error.Should().BeSameAs(exceptionThrown);
                result.Details.Should().BeEquivalentTo(new { CorrelationId = XCorrelationId });

                return;
            }

            result.Error.Should().BeNull();

            dynamic details = result.Details;
            ((object)details.RequestUrl).Should().Be(new Uri($"http://prerender.io/{HostName}"));
            ((object)details.RequestHeaders).Should().BeSameAs(request.Headers);
            ((object)details.Response).Should().Be("202 Accepted");
            ((object)details.ResponseContent).Should().Be("<prerendered-html />");

            return;
        }

        result.Should().BeSameAs(HealthCheckResult.DisabledFeature);
        service.VerifyNoOtherCalls();
    }

    public static IEnumerable<object[]> GetHealthCheckExecutionTestCases()
    {
        object[] GetTestCase(
            string description,
            bool isEnabled,
            Exception exceptionThrow = null)
        {
            return new object[] { description, isEnabled, exceptionThrow };
        }

        yield return GetTestCase(
            description: "disabled",
            isEnabled: false);

        yield return GetTestCase(
            description: "enabled, network error",
            isEnabled: true,
            exceptionThrow: new Exception("Network error"));

        yield return GetTestCase(
            description: "enabled, success, healthCheckTimeout is not set",
            isEnabled: true);

        yield return GetTestCase(
            description: "enabled, success, healthCheckTimeout is set",
            isEnabled: true);
    }

    private static IHttpContextAccessor CreateHttpContextAccessor()
    {
        var httpContextAccessor = new Mock<IHttpContextAccessor>();
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Scheme).Returns("http");
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Host).Returns(new HostString(HostName));
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Path).Returns("/en/page");
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.QueryString).Returns(new QueryString("?q=1"));
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Headers[HttpHeaders.XForwardedFor]).Returns(XForwardedFor);
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Headers[HttpHeaders.XCorrelationId]).Returns(XCorrelationId);

        return httpContextAccessor.Object;
    }

    private static IPrerenderConfiguration CreateConfig(bool enabled)
    {
        var mockConfig = new Mock<IPrerenderConfiguration>();
        mockConfig.SetupGet(c => c.Enabled).Returns(enabled);

        return mockConfig.Object;
    }

    private static IHealthCheck GetTarget(IPrerenderService service, bool enabled)
    {
        return GetTarget(service, CreateConfig(enabled));
    }

    private static IHealthCheck GetTarget(
        IPrerenderService service,
        IPrerenderConfiguration config)
    {
        config ??= CreateConfig(true);
        service ??= new Mock<IPrerenderService>().Object;
        var target = new PrerenderHealthCheck(service, () => config, CreateHttpContextAccessor());

        return target;
    }
}
