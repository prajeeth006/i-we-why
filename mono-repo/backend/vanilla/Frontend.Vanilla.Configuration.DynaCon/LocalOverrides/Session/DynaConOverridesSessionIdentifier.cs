using System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.Session;

/// <summary>
/// Identifies session with DynaCon overrides.
/// </summary>
internal interface IDynaConOverridesSessionIdentifier
{
    TrimmedRequiredString? Value { get; }
    TrimmedRequiredString Create();
    void Delete();
}

internal class StaticDynaConOverridesSessionIdentifier : IDynaConOverridesSessionIdentifier
{
    public TrimmedRequiredString? Value { get; private set; }

    public TrimmedRequiredString Create()
        => Value = Guid.NewGuid().ToString("N");

    public void Delete()
        => Value = null;
}
