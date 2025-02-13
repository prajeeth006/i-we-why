using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests;

public sealed class DynaConEngineSettingsTests
{
    private DynaConEngineSettingsBuilder builder;

    public DynaConEngineSettingsTests()
        => builder = new DynaConEngineSettingsBuilder(
            new DynaConParameter(DynaConParameter.ServiceName, "Sports:1"),
            new DynaConParameter(DynaConParameter.ServiceName, "Vanilla:666"));

    private void BuildAndExpectError(params string[] expectedMessageSubstrs)
    {
        var ex = new Func<object>(builder.Build).Should().Throw<Exception>().Which;
        ex.Message.Should().NotContain("1)", "there should be only one error in these tests");

        foreach (var substr in expectedMessageSubstrs)
            ex.Message.Should().Contain(substr);
    }

    [Fact]
    public void ShouldCreateNewInstanceWithDefaults()
    {
        // Act
        var target = builder.Build();

        target.Host.Should().Be(new Uri("https://api.dynacon.prod.env.works/"));
        target.ApiVersion.Should().Be("v1");
        target.ChangesPollingInterval.Should().BeNull();
        target.ProactiveValidationPollingInterval.Should().BeNull();
        target.PollingStartupDelay.Should().Be(TimeSpan.FromSeconds(10));
        target.TenantBlueprint.ChangesetFallbackFile.Should().BeNull();
        target.LocalOverridesMode.Should().Be(LocalOverridesMode.Disabled);
        target.TenantBlueprint.LocalOverridesFile.Should().BeNull();
        target.NetworkTimeout.Should().Be(TimeSpan.FromSeconds(10));
        target.PastChangesetsMaxCount.Should().Be(10);
        target.PastServiceCallsMaxCount.Should().Be(100);
        target.PastProactivelyValidatedChangesetsMaxCount.Should().Be(10);
        target.AdminWeb.Should().Be(new Uri("https://admin.dynacon.prod.env.works/"));
        target.SendFeedback.Should().BeFalse();
        target.ExplicitChangesetId.Should().BeNull();
        target.TenantBlueprint.Parameters.Should().BeEquivalentTo(
            new DynaConParameter("service", "Sports:1"), // Only service parameter can be specified multiple times
            new DynaConParameter("service", "Vanilla:666"));
        target.AdditionalInfo.Should().BeEmpty();
        target.DynaconAppBootFallbackFile.Should().Be(new RootedPath(OperatingSystem.IsWindows()
            ? @"D:\Configuration\DynaCon\DynaconAppBootFallbackFile.json"
            : "/configuration/DynaCon/DynaconAppBootFallbackFile.json"));
    }

