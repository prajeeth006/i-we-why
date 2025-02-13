using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.WebIntegration.Core;

namespace Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;

/// <summary>
/// Creates <see cref="DynaConEngineSettings" /> based on the appsettings section and parameters provided in DI.
/// </summary>
internal sealed class DynaConEngineSettingsFactory(
    IDynaConConfiguration config,
    IEnvironmentNameProvider environmentNameProvider,
    IDynaConParameterReplacer parameterReplacer,
    IFileSystem fileSystem,
    IEnumerable<DynaConParameter> internalParams)
{
    private readonly IReadOnlyList<DynaConParameter> internalParams = internalParams.ToArray();

    public DynaConEngineSettings Create()
    {
        try
        {
            var parameters = config.Parameters
                .Select(e => new DynaConParameter(e.Key, e.Value))
                .Concat(config.SkipInternalParameters == true ? Array.Empty<DynaConParameter>() : internalParams)
                .ToArray();

            var builder = new DynaConEngineSettingsBuilder(parameters)
            {
                AdditionalInfo =
                {
                    { "Config", config.SerializeToString() },
                    { "Parameters from Autofac", internalParams },
                },
            };

            // Keep builder defaults if value is not specified in section
            if (config.Host != null)
                builder.Host = new HttpUri(config.Host);
            if (!string.IsNullOrEmpty(config.Version))
                builder.ApiVersion = config.Version;
            if (!string.IsNullOrEmpty(config.ChangesetFallbackFile))
                builder.ChangesetFallbackFile = config.ChangesetFallbackFile;
            if (!string.IsNullOrEmpty(config.ContextHierarchyFallbackFile))
                builder.ContextHierarchyFallbackFile = parameterReplacer.Replace(config.ContextHierarchyFallbackFile, parameters);
            if (config.LocalOverridesMode != null)
                builder.LocalOverridesMode = config.LocalOverridesMode.Value;
            if (!string.IsNullOrEmpty(config.LocalOverridesFile))
                builder.LocalOverridesFile = $"{fileSystem.AppDirectory}/{config.LocalOverridesFile}";
            if (config.NetworkTimeout != null)
                builder.NetworkTimeout = config.NetworkTimeout.Value;
            builder.ValidatableChangesetsNetworkTimeout = config.ValidatableChangesetsNetworkTimeout ?? builder.NetworkTimeout;
            if (config.PastChangesetsMaxCount != null)
                builder.PastChangesetsMaxCount = config.PastChangesetsMaxCount.Value;
            if (config.PastServiceCallsMaxCount != null)
                builder.PastServiceCallsMaxCount = config.PastServiceCallsMaxCount.Value;
            if (config.PastProactivelyValidatedChangesetsMaxCount != null)
                builder.PastProactivelyValidatedChangesetsMaxCount = config.PastProactivelyValidatedChangesetsMaxCount.Value;
            if (config.AdminWeb != null)
                builder.AdminWeb = new HttpUri(config.AdminWeb);
            if (config.SendFeedback != null)
                builder.SendFeedback = config.SendFeedback.Value;
            if (config.ChangesPollingInterval != null)
                builder.ChangesPollingInterval = config.ChangesPollingInterval;
            if (config.ProactiveValidationPollingInterval != null)
                builder.ProactiveValidationPollingInterval = config.ProactiveValidationPollingInterval;
            if (config.ChangesetId != null)
                builder.ExplicitChangesetId = config.ChangesetId;
            if (!string.IsNullOrEmpty(config.DynaconAppBootFallbackFile))
                builder.DynaconAppBootFallbackFile = config.DynaconAppBootFallbackFile;

            if (environmentNameProvider.IsProduction)
            {
                if (builder.ChangesPollingInterval == null)
                    throw new Exception("PollingInterval must be specified (enabled) on PROD.");
                if (builder.ChangesetFallbackFile == null)
                    throw new Exception("FallbackFile must be specified (enabled) on PROD.");
                if (builder.LocalOverridesMode != LocalOverridesMode.Disabled)
                    throw new Exception("LocalOverridesMode must be 'Disabled' on PROD.");
                if (!builder.SendFeedback)
                    throw new Exception("SendFeedback must be true (enabled) on PROD.");
                if (builder.ExplicitChangesetId != null)
                    throw new Exception("ExplicitChangesetId must be null (disabled) on PROD.");
            }

            return builder.Build();
        }
        catch (Exception ex)
        {
            const string msg = "Failed processing DynaCon section from appsettings. See https://docs.vanilla.intranet/configuration-system.html#dynacon-service-settings";

            throw new Exception(msg, ex);
        }
    }
}
