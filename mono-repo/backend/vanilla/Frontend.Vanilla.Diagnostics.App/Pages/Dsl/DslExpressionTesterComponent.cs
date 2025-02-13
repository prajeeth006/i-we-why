using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Diagnostics.App.Infrastructure;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Dsl;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.WebUtilities;

namespace Frontend.Vanilla.Diagnostics.App.Pages.Dsl;

public abstract class DslExpressionTesterComponent : ComponentBase
{
    [Inject]
    public NavigationManager Navigation { get; set; }

    [Inject]
    public IVanillaApiClient VanillaApi { get; set; }

    private static string defaultBrowserUrl;

    public static readonly IReadOnlyList<SelectItem> SupportedResultTypes = new[]
    {
        new SelectItem(typeof(object), "Object (e.g. content placeholders in Sitecore)"),
        new SelectItem(typeof(void), "Void (e.g. DSL actions)"),
        new SelectItem(typeof(bool), "Boolean (e.g. filter conditions in Sitecore and DynaCon)"),
        new SelectItem(typeof(decimal), "Number"),
        new SelectItem(typeof(string), "String"),
    };

    protected DslExpressionTesterModel Model { get; private set; }

    protected string TestedExpression { get; private set; }
    protected DslExpressionTestResult TestResult { get; private set; }
    protected bool IsTestInProgress { get; private set; }

    protected override async Task OnInitializedAsync()
    {
        var url = new Uri(Navigation.Uri);
        var queryString = QueryHelpers.ParseQuery(url.Query);

        defaultBrowserUrl ??= url.GetLeftPart(UriPartial.Authority) + "/en/page?q=1";

        Model = new DslExpressionTesterModel
        {
            Expression = queryString.Get(QueryNames.Expression),
            BrowserUrl = queryString.Get(QueryNames.BrowserUrl) ?? defaultBrowserUrl,
            ResultType = queryString.Get(QueryNames.ResultType),
        };

        if (!SupportedResultTypes.Any(t => t.Value == Model.ResultType))
            Model.ResultType = SupportedResultTypes[0].Value;

        if (Validator.TryValidateObject(Model, new ValidationContext(Model), null))
            await TestExpressionAsync();
    }

    protected async Task TestExpressionAsync()
    {
        IsTestInProgress = true;
        TestedExpression = Model.Expression;
        TestResult = null;
        PutTestedExpressionToQuery();

        var url = DiagnosticApiUrls.Dsl.ExpressionTest.GetUrl(Model.Expression, Model.ResultType, Model.BrowserUrl);
        TestResult = await VanillaApi.GetAsync<DslExpressionTestResult>(url);
        IsTestInProgress = false;
    }

    private void PutTestedExpressionToQuery()
    {
        var queryString = new Dictionary<string, string> { { QueryNames.Expression, Model.Expression } };

        if (Model.BrowserUrl != defaultBrowserUrl)
            queryString.Add(QueryNames.BrowserUrl, Model.BrowserUrl);
        if (Model.ResultType != SupportedResultTypes[0].Value)
            queryString.Add(QueryNames.ResultType, Model.ResultType);

        var url = QueryHelpers.AddQueryString("dsl", queryString);
        Navigation.NavigateTo(url);
    }

    private static class QueryNames
    {
        public const string Expression = "expression";
        public const string BrowserUrl = "browserUrl";
        public const string ResultType = "resultType";
    }

    protected static string GetRedirectCode(bool permanent)
        => permanent ? "301 Moved Permanently" : "302 Found";
}

public sealed class DslExpressionTesterModel
{
    [Required]
    public string Expression { get; set; }

    [Required, AbsoluteUrl]
    [Display(Name = "Browser URL")]
    public string BrowserUrl { get; set; }

    [Required]
    public string ResultType { get; set; }
}

public sealed class AbsoluteUrlAttribute : ValidationAttribute
{
    public AbsoluteUrlAttribute()
        => ErrorMessage = "{0} must be an absolute http(s) URL.";

    public override bool IsValid(object value)
        => Uri.TryCreate((string)value, UriKind.Absolute, out var uri)
           && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
}
