using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Features.WebIntegration.Core.DynaconAppBoot;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Features.LabelResolution;

namespace Frontend.Vanilla.Features.WebIntegration.Core.Labels;

internal interface IHostPathResolver
{
    string Resolve();
    Dictionary<string, string> GetAllHostPaths();
}
internal sealed class HostPathResolver(ILabelResolver labelResolver, IDynaconAppBootRestClientService dynaconRestClientService, IDynaConParameterExtractor dynaConParameterExtractor) : IHostPathResolver
{
    private const string DefaultConfig = "default";

    public string Resolve()
    {
        return Get(dynaConParameterExtractor.Product);
    }

    private string Get(string product)
    {
        var hostPaths = GetAllHostPaths();

        var productHostPath = hostPaths.FirstOrDefault(x => x.Key.EqualsIgnoreCase(product));
        if (!productHostPath.Value.IsNullOrEmpty())
        {
            return productHostPath.Value;
        }

        throw new Exception($"Failed to map {nameof(HostPath)} for product {product} within {hostPaths}. Check Labels.Defaults.ProductHostPath mapping.");
    }

    public Dictionary<string, string> GetAllHostPaths()
    {
        var labelsDefaults = dynaconRestClientService.GetLabelsDefaults();
        var label = labelResolver.Get();
        var hostPaths = labelsDefaults.ProductHostPath.Values.SelectMany(x => x.Value);
        var defaultHostPath = hostPaths.First(x => x.Key.EqualsIgnoreCase(DefaultConfig));
        var labelHostPath = hostPaths.FirstOrDefault(x => label.EqualsIgnoreCase(x.Key));

        if (labelHostPath.Value == null) return defaultHostPath.Value;

        foreach (var item in labelHostPath.Value)
        {
            defaultHostPath.Value[item.Key] = item.Value;
        }

        return defaultHostPath.Value;
    }
}
