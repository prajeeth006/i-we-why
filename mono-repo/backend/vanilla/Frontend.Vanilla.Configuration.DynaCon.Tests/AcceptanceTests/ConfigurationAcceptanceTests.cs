using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.Polling.Changes;
using Frontend.Vanilla.Configuration.DynaCon.Polling.ProactiveValidation;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.AcceptanceTests;

public sealed class ConfigurationAcceptanceTests : IDisposable
{
    private readonly DynaConEngineSettingsBuilder settings;
    private readonly Mock<IRestClient> restClient;
    private readonly Mock<IDynaConVariationContextProvider> religionContextProvider;
    private readonly TestLogger<object> log;
    private readonly Mock<ITimerFactory> timerFactory;
    private readonly List<(Action Action, TimeSpan DueTime, TimeSpan Period)> timers;
    private readonly TestClock clock;

    private IFooConfiguration foo;
    private IBarConfiguration bar;
    private IHealthCheck healthCheck;
    private IConfigurationReporter reporter;
    private IConfigurationOverridesService overridesService;
    private IStaticContextManager contextManager;

    public ConfigurationAcceptanceTests()
    {
        settings = new DynaConEngineSettingsBuilder(
            TestSettings.GetParameter(),
            new DynaConParameter("context.environment", "qa666"));
        restClient = new Mock<IRestClient>();
        religionContextProvider = new Mock<IDynaConVariationContextProvider>();
        log = new TestLogger<object>();
        timerFactory = new Mock<ITimerFactory>();
        timers = new List<(Action Action, TimeSpan DueTime, TimeSpan Period)>();
        clock = new TestClock();

        religionContextProvider.SetupGet(p => p.Name).Returns("Religion");
        religionContextProvider.SetupWithAnyArgs(p => p.GetCurrentValue(null)).Returns("Christianity");
        SetupRestResponse("/configuration/variationhierarchy", () => TestChangeset.VariationHierarchy);
        SetupRestResponse("/configuration/feedback", () => "");
        timerFactory.SetupWithAnyArgs(f => f.Create(null, default, default))
            .Callback((Action a, TimeSpan t, TimeSpan p) => timers.Add((a, t, p)))
            .Returns(Mock.Of<IDisposable>);
    }

    public void Dispose()
    {
        log.Logged.Where(e => e.Level.EqualsAny(LogLevel.Error, LogLevel.Critical)).Should().BeEmpty();
        TempFile.DeleteIfExists(settings.ChangesetFallbackFile);
        TempFile.DeleteIfExists(settings.ContextHierarchyFallbackFile);
        TempFile.DeleteIfExists(settings.LocalOverridesFile);
    }

    private void RunDynaConInitialization()
    {
        var services = new ServiceCollection()
            .AddVanillaDynaConConfigurationEngine()
            .AddSingleton(settings.Build())
            .AddVanillaDomainSpecificLanguage() // To test DSL expressions in configs
            .AddFakeVanillaDslProviders()
            .AddSingleton<ICookiesDslProvider, DslProviderWithConfig>() // To test DSL provider which use configs which is circular dependency
            .AddConfiguration<IFooConfiguration, FooConfiguration>("Foo")
            .AddConfigurationWithFactory<IBarConfiguration, BarConfigurationDto, BarConfigurationFactory>("Bar")
            .AddSingleton(restClient.Object)
            .AddSingleton(new MemoryCache(new OptionsWrapper<MemoryCacheOptions>(new MemoryCacheOptions()))) // Recreate to avoid cached DSL expressions
            .AddSingleton(religionContextProvider.Object)
            .AddSingleton(Mock.Of<ILoggerProvider>(p => p.CreateLogger(It.IsAny<string>()) == log))
            .AddSingleton(timerFactory.Object)
            .AddSingleton<IClock>(clock)
            .BuildServiceProvider();

        // We should be able to resolve services even before values are initialized
        foo = services.GetRequiredService<IFooConfiguration>();
        bar = services.GetRequiredService<IBarConfiguration>();
        healthCheck = services.GetRequiredService<IHealthCheck>();
        reporter = services.GetRequiredService<IConfigurationReporter>();
        overridesService = services.GetRequiredService<IConfigurationOverridesService>();
        contextManager = services.GetRequiredService<IStaticContextManager>();
        services.GetRequiredService<IDslCompiler>(); // Generates fake providers -> faster changeset deserialization -> within time limits

        // Act
        services.GetRequiredService<IConfigurationInitializer>().Initialize();
    }

