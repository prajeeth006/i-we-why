using System;

namespace Frontend.Vanilla.Core.Rest;

internal sealed class NullDeserializedException : Exception
{
    public NullDeserializedException()
        : base("Null was deserialized.") { }
}

internal sealed class RestResponseDeserializationException : Exception
{
    public RestResponseDeserializationException(string? message = null, Exception? innerException = null)
        : base(message, innerException) { }
}