    [Fact]
    public void ShouldCreateTypicalVanillaProdSettingsAccordingToWebConfig()
    {
        builder.SendFeedback = true;
        builder.ChangesPollingInterval = TimeSpan.FromMinutes(1);
        builder.ProactiveValidationPollingInterval = TimeSpan.FromMinutes(2);
        SetupFallback("default", "default");
        builder.AdditionalInfo.Add("Foo", "Lol");
        builder.AdditionalInfo.Add("Bar", "Wtf");
        builder.DynaconAppBootFallbackFile = (string)OperatingSystemRootedPath.Get(@"DynaconAppBootFallbackFile.json");

        // Act
        var target = builder.Build();

        target.Host.Should().Be(new Uri("https://api.dynacon.prod.env.works/"));
        target.ApiVersion.Should().Be("v1");
        target.ChangesPollingInterval.Should().Be(TimeSpan.FromMinutes(1));
        target.ProactiveValidationPollingInterval.Should().Be(TimeSpan.FromMinutes(2));
        target.PollingStartupDelay.Should().Be(TimeSpan.FromSeconds(10));
        target.TenantBlueprint.ChangesetFallbackFile.Should().Be($"{OperatingSystemRootedPath.Get("ChangesetFallback.json")}");
        target.LocalOverridesMode.Should().Be(LocalOverridesMode.Disabled);
        target.TenantBlueprint.LocalOverridesFile.Should().BeNull();
        target.NetworkTimeout.Should().Be(TimeSpan.FromSeconds(10));
        target.PastChangesetsMaxCount.Should().Be(10);
        target.PastServiceCallsMaxCount.Should().Be(100);
        target.PastProactivelyValidatedChangesetsMaxCount.Should().Be(10);
        target.AdminWeb.Should().Be(new Uri("https://admin.dynacon.prod.env.works/"));
        target.SendFeedback.Should().BeTrue();
        target.ExplicitChangesetId.Should().BeNull();
        target.TenantBlueprint.Parameters.Should().BeEquivalentTo(
            new DynaConParameter("service", "Sports:1"), // Only service parameter can be specified multiple times
            new DynaConParameter("service", "Vanilla:666"));
        target.AdditionalInfo.Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, object> { { "Foo", "Lol" }, { "Bar", "Wtf" } });
        target.DynaconAppBootFallbackFile.Should().Be(OperatingSystemRootedPath.Get(@"DynaconAppBootFallbackFile.json"));
    }

    public static readonly IEnumerable<Uri> InvalidUrls = new[]
    {
        new HttpUri("http://dynacon/api?q=1"), // With query
        new HttpUri("http://dynacon/api#section"), // With fragment
    };

    [Fact]
    public void Host_ShouldSupportValues()
    {
        builder.Host = new HttpUri("http://dynacon/api");
        builder.Build().Host.Should().Be(new Uri("http://dynacon/api"));
    }

    [Theory, MemberValuesData(nameof(InvalidUrls))]
    public void Host_ShouldThrow_IfInvalid(HttpUri value)
    {
        builder.Host = value;
        BuildAndExpectError(nameof(builder.Host));
    }

    [Fact]
    public void AdminWeb_ShouldSupportValues()
    {
        builder.AdminWeb = new HttpUri("http://dynacon/admin");
        builder.Build().AdminWeb.Should().Be(new Uri("http://dynacon/admin"));
    }

    [Theory, MemberValuesData(nameof(InvalidUrls))]
    public void AdminWeb_ShouldThrow_IfInvalidUrl(HttpUri value)
    {
        builder.AdminWeb = value;
        BuildAndExpectError(nameof(builder.AdminWeb));
    }

    [Fact]
    public void ApiVersion_ShouldSupportValues()
    {
        builder.ApiVersion = "v6";
        builder.Build().ApiVersion.Should().Be("v6");
    }

    [Fact]
    public void ApiVersion_ShouldThrow_IfMissingVPrefix()
    {
        builder.ApiVersion = "6";
        BuildAndExpectError(nameof(builder.ApiVersion));
    }

    public static readonly IEnumerable<object[]> InvalidFilePaths = new[]
    {
        new object[] { "", "empty" },
        new object[] { "  ", "white-space" },
        new object[] { "not/rooted.json", "invalid" },
        new object[] { "invalid<:chars.json", "invalid" },
    };

    [Theory]
    [InlineData("Fallback.json")]
    // [InlineData("C:/Fallback-{context.label}.json")] enable with multitenancy
    public void ChangesetFallbackFile_ShouldSupportValues(string file)
    {
        SetupFallback((string)OperatingSystemRootedPath.Get(file), "default");
        builder.Build().TenantBlueprint.ChangesetFallbackFile.Should().Be((string)OperatingSystemRootedPath.Get(file));
    }

    [Theory, MemberData(nameof(InvalidFilePaths))]
    public void ChangesetFallbackFile_ShouldThrow_IfInvalid(string file, string expected)
    {
        SetupFallback(file, "default");
        BuildAndExpectError(nameof(builder.ChangesetFallbackFile), expected);
    }

    [Theory, MemberData(nameof(InvalidFilePaths))]
    public void ContextHierarchyFallbackFile_ShouldThrow_IfInvalid(string file, string expected)
    {
        SetupFallback(contextHierarchyFile: file, changesetFile: "default");
        BuildAndExpectError(nameof(builder.ContextHierarchyFallbackFile), expected);
    }

    [Fact]
    public void ContextHierarchyFallbackFile_ShouldThrow_IfPlaceholders()
    {
        SetupFallback(contextHierarchyFile: (string)OperatingSystemRootedPath.Get("Fallback-{context.label}.json"), changesetFile: "default");
        BuildAndExpectError(
            $"{nameof(builder.ContextHierarchyFallbackFile)} can't contain any placeholders. It must be final file path but it is '{(string)OperatingSystemRootedPath.Get("Fallback-{context.label}.json")}'.");
    }

    [Fact]
    public void DynaconAppBootFallbackFile_ShouldThrow_IfPlaceholders()
    {
        builder.DynaconAppBootFallbackFile = OperatingSystemRootedPath.Get("Fallback-{context.label}.json");
        BuildAndExpectError(
            $"{nameof(builder.DynaconAppBootFallbackFile)} can't contain any placeholders. It must be final file path but it is '{(string)OperatingSystemRootedPath.Get("Fallback-{context.label}.json")}'.");
    }

    [Theory]
    [InlineData("ChangesetFallback.json", null)]
    [InlineData(null, "ContextHierarchy.json")]
    public void FallbackFiles_ShouldThrow_IfOnlyOneSpecified(string changesetFile, string contextHierarchyFile)
    {
        if (changesetFile != null)
        {
            changesetFile = (string)OperatingSystemRootedPath.Get(changesetFile);
        }

        if (contextHierarchyFile != null)
        {
            contextHierarchyFile = (string)OperatingSystemRootedPath.Get(contextHierarchyFile);
        }

        SetupFallback(changesetFile, contextHierarchyFile);
        BuildAndExpectError(
            $"{nameof(builder.ChangesetFallbackFile)} and {nameof(builder.ContextHierarchyFallbackFile)} must be both specified (enabled) or null (disabled) at the same time.");
    }

    [Theory]
    [InlineData("Overrides.json", false)]
    [InlineData("Overrides.json", true)]
    public void LocalOverridesFile_ShouldSupportValues(
        string file,
        bool useEnableMethod)
    {
        if (useEnableMethod)
        {
            builder.EnableLocalFileOverrides(OperatingSystemRootedPath.Get(file));
        }
        else
        {
            builder.LocalOverridesMode = LocalOverridesMode.File;
            builder.LocalOverridesFile = OperatingSystemRootedPath.Get(file);
        }

        // Act
        builder.Build().TenantBlueprint.LocalOverridesFile.Should().Be(OperatingSystemRootedPath.Get(file));
    }

    [Theory, MemberData(nameof(InvalidFilePaths))]
    public void LocalOverridesFile_ShouldThrow_IfNotRootedOrInvalidChars(string value, string expected)
    {
        builder.LocalOverridesFile = value;
        BuildAndExpectError(nameof(builder.LocalOverridesFile), expected);
    }

    [Fact]
    public void LocalOverridesFile_ShouldThrow_IfNotSpecifiedForFileMode()
    {
        builder.LocalOverridesMode = LocalOverridesMode.File;
        BuildAndExpectError($"{nameof(builder.LocalOverridesFile)} must be specified when {nameof(builder.LocalOverridesMode)}='{LocalOverridesMode.File}'.");
    }

    [Fact]
    public void LocalOverridesFile_ShouldBeResetToNull_IfModeNotFile()
    {
        builder.LocalOverridesFile = OperatingSystemRootedPath.Get("Overrides.json");
        builder.Build().TenantBlueprint.LocalOverridesFile.Should().BeNull();
    }

    [Fact]
    public void LocalOverridesMode_ShouldAllowSessionOverridesWithOtherSettings()
    {
        builder.LocalOverridesMode = LocalOverridesMode.Session;
        builder.SendFeedback = true;
        builder.ChangesPollingInterval = TimeSpan.FromMinutes(1);
        SetupFallback("default", "default");

        var target = builder.Build(); // Act

        target.LocalOverridesMode.Should().Be(LocalOverridesMode.Session);
        target.SendFeedback.Should().BeTrue();
        target.ChangesPollingInterval.Should().Be(TimeSpan.FromMinutes(1));
        target.TenantBlueprint.ChangesetFallbackFile.Should().Be(OperatingSystemRootedPath.Get("ChangesetFallback.json"));
    }

    [Theory]
    [InlineData(100)]
    [InlineData(1250)]
    public void ChangesPollingInternal_ShouldSupportValues(int valueMillis)
    {
        builder.ChangesPollingInterval = TimeSpan.FromMilliseconds(valueMillis);
        builder.Build().ChangesPollingInterval.Should().Be(TimeSpan.FromMilliseconds(valueMillis));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-10)]
    public void ChangesPollingInternal_ShouldThrow_IfEqualToZeroOrLess(int valueSeconds)
    {
        builder.ChangesPollingInterval = TimeSpan.FromSeconds(valueSeconds);
        BuildAndExpectError(nameof(builder.ChangesPollingInterval));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(12)]
    public void ChangesPollingStartupDelay_ShouldSupportValues(int valueSeconds)
    {
        builder.PollingStartupDelay = TimeSpan.FromSeconds(valueSeconds);
        builder.Build().PollingStartupDelay.Should().Be(TimeSpan.FromSeconds(valueSeconds));
    }

    [Fact]
    public void ChangesPollingStartupDelay_ShouldThrow_IfBelowZero()
    {
        builder.PollingStartupDelay = TimeSpan.FromSeconds(-6);
        BuildAndExpectError(nameof(builder.PollingStartupDelay));
    }

    [Theory]
    [InlineData(100)]
    [InlineData(1250)]
    public void ProactiveValidationPollingInterval_ShouldSupportValues(int valueMillis)
    {
        builder.ProactiveValidationPollingInterval = TimeSpan.FromMilliseconds(valueMillis);
        builder.SendFeedback = true;
        builder.Build().ProactiveValidationPollingInterval.Should().Be(TimeSpan.FromMilliseconds(valueMillis));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-10)]
    public void ProactiveValidationPollingInterval_ShouldThrow_IfEqualToZeroOrLess(int valueSeconds)
    {
        builder.ProactiveValidationPollingInterval = TimeSpan.FromSeconds(valueSeconds);
        builder.SendFeedback = true;
        BuildAndExpectError(nameof(builder.ProactiveValidationPollingInterval));
    }

    [Fact]
    public void ProactiveValidationPollingInterval_ShouldThrow_IfSendFeedbackIsFalse()
    {
        builder.ProactiveValidationPollingInterval = TimeSpan.FromSeconds(15);
        BuildAndExpectError(
            $"If {nameof(builder.ProactiveValidationPollingInterval)} is specified (enabled) then {nameof(builder.SendFeedback)} must be true (enabled) so that proactive validation can post the feedback.");
    }

    [Theory]
    [InlineData(1)]
    [InlineData(125)]
    public void NetworkTimeout_ShouldSupportValues(int value)
    {
        builder.NetworkTimeout = TimeSpan.FromSeconds(value);
        builder.Build().NetworkTimeout.Should().Be(TimeSpan.FromSeconds(value));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-6)]
    public void NetworkTimeout_ShouldThrow_IfBelowZero(int value)
    {
        builder.NetworkTimeout = TimeSpan.FromSeconds(value);
        BuildAndExpectError(nameof(builder.NetworkTimeout));
    }

    [Theory, BooleanData]
    public void SendFeedback_ShouldSupportValues(bool value)
    {
        builder.SendFeedback = value;
        builder.Build().SendFeedback.Should().Be(value);
    }

    [Theory, BooleanData]
    public void Parameters_ShouldThrow_IfNullOrEmpty(bool nullOrEmpty)
    {
        builder.Parameters = nullOrEmpty ? null : new List<DynaConParameter>();
        BuildAndExpectError(nameof(builder.Parameters));
    }

    [Fact]
    public void Parameters_ShouldThrow_IfCompleteDuplicates()
    {
        builder.Parameters = new[]
        {
            new DynaConParameter("product", "Sports"),
            new DynaConParameter("product", "Sports"),
        };
        BuildAndExpectError(nameof(builder.Parameters), "'product'='Sports'");
    }

    [Fact]
    public void Parameters_ShouldThrow_IfDuplicatesByName()
    {
        builder.Parameters = new[]
        {
            new DynaConParameter(DynaConParameter.ServiceName, "SportsApp:7"),
            new DynaConParameter("product", "Sports"),
            new DynaConParameter("product", "Casino"),
        };
        BuildAndExpectError(
            $"Parameter with {nameof(DynaConParameter.Name)}='product' is specified multiple times with {nameof(DynaConParameter.Value)}-s: 'Sports', 'Casino'.");
    }

    [Fact]
    public void Parameters_ShouldThrow_IfNoService()
    {
        builder.Parameters = new[] { new DynaConParameter("product", "Sports") };
        BuildAndExpectError($"At least one parameter with {nameof(DynaConParameter.Name)}='{DynaConParameter.ServiceName}' must be specified");
    }

    [Theory]
    [InlineData(0)]
    [InlineData(6)]
    public void PastChangesetsMaxCount_ShouldSupportValues(int value)
    {
        builder.PastChangesetsMaxCount = value;
        builder.Build().PastChangesetsMaxCount.Should().Be(value);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-666)]
    public void PastChangesetsMaxCount_ShouldThrow_IfBelowZero(int value)
    {
        builder.PastChangesetsMaxCount = value;
        BuildAndExpectError(nameof(builder.PastChangesetsMaxCount));
    }

    [Theory]
    [InlineData(1)]
    [InlineData(6)]
    public void PastServiceCallsMaxCount_ShouldSupportValues(int value)
    {
        builder.PastServiceCallsMaxCount = value;
        builder.Build().PastServiceCallsMaxCount.Should().Be(value);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-666)]
    public void PastServiceCallsMaxCount_ShouldThrow_IfBelowOne(int value)
    {
        builder.PastServiceCallsMaxCount = value;
        BuildAndExpectError(
            $"{nameof(builder.PastServiceCallsMaxCount)} must be at least 1 because health check wouldn't be able to determine if last call was successful. Actual value: {value}.");
    }

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(6)]
    public void PastProactivelyValidatedChangesetsMaxCount_ShouldSupportValues(int value)
    {
        builder.PastProactivelyValidatedChangesetsMaxCount = value;
        builder.Build().PastProactivelyValidatedChangesetsMaxCount.Should().Be(value);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-666)]
    public void PastProactivelyValidatedChangesetsMaxCount_ShouldThrow_IfBelowOne(int value)
    {
        builder.PastProactivelyValidatedChangesetsMaxCount = value;
        BuildAndExpectError(nameof(builder.PastProactivelyValidatedChangesetsMaxCount));
    }

    [Fact]
    public void ExplicitChangesetId_ShouldSupportValues()
    {
        builder.ExplicitChangesetId = 2667;
        builder.Build().ExplicitChangesetId.Should().Be(2667);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-666)]
    public void ExplicitChangesetId_ShouldThrow_IfInvalid(int value)
    {
        builder.ExplicitChangesetId = value;
        BuildAndExpectError(nameof(builder.ExplicitChangesetId));
    }

    [Fact]
    public void ShouldNotAllowExplicitChangesetIdAndFallbackFileAtSameTime()
    {
        builder.ExplicitChangesetId = 2667;
        SetupFallback("default", "default");
        BuildAndExpectError($"{nameof(builder.ChangesetFallbackFile)} must be null (disabled) when {nameof(builder.ExplicitChangesetId)} is specified.");
    }

    [Fact]
    public void ShouldNotAllowExplicitChangesetId_AndPollingIntervalAtSameTime()
    {
        builder.ExplicitChangesetId = 2667;
        builder.ChangesPollingInterval = TimeSpan.FromSeconds(10);
        BuildAndExpectError($"{nameof(builder.ChangesPollingInterval)} must be null (disabled) when {nameof(builder.ExplicitChangesetId)} is specified.");
    }

    [Fact]
    public void ShouldNotAllowFileOverrides_AndFallbackFileAtSameTime()
    {
        builder.EnableLocalFileOverrides(OperatingSystemRootedPath.Get("Overrides.json"));
        SetupFallback("default", "default");
        BuildAndExpectError($"{nameof(builder.ChangesetFallbackFile)} must be null (disabled) when {nameof(builder.LocalOverridesMode)}='{LocalOverridesMode.File}'");
    }

    [Fact]
    public void ShouldNotAllowFileOverrides_AndProactiveValidationAtSameTime()
    {
        builder.EnableLocalFileOverrides(OperatingSystemRootedPath.Get("Overrides.json"));
        builder.ProactiveValidationPollingInterval = TimeSpan.FromMinutes(2);
        builder.SendFeedback = true;

        new Func<object>(builder.Build).Should().Throw()
            .Which.Message.Should()
            .Contain(
                $"{nameof(builder.ProactiveValidationPollingInterval)} must be null (disabled) when {nameof(builder.LocalOverridesMode)}='{LocalOverridesMode.File}'");
    }

    [Fact]
    public void ShouldNotAllowFileOverrides_AndPollingIntervalAtSameTime()
    {
        builder.EnableLocalFileOverrides(OperatingSystemRootedPath.Get("Overrides.json"));
        builder.ChangesPollingInterval = TimeSpan.FromSeconds(10);
        BuildAndExpectError($"{nameof(builder.ChangesPollingInterval)} must be null (disabled) when {nameof(builder.LocalOverridesMode)}='{LocalOverridesMode.File}'.");
    }

    [Fact]
    public void ShouldNotAllowFileOverrides_AndSendFeedbackAtSameTime()
    {
        builder.EnableLocalFileOverrides(OperatingSystemRootedPath.Get("Overrides.json"));
        builder.SendFeedback = true;
        BuildAndExpectError($"{nameof(builder.SendFeedback)} must be false (disabled) when {nameof(builder.LocalOverridesMode)}='{LocalOverridesMode.File}'");
    }

    [Fact]
    public void ShouldNotAllowExplicitChangesetId_AndNotSendFeedbackAtSameTime()
    {
        builder.ProactiveValidationPollingInterval = TimeSpan.FromSeconds(10);
        BuildAndExpectError($"If {nameof(builder.ProactiveValidationPollingInterval)} is specified (enabled) then {nameof(builder.SendFeedback)}");
    }

    private void SetupFallback(string changesetFile, string contextHierarchyFile)
    {
        if (changesetFile == "default")
        {
            changesetFile = (string)OperatingSystemRootedPath.Get("ChangesetFallback.json");
        }

        if (contextHierarchyFile == "default")
        {
            contextHierarchyFile = (string)OperatingSystemRootedPath.Get("ContextHierarchyFallback.json");
        }

        builder.ChangesetFallbackFile = changesetFile;
        builder.ContextHierarchyFallbackFile = contextHierarchyFile;
    }
}
