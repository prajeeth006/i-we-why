namespace Frontend.Vanilla.Diagnostics.Contracts.Dsl;

public sealed class ProviderMemberValue(string? valueJson = null, string? error = null)
{
    public string? ValueJson { get; } = valueJson;
    public string? Error { get; } = error;
}
