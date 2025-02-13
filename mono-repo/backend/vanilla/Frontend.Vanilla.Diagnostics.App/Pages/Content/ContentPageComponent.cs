using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Frontend.Vanilla.Diagnostics.App.Infrastructure;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Content;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.WebUtilities;

namespace Frontend.Vanilla.Diagnostics.App.Pages.Content;

public abstract class ContentPageComponent : ComponentBase
{
    [Inject]
    public NavigationManager Navigation { get; set; }

    [Inject]
    public IVanillaApiClient VanillaApi { get; set; }

    protected static ContentMetadataDto Metadata { get; private set; }
    protected ContentViewModel Model { get; private set; }
    protected ContentTestResultDto TestResult { get; set; }
    protected bool IsTestInProgress { get; private set; }

    protected async Task LoadAsync()
    {
        Metadata ??= await VanillaApi.GetAsync<ContentMetadataDto>(DiagnosticApiUrls.Content.MetadataUrl);

        var query = QueryHelpers.ParseQuery(new Uri(Navigation.Uri).Query);
        Model = new ContentViewModel
        {
            Path = query.Get(nameof(ContentViewModel.Path)),
            Culture = query.Get(nameof(ContentViewModel.Culture)) ?? GetUsefulCultureValue(),
            PathRelativity = query.Get(nameof(ContentViewModel.PathRelativity)) ?? Metadata.PathRelativities[0].Value,
            RequireTranslation = bool.TryParse(query.Get(nameof(ContentViewModel.RequireTranslation)), out var requireTranslation) && requireTranslation,
            DslEvaluation = query.Get(nameof(ContentViewModel.DslEvaluation)) ?? Metadata.DslEvaluations[0].Value,
            BypassCache = bool.TryParse(query.Get(nameof(ContentViewModel.BypassCache)), out var bypassCache) && bypassCache,
            Revision = query.Get(nameof(ContentViewModel.Revision)),
        };

        if (Model.Path != null)
            await GetTestResultAsync();
    }

    private async Task GetTestResultAsync()
    {
        IsTestInProgress = true;
        TestResult = null;

        var url = DiagnosticApiUrls.Content.ItemTest.GetUrl(
            Model.Path,
            Model.PathRelativity,
            Model.Culture,
            Model.RequireTranslation,
            Model.DslEvaluation,
            Model.BypassCache,
            Model.Revision);

        TestResult = await VanillaApi.GetAsync<ContentTestResultDto>(url);
        IsTestInProgress = false;
    }

    protected async Task SubmitAsync()
    {
        PutTestedContentToQueryForEasySharing();
        await GetTestResultAsync();
    }

    private void PutTestedContentToQueryForEasySharing()
    {
        var queryString = new Dictionary<string, string>
        {
            { nameof(ContentViewModel.Path), Model.Path },
            { nameof(ContentViewModel.Culture), Model.Culture },
            { nameof(ContentViewModel.PathRelativity), Model.PathRelativity },
            { nameof(ContentViewModel.RequireTranslation), Model.RequireTranslation.ToString() },
            { nameof(ContentViewModel.DslEvaluation), Model.DslEvaluation },
            { nameof(ContentViewModel.BypassCache), Model.BypassCache.ToString() },
        };

        if (!string.IsNullOrWhiteSpace(Model.Revision))
        {
            queryString.Add(nameof(ContentViewModel.Revision), Model.Revision);
        }

        var url = QueryHelpers.AddQueryString("content", queryString);
        Navigation.NavigateTo(url);
    }

    public sealed class ContentViewModel
    {
        [Required]
        public string Path { get; set; }

        public string Culture { get; set; }
        public string PathRelativity { get; set; }
        public bool RequireTranslation { get; set; }
        public string DslEvaluation { get; set; }
        public bool BypassCache { get; set; }
        public string Revision { get; set; }
    }

    protected static MarkupString GetSitecoreHostEmphasized()
    {
        var html = HttpUtility.HtmlEncode(Metadata.SitecoreHost.ToString());

        foreach (var toEmphasize in new[] { "test", "prod" })
            html = html.Replace(toEmphasize, $@"<strong style=""font-size: 150%"">{toEmphasize}</strong>");

        return new MarkupString(html);
    }

    private static string GetUsefulCultureValue()
    {
        var useful = new[] { "en-US", "en-GB", "de-DE", "de-AT" };
        var actual = Metadata.Cultures.Select(c => c.Value).ToList();

        return useful.FirstOrDefault(actual.Contains) ?? actual[0];
    }
}
