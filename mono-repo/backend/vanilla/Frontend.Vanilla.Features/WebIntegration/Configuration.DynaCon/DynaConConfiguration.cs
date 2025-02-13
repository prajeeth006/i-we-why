using System;
using System.Collections.Generic;
using Frontend.Vanilla.Configuration.DynaCon;
using Microsoft.Extensions.Configuration;

namespace Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;

internal interface IDynaConConfiguration
{
    Uri Host { get; }
    string Version { get; }
    string ChangesetFallbackFile { get; }
    string ContextHierarchyFallbackFile { get; }
    LocalOverridesMode? LocalOverridesMode { get; }
    string LocalOverridesFile { get; }
    TimeSpan? ValidatableChangesetsNetworkTimeout { get; }
    TimeSpan? NetworkTimeout { get; }
    IReadOnlyDictionary<string, string> Parameters { get; }
    bool? SkipInternalParameters { get; }
    int? PastChangesetsMaxCount { get; }
    int? PastServiceCallsMaxCount { get; }
    int? PastProactivelyValidatedChangesetsMaxCount { get; }
    Uri AdminWeb { get; }
    long? ChangesetId { get; }
    bool? SendFeedback { get; }
    TimeSpan? ChangesPollingInterval { get; }
    TimeSpan? ProactiveValidationPollingInterval { get; }
    string SerializeToString();
    string DynaconAppBootFallbackFile { get; }
}

internal sealed class DynaConConfiguration : IDynaConConfiguration
{
    private const string SectionName = "DynaCon";
    private readonly IConfigurationSection section;
    private readonly IConfigurationSection parametersSection;

    public DynaConConfiguration(IConfiguration configuration)
    {
        section = configuration.GetSection(SectionName);
        parametersSection = section.GetSection("Parameters");
    }

    public Uri Host => section.GetValue<Uri>("Host")!;
    public string Version => section.GetValue<string>("Version")!;
    public string ChangesetFallbackFile => section.GetValue<string>("ChangesetFallbackFile")!;
    public string ContextHierarchyFallbackFile => section.GetValue<string>("ContextHierarchyFallbackFile")!;
    public LocalOverridesMode? LocalOverridesMode => section.GetValue<LocalOverridesMode?>("LocalOverridesMode");
    public string LocalOverridesFile => section.GetValue<string>("LocalOverridesFile")!;
    public TimeSpan? ValidatableChangesetsNetworkTimeout => section.GetValue<TimeSpan?>("ValidatableChangesetsNetworkTimeout");
    public TimeSpan? NetworkTimeout => section.GetValue<TimeSpan?>("NetworkTimeout");
    public int? PastChangesetsMaxCount => section.GetValue<int?>("PastChangesetsMaxCount");
    public int? PastServiceCallsMaxCount => section.GetValue<int?>("PastServiceCallsMaxCount");
    public int? PastProactivelyValidatedChangesetsMaxCount => section.GetValue<int?>("PastProactivelyValidatedChangesetsMaxCount");
    public Uri AdminWeb => section.GetValue<Uri>("AdminWeb")!;
    public long? ChangesetId => section.GetValue<long?>("ChangesetId");
    public bool? SendFeedback => section.GetValue<bool?>("SendFeedback");
    public TimeSpan? ChangesPollingInterval => section.GetValue<TimeSpan?>("ChangesPollingInterval");
    public TimeSpan? ProactiveValidationPollingInterval => section.GetValue<TimeSpan?>("ProactiveValidationPollingInterval");
    public IReadOnlyDictionary<string, string> Parameters => parametersSection.Get<IReadOnlyDictionary<string, string>>()!;
    public bool? SkipInternalParameters => section.GetValue<bool?>("SkipInternalParameters");
    public string DynaconAppBootFallbackFile => section.GetValue<string>("DynaconAppBootFallbackFile")!;

    public string SerializeToString() => section.ToString() ?? $"Section {SectionName} is misconfigured.";
}
