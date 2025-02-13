using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.DomainSpecificActions.Configuration;

/// <summary>
/// Creates <see cref="IDsaConfiguration" /> from DTO from Dynacon.
/// </summary>
internal sealed class DsaConfigurationFactory(Func<IDslCompiler> dslCompiler, IDsaRegionSelector regionSelector, IDsaPlaceholderReplacer placeholderReplacer)
    : IConfigurationFactory<IDsaConfiguration, DsaConfigurationDto>
{
    private readonly Lazy<IDslCompiler> dslCompiler = dslCompiler.ToLazy();

    public WithWarnings<IDsaConfiguration> Create(DsaConfigurationDto configDto)
    {
        var allWarnings = new List<TrimmedRequiredString>();
        var serverAction = CompileConfigAction(RegionNames.Server);
        var clientAction = CompileConfigAction(RegionNames.Client);

        if (serverAction?.Metadata.IsClientOnly == true)
            throw new Exception("Server-side DSL action can't use client-only provider members because it's supposed to be executed on the server.");

        var result = new DsaConfiguration(serverAction, clientAction);

        return result.WithWarnings<IDsaConfiguration>(allWarnings);

        IDslAction? CompileConfigAction(string regionName)
        {
            if (configDto.HtmlDocumentDslAction.IsNullOrWhiteSpace())
                return null;

            var actionString = regionSelector.SelectRegion(configDto.HtmlDocumentDslAction, regionName, RegionNames.All);

            if (actionString.IsNullOrWhiteSpace())
                return null;

            actionString = placeholderReplacer.Replace(actionString, configDto.HtmlDocumentPlaceholders);

            if (actionString.IsNullOrWhiteSpace())
                return null;

            var (action, actionWarnings) = dslCompiler.Value.CompileAction(actionString);

            if (action.Metadata.IsAlreadyEvaluated)
                return null;

            allWarnings.Add(actionWarnings);

            return action;
        }
    }

    private static class RegionNames
    {
        public static readonly TrimmedRequiredString Server = "ONLY-ON-SERVER";
        public static readonly TrimmedRequiredString Client = "ONLY-ON-CLIENT";

        public static readonly IReadOnlyList<TrimmedRequiredString> All = new[] { Server, Client };
    }
}
