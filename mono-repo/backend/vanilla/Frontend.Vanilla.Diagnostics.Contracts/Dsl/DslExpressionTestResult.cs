using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Diagnostics.Contracts.Dsl;

[method: JsonConstructor]
public sealed class DslExpressionTestResult(
    string? syntaxError,
    string? parsedExpression,
    string? serverEvalResultJson,
    string? serverEvalError,
    string? clientEvalResultJson,
    string? clientEvalClientExpression,
    string? clientEvalError,
    DslActionRedirectDto? dslActionRedirect,
    IEnumerable<string> warnings)
{
    public string? SyntaxError { get; } = syntaxError;
    public string? ParsedExpression { get; } = parsedExpression;
    public string? ServerEvalResultJson { get; } = serverEvalResultJson;
    public string? ServerEvalError { get; } = serverEvalError;
    public string? ClientEvalResultJson { get; } = clientEvalResultJson;
    public string? ClientEvalClientExpression { get; } = clientEvalClientExpression;
    public string? ClientEvalError { get; } = clientEvalError;
    public DslActionRedirectDto? DslActionRedirect { get; } = dslActionRedirect;
    public IReadOnlyList<string> Warnings { get; } = warnings.ToList();

    public DslExpressionTestResult(string syntaxError)
        : this(syntaxError, null, null, null, null, null, null, null, Array.Empty<string>()) { }

    public DslExpressionTestResult(
        string parsedExpression,
        string? serverEvalResultJson,
        string? serverEvalError,
        string? clientEvalResultJson,
        string? clientEvalClientExpression,
        string? clientEvalError,
        DslActionRedirectDto? dslActionRedirect,
        IEnumerable<string> warnings)
        : this(null,
            parsedExpression,
            serverEvalResultJson,
            serverEvalError,
            clientEvalResultJson,
            clientEvalClientExpression,
            clientEvalError,
            dslActionRedirect,
            warnings) { }
}

public sealed class DslActionRedirectDto(Uri url, bool permanent)
{
    public Uri Url { get; } = url;
    public bool Permanent { get; } = permanent;
}
