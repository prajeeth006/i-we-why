using System;
using Frontend.Vanilla.Core.System.Text;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;

/// <summary>
/// Storage of configuration overrides according to set-up <see cref="LocalOverridesMode" />.
/// </summary>
internal interface IOverridesStorage
{
    TrimmedRequiredString? CurrentContextId { get; }
    JObject Get();
    void Set(JObject overridesJson);
    IChangeToken WatchChanges();
}

internal sealed class DisabledOverridesStorage : IOverridesStorage
{
    public TrimmedRequiredString? CurrentContextId => null;
    public JObject Get() => throw CreateException();
    public void Set(JObject overridesJson) => throw CreateException();
    public IChangeToken WatchChanges() => throw CreateException();

    private static Exception CreateException()
        => new NotSupportedException(
            $"Configuration overrides are disabled according to {nameof(DynaConEngineSettings)}.{nameof(DynaConEngineSettings.LocalOverridesMode)}.");
}
