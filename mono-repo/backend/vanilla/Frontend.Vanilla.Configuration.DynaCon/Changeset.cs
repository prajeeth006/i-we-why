using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Configuration.DynaCon;

/// <summary>
/// Defines a set of configs returned from the service.
/// </summary>
internal interface IChangeset
{
    long Id { get; }
    UtcDateTime ValidFrom { get; }
    ConfigurationResponse Dto { get; }
    VariationHierarchyResponse ContextHierarchy { get; }
    ConfigurationSource Source { get; }
    HttpUri Url { get; }
}

internal enum ConfigurationSource
{
    Service,
    FallbackFile,
    LocalOverrides,
}

internal interface IValidChangeset : IChangeset
{
    IReadOnlyDictionary<TrimmedRequiredString, FeatureConfigurationList> Features { get; }
    IReadOnlyList<TrimmedRequiredString> Warnings { get; }
    IReadOnlyDictionary<TrimmedRequiredString, Core.Collections.ReadOnlySet<TrimmedRequiredString>> DefinedContextValues { get; }
    object Info { get; }
}

internal interface IFailedChangeset : IChangeset
{
    IReadOnlyList<Exception> Errors { get; }
}

internal sealed class FeatureConfiguration(object instance, VariationContext context)
{
    public object Instance { get; } = instance;
    public VariationContext Context { get; } = context;
}

internal sealed class FeatureConfigurationList(IEnumerable<FeatureConfiguration> inner)
    : ReadOnlyCollection<FeatureConfiguration>(inner.OrderByDescending(c => c.Context.Priority).ToArray()) { }

internal abstract class Changeset(ConfigurationResponse dto, VariationHierarchyResponse contextHierarchy, ConfigurationSource source, HttpUri url)
    : IChangeset
{
    public long Id => Dto.ChangesetId;
    public UtcDateTime ValidFrom => new UtcDateTime(Dto.ValidFrom);
    public ConfigurationResponse Dto { get; } = dto;
    public VariationHierarchyResponse ContextHierarchy { get; } = contextHierarchy;
    public ConfigurationSource Source { get; } = Guard.DefinedEnum(source, nameof(source));
    public HttpUri Url { get; } = url;
}

internal sealed class ValidChangeset : Changeset, IValidChangeset
{
    public IReadOnlyDictionary<TrimmedRequiredString, FeatureConfigurationList> Features { get; }
    public IReadOnlyList<TrimmedRequiredString> Warnings { get; }
    public IReadOnlyDictionary<TrimmedRequiredString, Core.Collections.ReadOnlySet<TrimmedRequiredString>> DefinedContextValues { get; }
    public object Info { get; }

    public ValidChangeset(
        ConfigurationResponse dto,
        VariationHierarchyResponse contextHierarchy,
        ConfigurationSource source,
        HttpUri url,
        IDictionary<TrimmedRequiredString, FeatureConfigurationList> features,
        IEnumerable<TrimmedRequiredString> warnings)
        : base(dto, contextHierarchy, source, url)
    {
        Features = Enumerable.ToDictionary(features
                .OrderBy(f => f.Key, RequiredStringComparer.OrdinalIgnoreCase), RequiredStringComparer.OrdinalIgnoreCase.AsTrimmed())
            .AsReadOnly();
        Warnings = warnings.ToArray().AsReadOnly();
        DefinedContextValues = contextHierarchy.Hierarchy
            .ToDictionary( // ReSharper disable once RedundantCast
                h => (TrimmedRequiredString)h.Key,
                h => h.Value.Keys
                    .Select(k => (TrimmedRequiredString)k)
                    .ToHashSet(RequiredStringComparer.OrdinalIgnoreCase.AsTrimmed())
                    .AsReadOnly(),
                RequiredStringComparer.OrdinalIgnoreCase.AsTrimmed())
            .AsReadOnly();

        var mostInstances = Features
            .OrderByDescending(f => f.Value.Count)
            .First();
        var mostValues = dto.Configuration
            .SelectMany(k => k.Value.Select(v => (FeatureName: k.Key, KeyName: v.Key, v.Value.Values)))
            .OrderByDescending(v => v.Values.Count)
            .First();
        Info = new
        {
            ValidFrom = ValidFrom.Value.ToString(DiagnosticConstants.DateTimeFormat),
            Source,
            TotalFeatureCount = Features.Count,
            TotalInstanceCount = Features.Values.Sum(v => v.Count),
            FeatureWithMostInstances = new
            {
                FeatureName = mostInstances.Key,
                InstanceCount = mostInstances.Value.Count,
            },
            InputKeyWithMostValues = new
            {
                mostValues.FeatureName,
                mostValues.KeyName,
                ValueCount = mostValues.Values.Count,
            },
        };
    }
}

internal sealed class FailedChangeset(
    ConfigurationResponse dto,
    VariationHierarchyResponse contextHierarchy,
    ConfigurationSource source,
    HttpUri url,
    IEnumerable<Exception> errors)
    : Changeset(dto, contextHierarchy, source, url), IFailedChangeset
{
    public IReadOnlyList<Exception> Errors { get; } = errors.ToArray();
    public bool Passed => false; // Renders as red in /health/config
}

internal sealed class PastChangesetInfo(long id, UtcDateTime validFrom, bool isValid) : IHistoryItem
{
    public long Id { get; } = id;
    public UtcDateTime ValidFrom { get; } = validFrom;
    public bool IsValid { get; } = isValid;
    UtcDateTime IHistoryItem.Time => ValidFrom;
}
