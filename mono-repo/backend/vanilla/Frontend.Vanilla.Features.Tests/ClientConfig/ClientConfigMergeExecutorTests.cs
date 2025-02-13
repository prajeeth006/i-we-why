using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.Json;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ClientConfig;

public class ClientConfigMergeExecutorTests
{
    private ClientConfigMergeExecutor target;
    private Mock<IClientConfigProvider> provider1;
    private Mock<IClientConfigProvider> provider2;
    private Mock<IDynaConParameterExtractor> dynaconParameterExtractor;
    private ClientConfigConfiguration mergerConfig;
    private TestLogger<ClientConfigMergeExecutor> log;
    private CancellationToken ct;
    private Mock<IHttpContextAccessor> mockHttpContextAccessor;

    public ClientConfigMergeExecutorTests()
    {
        mergerConfig = new ClientConfigConfiguration(TimeSpan.FromSeconds(10));
        dynaconParameterExtractor = new Mock<IDynaConParameterExtractor>();
        var jsonSerializerFactory = Mock.Of<IJsonSerializerFactory>(f => f.CreateSerializer() == JsonSerializer.Create(new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(), // Just something significant that can be verified
        }));
        log = new TestLogger<ClientConfigMergeExecutor>();
        mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
        var context = new DefaultHttpContext();
        var fakeTenantId = "abcd";
        context.Request.Headers["Tenant-ID"] = fakeTenantId;
        mockHttpContextAccessor.Setup(_ => _.HttpContext).Returns(context);
        target = new ClientConfigMergeExecutor(mergerConfig, jsonSerializerFactory, log, mockHttpContextAccessor.Object, dynaconParameterExtractor.Object);

        ct = TestCancellationToken.Get();
        provider1 = new Mock<IClientConfigProvider>();
        provider2 = new Mock<IClientConfigProvider>();

        provider1.SetupGet(p => p.Name).Returns(new Identifier("config1"));
        provider1.Setup(p => p.GetClientConfigAsync(ct)).ReturnsAsync(new { Id = "instance1" });
        provider2.SetupGet(p => p.Name).Returns(new Identifier("config2"));
        provider2.Setup(p => p.GetClientConfigAsync(ct)).ReturnsAsync(new { Id = "instance2" });
        dynaconParameterExtractor.SetupGet(d => d.Product).Returns("sports");
    }

    private Task<IReadOnlyDictionary<string, object>> RunTest()
        => target.ExecuteAsync(new[] { provider1.Object, provider2.Object }, ct);

    [Fact]
    public async Task ShouldGetConfigurationFromAllProviders()
    {
        var config = await RunTest(); // Act

        config.Should().ContainKeys("config1", "config2")
            .And.Contain("config1", new JRaw(@"{""id"":""instance1""}"))
            .And.Contain("config2", new JRaw(@"{""id"":""instance2""}"));
    }

    [Fact]
    public async Task ShouldReturnFatalResult_IfProviderReturnsNull()
    {
        provider1.Setup(p => p.GetClientConfigAsync(ct)).Returns(Task.FromResult<object>(null));

        var config = await RunTest();

        var logged = log.Logged.Single();
        logged.Level.Should().Be(LogLevel.Critical);

        config.Should().ContainKeys("config1", "config2")
            .And.Contain("config1", new JRaw(@"{""isEnabled"":false,""isFailed"":true}"))
            .And.Contain("config1", new JRaw(@"{""isEnabled"":false,""isFailed"":true}"));
    }

    [Fact]
    public async Task ShouldReportProviderExecutionDurations()
    {
        provider1.Setup(p => p.GetClientConfigAsync(ct)).ReturnsAsync(() =>
        {
            Thread.Sleep(1);

            return new { Id = "instance1" };
        });
        provider2.Setup(p => p.GetClientConfigAsync(ct)).ReturnsAsync(() =>
        {
            Thread.Sleep(2);

            return new { Id = "instance2" };
        });

        var config = await RunTest(); // Act

        var duration = mockHttpContextAccessor.Object.HttpContext!.Response.Headers[HttpHeaders.ServerTiming];
        duration.Should().NotBeNull();
        duration[0].Should().Contain("total_configs_sports");
        log.VerifyNothingLogged();
    }

    [Fact]
    public void ShouldExecuteProvidersInParallel()
    {
        var tcs1 = new TaskCompletionSource<object>();
        var tcs2 = new TaskCompletionSource<object>();
        var runningCount = 0;
        provider1.Setup(p => p.GetClientConfigAsync(ct)).Returns(() =>
        {
            runningCount++;

            return tcs1.Task;
        });
        provider2.Setup(p => p.GetClientConfigAsync(ct)).Returns(() =>
        {
            runningCount++;

            return tcs2.Task;
        });

        RunTest(); // Act

        runningCount.Should().Be(2);
    }

    [Fact]
    public async Task ShouldWarnAboutProvidersWhichTakeTooLong()
    {
        mergerConfig.ProviderLongExecutionWarningTime = TimeSpan.FromMilliseconds(100);
        provider1.Setup(p => p.GetClientConfigAsync(ct)).ReturnsAsync(() =>
        {
            Thread.Sleep(101);

            return new object();
        });

        await RunTest(); // Act

        var logged = log.Logged.Single();
        logged.Level.Should().Be(LogLevel.Warning);
        logged.Data["provider"].Should().Be(provider1.Object.ToString());
        logged.Data["name"].Should().Be(provider1.Object.Name);
        logged.Data["elapsedMs"].Should().BeOfType<double>().Which.Should().BeGreaterThan(11);
        logged.Data["threshold"].Should().Be(mergerConfig.ProviderLongExecutionWarningTime);
    }

    [Fact]
    public async Task ShouldReturnFatalResultAndLogCritical_OnException()
    {
        // Setup
        provider1.Setup(p => p.GetClientConfigAsync(ct)).Throws(new Exception("Failed"));

        // Act
        var config = await RunTest();

        // Assert
        var logged = log.Logged.Single();
        logged.Level.Should().Be(LogLevel.Critical);
        logged.Data["provider"].Should().Be(provider1.Object.ToString());
        logged.Data["name"].Should().Be(provider1.Object.Name);

        config.Should().ContainKeys("config1", "config2")
            .And.Contain("config1", new JRaw(@"{""isEnabled"":false,""isFailed"":true}"))
            .And.Contain("config1", new JRaw(@"{""isEnabled"":false,""isFailed"":true}"));
    }
}