    private void SetupRestResponse(string pathSuffix, Func<string> getContent, HttpStatusCode statusCode = HttpStatusCode.OK, string query = "")
        => restClient.Setup(c =>
                c.Execute(It.Is<RestRequest>(r => r.Url.AbsolutePath.EndsWith(pathSuffix, StringComparison.OrdinalIgnoreCase) && r.Url.Query.Contains(query))))
            .Returns<RestRequest>(r => new RestResponse(r) { StatusCode = statusCode, Content = getContent().EncodeToBytes() });

    private void SetupCurrentConfigResponse(Func<string> getContent, HttpStatusCode statusCode = HttpStatusCode.OK)
        => SetupRestResponse("/configuration", getContent, statusCode);

    private void SetupConfigChangesResponse(long fromChangesetId, Func<string> getContent)
        => SetupRestResponse("/configuration/changes/expand", getContent, query: "fromChangesetId=" + fromChangesetId);

    private bool IsHealthCheckPassed()
        => healthCheck.ExecuteAsync(CancellationToken.None).Result.Error == null;

    private void VerifyRestRequestTo(string pathAndQuery, Times? times = null)
        => restClient.Verify(c => c.Execute(It.Is<RestRequest>(r => r.Url.EqualsAnyQueryOrder(new Uri("https://api.dynacon.prod.env.works/v1" + pathAndQuery)))),
            times ?? Times.Once());

    private void VerifyFeedbackWasPosted(long changesetId, bool isValid, long? commitId = null)
    {
        var expectedUrl = new Uri(
            "https://api.dynacon.prod.env.works/v1/configuration/feedback?service=Test%3A1&context.environment=qa666&enableExtendedContext=true"
            + "&changesetId=" + changesetId
            + (commitId != null ? "&commitId=" + commitId : null));

        restClient.Verify(c => c.Execute(It.Is<RestRequest>(r => r.Url == expectedUrl && ((FeedbackRequest)r.Content.Value).IsValid == isValid)));
    }

    private void RunEnqueuedTimers()
    {
        foreach (var timer in timers.ToList())
        {
            timer.Action();
            if (timer.Period <= TimeSpan.Zero) timers.Remove(timer);
        }
    }

    [Fact]
    public void ShouldFillModelClassesFromDynaCon()
    {
        settings.SendFeedback = true;
        SetupCurrentConfigResponse(() => TestChangeset.GetJson());

        RunDynaConInitialization(); // Act

        foo.Value.Should().Be(TestChangeset.TestFooValue);
        foo.DslExpression.OriginalString.Should().Be("User.LoggedIn");
        bar.IsEnabled.Should().BeTrue();
        VerifyBarPerson("Homer", "Simpson");
        bar.BusinessValue.Should().Be(123);
        VerifyFooValueInReport(TestChangeset.TestFooValue);
        IsHealthCheckPassed().Should().BeTrue();

        restClient.VerifyWithAnyArgs(c => c.Execute(null), Times.Exactly(3));
        VerifyRestRequestTo("/configuration?service=Test%3A1&context.environment=qa666&enableExtendedContext=true&maskSensitiveData=False");
        VerifyRestRequestTo("/configuration/variationhierarchy?service=Test%3A1");
        VerifyFeedbackWasPosted(TestChangeset.TestId, isValid: true);
    }

    [Fact]
    public void ShouldWriteFallbackFileOnConfigurationLoad()
    {
        SetupFallback();
        SetupCurrentConfigResponse(() => TestChangeset.GetJson());

        RunDynaConInitialization(); // Act
        foo.Value.Should().NotBeNull();

        File.ReadAllText(settings.ChangesetFallbackFile).Should().Contain(TestChangeset.TestFooValue);
        File.ReadAllText(settings.ContextHierarchyFallbackFile).Should().Contain("Religion");
    }

    public enum FailedTestCase
    {
        /// <summary>
        /// InvalidChangeset
        /// </summary>
        InvalidChangeset,

        /// <summary>
        /// FailedRequest
        /// </summary>
        FailedRequest,
    }

