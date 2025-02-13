namespace Frontend.Vanilla.Diagnostics.Contracts;

public sealed class SelectItem(object value, string text)
{
    public string Value { get; } = value.ToString()!;
    public string Text { get; } = text;
}
