using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Configuration;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Configuration;

internal sealed class ConfigReportDiagnosticController(
    IConfigurationReporter configReporter,
    IEnumerable<IConfigurationInfo> configInfos,
    DynaConEngineSettings engineSettings)
    : IDiagnosticApiController
{
    public DiagnosticsRoute GetRoute() => DiagnosticApiUrls.Configuration.Report;

    public async Task<object?> ExecuteAsync(HttpContext httpContext)
    {
        var maskSensitiveData = httpContext.Request.Headers[HttpHeaders.Referer].First()?.Contains("/health") == true;
        var report = await configReporter.GetReportAsync(httpContext.RequestAborted, maskSensitiveData);
        var actualChangeset = report.Snapshot!.OverriddenChangeset ?? report.Snapshot.ActiveChangeset;
        var overridesJson = report.LocalOverrides?.OverridesJson ?? new JObject();

        var dto = new ConfigurationReportDto(
            activeChangesetId: actualChangeset.Id,
            activeChangesetFeatures: actualChangeset.Features
                .Select(f => (
                    Name: f.Key.Value,
                    Configs: f.Value,
                    CurrentConfig: CurrentConfigurationResolver.ResolveConfig(f.Value, p => report.VariationContextForThisRequest![p]),
                    CriticalityLevel: actualChangeset.Dto.Configuration[f.Key.Value].Select(x => x.Value.CriticalityLevel).FirstOrDefault() ?? 0))
                .ToDictionary(
                    f => f.Name,
                    f => (IReadOnlyList<FeatureConfigurationDto>)f.Configs.ConvertAll(c => new FeatureConfigurationDto(
                        instanceJson: (JObject)c.Instance.ToDiagnosticJson(),
                        context: c.Context.Properties.ToDictionary(
                            p => p.Key.Value,
                            p => (IReadOnlyList<string>)p.Value.ConvertAll(v => v.Value)),
                        priority: c.Context.Priority,
                        currentlyUsed: c == f.CurrentConfig,
                        criticalityLevel: f.CriticalityLevel))),
            dynaConJson: (JObject)report.Snapshot.ActiveChangeset.Dto.ToDiagnosticJson(),
            overridesJson: overridesJson,
            futureChangesetIds: report.Snapshot.FutureChangesets
                .OfType<IValidChangeset>()
                .Select(c => c.Id)
                .ToList(),
            changesetChanges: new
            {
                ActiveChangesetInfo = actualChangeset.Info.ToDiagnosticJson(),
                ChangesPolling = report.PollingForChanges,
                FutureChangesets = report.Snapshot.FutureChangesets.ConvertAll(c => new
                {
                    c.Id,
                    c.ValidFrom,
                    c.Url,
                    Errors = (c as IFailedChangeset)?.Errors ?? (object)"Valid",
                }),
                PastChangesets = report.Configuration?.Past,
            }.ToDiagnosticJson(),
            errorsJson: report.CriticalErrors.ToDiagnosticJson(),
            warningsJson: report.Warnings.ToDiagnosticJson(),
            settingsJson: report.Settings!.ToDiagnosticJson(),
            multitenancyJson: report.Multitenancy!.ToDiagnosticJson(),
            networkTraffic: report.ServiceCalls!.ToDiagnosticJson(),
            proactiveValidation: report.ProactiveValidation!.ToDiagnosticJson(),
            fileFallback: new { report.ChangesetFallbackFile, report.ContextHierarchyFallbackFile }.ToDiagnosticJson(),
            overridesMode: engineSettings.LocalOverridesMode != LocalOverridesMode.Disabled ? engineSettings.LocalOverridesMode.ToString() : null,
            currentVariationContext: report.VariationContextForThisRequest!
                .OrderBy(x => x.Key.Value, StringComparer.OrdinalIgnoreCase)
                .ToDictionary(x => x.Key.Value, x => x.Value.ToString()),
            dynaConServiceNames: engineSettings.TenantBlueprint.Parameters
                .Where(p => p.Name.EqualsIgnoreCase(DynaConParameter.ServiceName))
                .Select(p => p.Value)
                .OrderBy(s => s, StringComparer.OrdinalIgnoreCase)
                .ToList(),
            dotNetClasses: configInfos
                .OrderBy(c => c.FeatureName, RequiredStringComparer.OrdinalIgnoreCase)
                .ToDictionary(c => c.FeatureName, c => new
                {
                    c.ServiceType,
                    c.ImplementationType,
                    c.FactoryType,
                    c.ImplementationParameters,
                })
                .ToDiagnosticJson(),
            urls: new ConfigurationUrlsDto(
                serviceAdminPattern: report.Urls!.ServiceAdminPattern,
                featureAdminPattern: report.Urls.FeatureAdminPattern,
                changesetAdminPattern: report.Urls.ChangesetAdminPattern,
                changesetHistoryAdmin: report.Urls.ChangesetHistoryAdmin,
                activeChangesetApi: report.Urls.Changeset(actualChangeset.Id)));

        return dto;
    }
}