    [Theory, EnumData(typeof(FailedTestCase))]
    public async Task ShouldFallBackToConfigFromFile_IfServiceFailedOrInvalidChangeset(FailedTestCase testCase)
    {
        // Create fallback file using another container
        SetupFallback();
        settings.SendFeedback = true;
        SetupCurrentConfigResponse(() => TestChangeset.GetJson());
        RunDynaConInitialization();
        foo.Value.Should().NotBeNull();
        File.ReadAllText(settings.ChangesetFallbackFile).Should().Contain(TestChangeset.TestFooValue);
        restClient.Invocations.Clear();

        const long invalidId = TestChangeset.TestId + 1;
        var invalidJson = TestChangeset.GetJson(invalidId, TestChangeset.InvalidFooValue, TestChangeset.TestValidFrom.AddHours(1));
        SetupCurrentConfigResponse( // Setup error
            getContent: () => testCase == FailedTestCase.InvalidChangeset ? invalidJson : "",
            statusCode: testCase == FailedTestCase.FailedRequest ? HttpStatusCode.InternalServerError : HttpStatusCode.OK);

        RunDynaConInitialization(); // Act

        foo.Value.Should().Be(TestChangeset.TestFooValue);
        var report = await reporter.GetReportAsync(TestContext.Current.CancellationToken);
        report.Configuration.Active.Id.Should().Be(TestChangeset.TestId);

        switch (testCase)
        {
            case FailedTestCase.InvalidChangeset:
                report.CriticalErrors.Should().ContainKeys(string.Format(FallbackFileReportMessages.UsingFallbackFormat, "changeset"),
                    ChangesetReporter.InvalidLatestChangesetError);
                report.Configuration.Future.Single().Should().Match<IFailedChangeset>(c => c.Id == invalidId);
                VerifyFeedbackWasPosted(invalidId, isValid: false);

                break;
            case FailedTestCase.FailedRequest:
                report.CriticalErrors.Should().ContainKeys(string.Format(FallbackFileReportMessages.UsingFallbackFormat, "changeset"),
                    ServiceCallsReporter.ServiceAccessError);
                restClient.Verify(c => c.Execute(It.Is<RestRequest>(r => r.Url.AbsoluteUri.Contains("/feedback"))), Times.Never()); // No feedback should have been sent

                break;
        }
    }

    [Fact]
    public async Task ShouldPollForChanges()
    {
        SetupCurrentConfigResponse(() => TestChangeset.GetJson(1111, fooValue: "first", validFrom: clock.UtcNow.AddSeconds(-666)));
        SetupConfigChangesResponse(1111, () => "[" + TestChangeset.GetJson(2222, fooValue: "second", validFrom: clock.UtcNow.AddSeconds(5000)) + "]");
        SetupConfigChangesResponse(2222, () => "[]");

        SetupFallback();
        settings.ChangesPollingInterval = TimeSpan.FromSeconds(300);
        settings.PollingStartupDelay = TimeSpan.FromSeconds(1000);

        // First timer is UpdatedContextHierarchy
        RunDynaConInitialization();
        timers.Should().HaveCount(1);

        // PollingForChanges timer should be added after tenant initialization
        foo.Value.Should().Be("first");
        timers.Should().HaveCount(2);
        timers[1].DueTime.Should().BeGreaterOrEqualTo(TimeSpan.FromSeconds(1000)).And.BeLessOrEqualTo(TimeSpan.FromSeconds(1300));
        timers[1].Period.Should().Be(TimeSpan.FromSeconds(300));
        await CheckReport(r => r.Configuration.Future.Should().BeEmpty());

        // New changeset should be queued after the poll request, old config still should be active
        RunEnqueuedTimers();
        await CheckReport(r => r.Configuration.Future.Single().Id.Should().Be(2222));
        foo.Value.Should().Be("first");
        timers.Should().HaveCount(3);
        timers[2].DueTime.Should().Be(TimeSpan.FromSeconds(5000).Add(ActivateChangesetScheduler.GracePeriod));
        timers[2].Period.Should().Be(TimeSpan.Zero);

        // New config should get activated after it's validFrom is reached, also it should get written to fallback files
        clock.UtcNow += TimeSpan.FromSeconds(5001);
        RunEnqueuedTimers();
        await CheckReport(r => r.Configuration.Active.Id.Should().Be(2222));
        foo.Value.Should().Be("first"); // Should still be same until context switch
        await contextManager.SwitchContextAsync(TestContext.Current.CancellationToken);
        foo.Value.Should().Be("second");
        File.ReadAllText(settings.ChangesetFallbackFile).Should().Contain("second");

        VerifyRestRequestTo("/configuration?service=Test%3A1&context.environment=qa666&enableExtendedContext=true&maskSensitiveData=False");
        VerifyRestRequestTo("/configuration/changes/expand?service=Test%3A1&context.environment=qa666&enableExtendedContext=true&fromChangesetId=1111");
        VerifyRestRequestTo("/configuration/changes/expand?service=Test%3A1&context.environment=qa666&enableExtendedContext=true&fromChangesetId=2222",
            Times.AtLeastOnce());
        VerifyRestRequestTo("/configuration/variationhierarchy?service=Test%3A1", Times.AtLeast(2));
    }

