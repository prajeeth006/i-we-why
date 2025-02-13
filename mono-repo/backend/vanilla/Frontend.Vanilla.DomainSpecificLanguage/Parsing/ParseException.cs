using System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing;

/// <summary>
/// Exception which indicates where the error within parsed expression has occurred.
/// </summary>
internal sealed class ParseException(int position, string message, Exception? innerException = null) : Exception(message, innerException)
{
    public int Position { get; } = Guard.GreaterOrEqual(position, 0, nameof(position));
}
