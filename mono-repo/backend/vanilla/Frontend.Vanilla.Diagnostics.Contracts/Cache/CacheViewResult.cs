using Newtonsoft.Json;

namespace Frontend.Vanilla.Diagnostics.Contracts.Cache;

[method: JsonConstructor]
public sealed class CacheViewResult(string? value)
{
    public string? Value { get; } = value;
}
