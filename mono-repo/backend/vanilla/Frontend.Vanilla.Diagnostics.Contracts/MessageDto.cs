namespace Frontend.Vanilla.Diagnostics.Contracts;

public sealed class MessageDto(string message)
{
    public string Message { get; } = message;
}
