using System;

namespace Frontend.Vanilla.DomainSpecificLanguage;

/// <summary>
/// Marker exception to catch only error related to DSL evaluation has failed.
/// </summary>
internal sealed class DslEvaluationException(string? message = null, Exception? innerException = null) : Exception(message, innerException) { }
