using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Dsl;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using UrlParameters = Frontend.Vanilla.Diagnostics.Contracts.DiagnosticApiUrls.Dsl.ExpressionTest.Parameters;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Dsl;

internal sealed class DslExpressionTestDiagnosticController(IDslCompiler compiler, IBrowserUrlProvider browserUrlProvider) : IDiagnosticApiController
{
    public DiagnosticsRoute GetRoute() => DiagnosticApiUrls.Dsl.ExpressionTest.UrlTemplate;

    public Task<object?> ExecuteAsync(HttpContext httpContext)
    {
        var expression = httpContext.Request.Query.GetRequired(UrlParameters.Expression);
        var resultType = Type.GetType(httpContext.Request.Query[UrlParameters.ResultType]!, throwOnError: true)!;
        var skipResultValue = false;

        if (resultType == typeof(void))
        {
            resultType = typeof(VoidDslResult);
            skipResultValue = true;
        }

        return (Task<object?>)this.InvokeGeneric(nameof(TestExpressionAsync), resultType, expression, skipResultValue, httpContext.RequestAborted);
    }

    private async Task<object?> TestExpressionAsync<TResult>(string expression, bool skipResultValue, CancellationToken cancellationToken)
        where TResult : notnull
    {
        IDslExpression<TResult> expr;
        IReadOnlyList<TrimmedRequiredString> warnings;

        try
        {
            (expr, warnings) = compiler.Compile<TResult>(expression);
        }
        catch (Exception ex)
        {
            var syntaxError = ex.GetMessageIncludingInner();

            return new DslExpressionTestResult(syntaxError);
        }

        var serverEvalTask = InvokeAsync<object?>(async () => await expr.EvaluateAsync(cancellationToken));
        var clientEval = await InvokeAsync<ClientEvaluationResult<TResult>?>(async () => await expr.EvaluateForClientAsync(cancellationToken));
        var serverEval = await serverEvalTask;
        var redirect = browserUrlProvider.PendingRedirect;

        // Final values are double-serialized to emphasize type e.g. string "true" vs boolean true
        var testResult = new DslExpressionTestResult(
            parsedExpression: expr.ToString()!,
            serverEvalResultJson: !skipResultValue && serverEval.Result != null
                ? JsonConvert.ToString(serverEval.Result)
                : null,
            serverEval.Error,
            clientEvalResultJson: !skipResultValue && clientEval.Result?.HasFinalValue == true
                ? JsonConvert.ToString(clientEval.Result.Value)
                : null,
            clientEvalClientExpression: clientEval.Result?.HasFinalValue == false
                ? clientEval.Result.ClientExpression
                : null,
            clientEvalError: clientEval.Error,
            dslActionRedirect: redirect != null
                ? new DslActionRedirectDto(redirect.Url, redirect.Permanent)
                : null,
            warnings.ConvertAll(w => w.Value));

        return testResult;
    }

    private static async Task<(T Result, string? Error)> InvokeAsync<T>(Func<Task<T>> evalFunc)
    {
        try
        {
            var result = await evalFunc();

            return (result, null);
        }
        catch (Exception ex)
        {
#nullable disable
            return (default, ex.GetMessageIncludingInner());
        }
    }
}
