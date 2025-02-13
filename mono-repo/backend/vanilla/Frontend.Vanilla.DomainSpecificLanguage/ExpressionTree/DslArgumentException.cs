using System;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;

/// <summary>
/// Semantic error in the expression which is handled during parsing and exposed to the consumer.
/// </summary>
internal sealed class DslArgumentException(string message) : ArgumentException(message) { }
