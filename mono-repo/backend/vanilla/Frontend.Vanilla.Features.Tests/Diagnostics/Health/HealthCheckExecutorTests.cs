#nullable enable

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Features.Diagnostics.Health;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.Health;

public class HealthCheckExecutorTests : IDisposable
{
    private readonly IHealthCheckExecutor target;
    private readonly Mock<IHealthCheck> check1;
    private readonly Mock<IHealthCheck> check2;
    private readonly Mock<IHealthCheck> check3;
    private readonly HealthReportConfiguration healthReportConfig;
    private readonly Mock<ICurrentConfigurationResolver> configResolver;
    private readonly Mock<IGlobalizationConfiguration> globalizationConfiguration;
    private readonly Mock<ICancellationHelper> cancellationHelper;

    private readonly CancellationToken inputCt;
    private readonly CancellationToken expectedCt;
    private readonly Mock<ICancellation> cancellation;

    public HealthCheckExecutorTests()
    {
        check1 = new Mock<IHealthCheck>();
        check2 = new Mock<IHealthCheck>();
        check3 = new Mock<IHealthCheck>();
        check1.SetupGet(c => c.IsEnabled).Returns(true);
        check2.SetupGet(c => c.IsEnabled).Returns(true);
        check3.SetupGet(c => c.IsEnabled).Returns(false);
        healthReportConfig = new HealthReportConfiguration { HealthCheckTimeout = TimeSpan.FromSeconds(10) };
        configResolver = new Mock<ICurrentConfigurationResolver>();
        globalizationConfiguration = new Mock<IGlobalizationConfiguration>();
        cancellationHelper = new Mock<ICancellationHelper>();
        target = new HealthCheckExecutor(new[] { check1.Object, check2.Object, check3.Object },
            healthReportConfig,
            configResolver.Object,
            globalizationConfiguration.Object,
            cancellationHelper.Object);

        inputCt = TestCancellationToken.Get();
        expectedCt = TestCancellationToken.Get();
        cancellation = new Mock<ICancellation>();

        check1.SetupGet(c => c.Metadata)
            .Returns(new HealthCheckMetadata("Check 1", "Desc 1", "WTD 1", HealthCheckSeverity.Critical, configurationFeatureName: "Vanilla.Foo"));
        check2.SetupGet(c => c.Metadata).Returns(new HealthCheckMetadata("Check 2", "Desc 2", "WTD 2", documentationUri: new Uri("https://docs.vanilla.intranet/")));
        globalizationConfiguration.SetupGet(x => x.DefaultLanguage).Returns(TestLanguageInfo.Get("it-IT"));
        cancellationHelper.Setup(h => h.CancelAfter(healthReportConfig.HealthCheckTimeout, inputCt)).Returns(cancellation.Object);
        cancellation.SetupGet(c => c.Token).Returns(expectedCt);
    }

    public void Dispose()
        => cancellation.Verify(c => c.Dispose());

    private Task<IReadOnlyList<HealthCheckSummary>> Act()
        => target.ExecuteAsync(inputCt);

    public static IEnumerable<object?[]> TestCases => TestValues.Booleans.ToTestCases()
        .CombineWith(TestValues.Booleans);

    [Theory, MemberData(nameof(TestCases))]
    public async Task ShouldExecuteAllChecks(bool pass1, bool pass2)
    {
        var start = Stopwatch.GetTimestamp();
        var fooConfig = new object();
        check1.Setup(c => c.ExecuteAsync(expectedCt))
            .ReturnsAsync(pass1 ? HealthCheckResult.CreateSuccess("Details 1") : HealthCheckResult.CreateFailed("Error 1", "Details 1"));
        check2.Setup(c => c.ExecuteAsync(expectedCt))
            .ReturnsAsync(pass2 ? HealthCheckResult.CreateSuccess("Details 2") : HealthCheckResult.CreateFailed("Error 2", "Details 2"));
        configResolver.Setup(r => r.Resolve("Vanilla.Foo", It.IsAny<bool>())).Returns(fooConfig);

        var results = await Act();

        var elapsed = Stopwatch.GetElapsedTime(start);
        results.Should().HaveCount(2);
        results[0].Passed.Should().Be(pass1);
        results[0].Error.Should().Be(pass1 ? null : "Error 1");
        results[0].Details.Should().Be("Details 1");
        results[0].Name.Should().Be("Check 1");
        results[0].Description.Should().Be("Desc 1");
        results[0].Severity.Should().Be(HealthCheckSeverity.Critical);
        results[0].DocumentationUri.Should().BeNull();
        results[0].WhatToDoIfFailed.Should().Contain("WTD 1");
        results[0].ExecutionTime.Should().BeGreaterThan(TimeSpan.Zero).And.BeLessThan(elapsed);
        results[0].Configuration.FeatureName.Should().Be("Vanilla.Foo");
        results[0].Configuration.Instance.Should().BeSameAs(fooConfig);
        results[1].Passed.Should().Be(pass2);
        results[1].Error.Should().Be(pass2 ? null : "Error 2");
        results[1].Details.Should().Be("Details 2");
        results[1].Name.Should().Be("Check 2");
        results[1].Description.Should().Be("Desc 2");
        results[1].Severity.Should().Be(HealthCheckSeverity.Default);
        results[1].DocumentationUri.Should().Be(new Uri("https://docs.vanilla.intranet/"));
        results[1].WhatToDoIfFailed.Should().Contain("WTD 2");
        results[1].ExecutionTime.Should().BeGreaterThan(TimeSpan.Zero).And.BeLessThan(elapsed);
        results[1].Configuration.Should().BeNull();
    }

    [Fact]
    public async Task ShouldExecuteAllChecksWithDefaultCulture()
    {
        TestCulture.Set("en-US");
        CultureInfo? receivedCulture = null;
        check1.Setup(c => c.ExecuteAsync(expectedCt))
            .Callback(() => receivedCulture = CultureInfo.CurrentCulture);

        await Act();

        receivedCulture.Should().Be(new CultureInfo("it-IT"));
    }

    [Fact]
    public async Task ShouldHandleExecutionExceptions()
    {
        var ex = new Exception("Execution error.");
        check1.Setup(c => c.ExecuteAsync(expectedCt)).ThrowsAsync(ex);

        var results = await Act();

        results.Should().HaveCount(2);
        results[0].Name.Should().Be("Check 1");
        results[0].Passed.Should().BeFalse();
        results[0].Error.Should().BeSameAs(ex);
    }

    [Fact]
    public async Task ShouldExecuteInParallel()
    {
        var startedCount = 0;
        var semaphore = new SemaphoreSlim(0, 2);
        check1.Setup(c => c.ExecuteAsync(expectedCt)).Returns(async () =>
        {
            Interlocked.Increment(ref startedCount);
            await semaphore.WaitAsync(TestContext.Current.CancellationToken);

            return HealthCheckResult.Success;
        });
        check2.Setup(c => c.ExecuteAsync(expectedCt)).Returns(async () =>
        {
            Interlocked.Increment(ref startedCount);
            await semaphore.WaitAsync(TestContext.Current.CancellationToken);

            return HealthCheckResult.Success;
        });

        var tasks = Act();

        Wait.Until(() => startedCount == 2, totalWait: TimeSpan.FromMilliseconds(200));
        semaphore.Release(2);
        (await tasks).Should().MatchItems(r => r.Passed, r => r.Passed);
    }
}