    [Fact]
    public async Task ShouldProactivelyValidateChangesets()
    {
        settings.ProactiveValidationPollingInterval = TimeSpan.FromSeconds(300);
        settings.PollingStartupDelay = TimeSpan.FromSeconds(1000);
        settings.SendFeedback = true;
        SetupCurrentConfigResponse(() => TestChangeset.GetJson(1111, validFrom: clock.UtcNow.AddHours(-2)));
        SetupRestResponse("/configuration/validatablechangesets", () => "[{ ChangesetId: 2222, CommitId: 123 }, { ChangesetId: 3333, CommitId: 124 }]");
        SetupRestResponse("/configuration", query: "changesetId=2222", getContent: () =>
            TestChangeset.GetJson(2222, lastCommitId: 92, fooValue: TestChangeset.InvalidFooValue));
        SetupRestResponse("/configuration", query: "changesetId=3333", getContent: () =>
            TestChangeset.GetJson(3333, lastCommitId: 93, fooValue: "LOL", validFrom: clock.UtcNow.AddHours(-1))); // ValidFrom should overrule current one

        // Act 1
        RunDynaConInitialization();
        foo.Value.Should().Be(TestChangeset.TestFooValue); // Initialize tenant b/c lazy

        timers.Should().HaveCount(1);
        timers[0].DueTime.Should().BeGreaterOrEqualTo(TimeSpan.FromSeconds(1000)).And.BeLessOrEqualTo(TimeSpan.FromSeconds(1300));
        timers[0].Period.Should().Be(TimeSpan.FromSeconds(300));

        // Act 2
        RunEnqueuedTimers();

        var report = await reporter.GetReportAsync(TestContext.Current.CancellationToken);
        report.ProactiveValidation.Should().BeOfType<ProactiveValidationReport>()
            .Which.PastValidations.Should().NotBeEmpty()
            .And.Contain(c => c.ChangesetId == 2222L && c.Result.Value.StartsWith(ProactiveValidationJob.Results.InvalidPrefix))
            .And.Contain(c => c.ChangesetId == 3333L && c.Result == ProactiveValidationJob.Results.Valid);

        VerifyFeedbackWasPosted(2222, commitId: 92, isValid: false);
        VerifyFeedbackWasPosted(3333, commitId: 93, isValid: true);

        // App configuration (active/future/past) shouldn't be modified
        foo.Value.Should().Be(TestChangeset.TestFooValue);
        report.Configuration.Active.Id.Should().Be(1111);
        report.Configuration.Future.Should().BeEmpty();
        report.Configuration.Past.Should().BeEmpty();
    }

    [RetryFact(Skip = "Fails on CI")]
    public async Task ShouldPickUpOverridesAutomatically()
    {
        SetupCurrentConfigResponse(() => TestChangeset.GetJson());
        settings.EnableLocalFileOverrides(TempFile.Get(createFile: false));
        RunDynaConInitialization();
        foo.Value.Should().Be(TestChangeset.TestFooValue);

        // Act
        File.WriteAllText(settings.LocalOverridesFile, @"{
              ""Configuration"": {
                ""Foo"": {
                  ""Value"": {
                    ""Values"": [ { ""Value"": ""Overridden"" } ]
                  }
                }
              }
            }");

        await CheckOverridesInReport("Overridden");
        foo.Value.Should().Be(TestChangeset.TestFooValue); // Should still be same until context switch
        await contextManager.SwitchContextAsync(default);
        foo.Value.Should().Be("Overridden");

        // Act 2
        File.WriteAllText(settings.LocalOverridesFile, "");

        await CheckOverridesInReport(TestChangeset.TestFooValue);
        foo.Value.Should().Be("Overridden"); // Should still be same until context switch
        await contextManager.SwitchContextAsync(default);
        foo.Value.Should().Be(TestChangeset.TestFooValue);
    }

    private async Task CheckOverridesInReport(string expectedFooValue)
    {
        if (settings.LocalOverridesMode == LocalOverridesMode.File)
            await WaitForReport(r => GetActual(r) == expectedFooValue); // Wait for file watcher
        else
            await CheckReport(r => GetActual(r).Should().Be(expectedFooValue)); // Check directly

        string GetActual(ConfigurationReport report)
        {
            var changeset = report.Configuration.Overridden ?? report.Configuration.Active;

            return changeset.Features["Foo"].Select(c => c.Instance).Cast<IFooConfiguration>().First().Value;
        }
    }

