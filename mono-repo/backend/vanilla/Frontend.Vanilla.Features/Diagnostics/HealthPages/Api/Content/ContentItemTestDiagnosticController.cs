using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Content;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.Json;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UrlParameters = Frontend.Vanilla.Diagnostics.Contracts.DiagnosticApiUrls.Content.ItemTest.Parameters;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Content;

internal sealed class ContentItemTestDiagnosticController(
    IContentLoader contentLoader,
    IVanillaClientContentService clientContentService,
    IJsonSerializerFactory jsonSerializerFactory)
    : IDiagnosticApiController
{
    private readonly JsonSerializer clientContentSerializer = jsonSerializerFactory.CreateSerializer();

    public DiagnosticsRoute GetRoute() => DiagnosticApiUrls.Content.ItemTest.UrlTemplate;

    public async Task<object?> ExecuteAsync(HttpContext httpContext)
    {
        var contentId = GetDocumentId(httpContext.Request.Query);
        var options = GetLoadOptions(httpContext.Request.Query);

        // Actual content loading
        var trace = new List<object>();
        var serverContent = await contentLoader.GetContentAsync(ExecutionMode.Async(httpContext.RequestAborted), contentId, options, trace.Add);
        var successContent = serverContent as SuccessContent<IDocument>;
        var document = successContent?.Document;
        var clientContent = await GetClientContentAsync();

        return new ContentTestResultDto(
            serverContent.Status.ToString(),
            document?.GetType().ToString(),
            document?.Data.ToDiagnosticJsonObject(),
            clientContent != null ? JObject.FromObject(clientContent, clientContentSerializer) : null,
            ((serverContent as InvalidContent<IDocument>)?.Errors).NullToEmpty().Select(e => e.Value),
            (serverContent.Metadata as DocumentMetadata)?.SitecoreLoadTime.ToString(),
            trace.OfType<ContentRequest>().FirstOrDefault()?.ItemUrl,
            trace.ToDiagnosticJson(),
            successContent?.ConditionResultType.ToString());

        async Task<object?> GetClientContentAsync()
        {
            try
            {
                return await clientContentService.ConvertAsync(document, httpContext.RequestAborted, options);
            }
            catch (Exception ex)
            {
                return new { Error = ex.GetMessageIncludingInner() };
            }
        }
    }

    private static DocumentId GetDocumentId(IQueryCollection query)
    {
        var path = query.GetRequired(UrlParameters.Path);
        Enum.TryParse<DocumentPathRelativity>(query[UrlParameters.PathRelativity], ignoreCase: true, out var pathRelativity);
        var culture = CultureInfoHelper.Find(query[UrlParameters.Culture]);

        return new DocumentId(path, pathRelativity, culture);
    }

    private static ContentLoadOptions GetLoadOptions(IQueryCollection query)
    {
        bool.TryParse(query[UrlParameters.RequireTranslation], out var requireTranslation);
        Enum.TryParse<DslEvaluation>(query[UrlParameters.DslEvaluation], ignoreCase: true, out var dslEvaluation);
        bool.TryParse(query[UrlParameters.BypassCache], out var bypassCache);

        return new ContentLoadOptions
            { RequireTranslation = requireTranslation, DslEvaluation = dslEvaluation, BypassCache = bypassCache, Revision = query[UrlParameters.Revision] };
    }
}
