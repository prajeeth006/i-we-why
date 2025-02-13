using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.Configuration.DynaCon.RestService;

/// <summary>
/// Provides URLs for accessing DynaCon endpoints.
/// </summary>
internal interface IConfigurationServiceUrls
{
    HttpUri CurrentChangeset { get; }
    HttpUri ChangesetHistoryAdmin { get; }
    HttpUri ValidatableChangesets { get; }
    HttpUri Changeset(long changesetId);
    HttpUri ConfigurationChanges(long fromChangesetId);
    HttpUri Feedback(long changesetId, long? commitId);
    TrimmedRequiredString FeatureAdminPattern { get; }
    TrimmedRequiredString ChangesetAdminPattern { get; }
    TrimmedRequiredString ServiceAdminPattern { get; }
}

internal sealed class ConfigurationServiceUrls : IConfigurationServiceUrls
{
    public HttpUri CurrentChangeset { get; }
    public HttpUri ChangesetHistoryAdmin { get; }
    public HttpUri ValidatableChangesets { get; }
    public TrimmedRequiredString FeatureAdminPattern { get; }
    public TrimmedRequiredString ChangesetAdminPattern { get; }
    public TrimmedRequiredString ServiceAdminPattern { get; }

    public ConfigurationServiceUrls(DynaConEngineSettings engineSettings, TenantSettings tenantSettings)
    {
        var queryParams = tenantSettings.Parameters.ConvertAll(p => (p.Name, (string?)p.Value));

        CurrentChangeset = engineSettings.Host.BuildNew(u => u
            .AppendPathSegment(engineSettings.ApiVersion)
            .AppendPathSegment("configuration")
            .AddQueryParameters(queryParams.Append(("enableExtendedContext", "true"))));

        ChangesetHistoryAdmin = engineSettings.AdminWeb.BuildNew(u => u
            .AppendPathSegment("goto/history")
            .AddQueryParameters(queryParams));

        ValidatableChangesets = CurrentChangeset.BuildNew(u => u
            .AppendPathSegment("validatablechangesets"));

        ServiceAdminPattern = engineSettings.AdminWeb.BuildNew(u => u
                                  .AppendPathSegment("goto"))
                              + "?service={0}";

        FeatureAdminPattern = engineSettings.AdminWeb.BuildNew(u => u
                                  .AppendPathSegment("goto")
                                  .AddQueryParameters(queryParams.Where(p =>
                                      p.Name.EqualsIgnoreCase(DynaConParameter.ServiceName)))) // Feature is always within a service with particular version
                              + "&feature={0}";

        ChangesetAdminPattern = engineSettings.AdminWeb.BuildNew(u => u
                .AppendPathSegment("changesets/{0}"))
            .ToString();
    }

    public HttpUri Changeset(long changesetId)
        => CurrentChangeset.BuildNew(u => u
            .AddQueryParameters(("changesetId", changesetId.ToInvariantString())));

    public HttpUri ConfigurationChanges(long fromChangesetId)
        => CurrentChangeset.BuildNew(u => u
            .AppendPathSegment("changes/expand")
            .AddQueryParameters(("fromChangesetId", fromChangesetId.ToInvariantString())));

    public HttpUri Feedback(long changesetId, long? commitId)
        => CurrentChangeset.BuildNew(u => u
            .AppendPathSegment("feedback")
            .AddQueryParametersIfValueNotWhiteSpace(
                ("changesetId", changesetId.ToInvariantString()),
                ("commitId", commitId?.ToInvariantString())));
}