    [Theory]
    [InlineData(LocalOverridesMode.File)]
    [InlineData(LocalOverridesMode.Session)]
    public async Task ShouldSupportOverridesViaApi(LocalOverridesMode overridesMode)
    {
        SetupCurrentConfigResponse(() => TestChangeset.GetJson());
        settings.LocalOverridesMode = overridesMode;
        settings.LocalOverridesFile = overridesMode == LocalOverridesMode.File ? Path.GetTempFileName() : null;
        RunDynaConInitialization();

        // Act
        overridesService.SetJson(JObject.Parse(@"{ Configuration: {
                Foo: {
                    Value: {
                        Values: [
                            { Value: 'API-overridden', Priority: 9999999 }
                        ]
                    }
                }
            }}"));

        await CheckOverridesInReport("API-overridden");
        foo.Value.Should().Be("API-overridden");
    }

    [Fact]
    public async Task ShouldAllowLoadingExplicitChangeset()
    {
        const long explicitId = TestChangeset.TestId + 231;
        settings.ExplicitChangesetId = explicitId;
        SetupRestResponse("/configuration", () => TestChangeset.GetJson(explicitId), query: "changesetId=" + explicitId);

        RunDynaConInitialization(); // Act

        foo.Value.Should().Be(TestChangeset.TestFooValue);
        await CheckReport(r => r.Configuration.Active.Id.Should().Be(explicitId));
        VerifyRestRequestTo("/configuration?service=Test%3A1&context.environment=qa666&enableExtendedContext=true&changesetId=" + explicitId);
    }

    [Fact]
    public async Task ShouldGetConfigAccordingToVariationContextDynamically()
    {
        SetupCurrentConfigResponse(() => TestChangeset.GetJson());
        RunDynaConInitialization();
        VerifyBarPerson("Homer", "Simpson");

        // Directly matched config
        religionContextProvider.SetupWithAnyArgs(p => p.GetCurrentValue(null)).Returns("Buddhism");
        VerifyBarPerson("Homer", "Simpson"); // Should still be same until context switch
        await contextManager.SwitchContextAsync(TestContext.Current.CancellationToken);
        VerifyBarPerson("Lisa", "Simpson");

        // Matched child through variation hierarchy
        religionContextProvider.SetupWithAnyArgs(p => p.GetCurrentValue(null)).Returns("Satanism");
        await contextManager.SwitchContextAsync(TestContext.Current.CancellationToken);
        VerifyBarPerson("Bart", "Simpson");

        // Matching parent through variation hierarchy should not work
        religionContextProvider.SetupWithAnyArgs(p => p.GetCurrentValue(null)).Returns("Peaceful");
        await contextManager.SwitchContextAsync(TestContext.Current.CancellationToken);
        VerifyBarPerson("Homer", "Simpson");

        await CheckReport(r => r.Configuration.Active.Features["Bar"].Should().HaveCount(3));
    }

    [Fact]
    public void ShouldReplacePlaceholders()
    {
        SetupCurrentConfigResponse(() => TestChangeset.GetJson(fooValue: "Welcome follower of ${dynacon:Religion} to ${dynacon:Environment}."));
        RunDynaConInitialization();
        religionContextProvider.SetupWithAnyArgs(p => p.GetCurrentValue(null)).Returns("Satanism");

        foo.Value.Should().Be("Welcome follower of Satanism to qa666.");
    }

    private Task VerifyFooValueInReport(string fooValue)
        => CheckReport(report =>
        {
            report.CriticalErrors.Should().BeEmpty();
            var changeset = report.Configuration.Overridden ?? report.Configuration.Active;
            var fooConfigs = changeset.Features["Foo"].Select(c => c.Instance).Cast<IFooConfiguration>();
            fooConfigs.Should().OnlyContain(f => f.Value == fooValue);
        });

    private async Task CheckReport(Action<ConfigurationReport> verify)
    {
        var report = await reporter.GetReportAsync(default);
        verify(report);
    }

    private Task WaitForReport(Func<ConfigurationReport, bool> condition, TimeSpan? totalWait = null, TimeSpan initialWait = default)
        => Wait.Until(
            condition: async () =>
            {
                var report = await reporter.GetReportAsync(default);

                return condition(report);
            },
            totalWait,
            initialWait);

    private void VerifyBarPerson(string expectedFirstName, string expectedLastName)
    {
        bar.Person.FirstName.Should().Be(expectedFirstName);
        bar.Person.LastName.Should().Be(expectedLastName);
    }

    private void SetupFallback()
    {
        settings.ChangesetFallbackFile = TempFile.Get(createFile: false);
        settings.ContextHierarchyFallbackFile = TempFile.Get(createFile: false);
    }
}
