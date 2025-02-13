using Frontend.Vanilla.Features.LabelResolution;
using Frontend.Vanilla.Features.WebIntegration.Core.DynaconAppBoot;
using System;
using System.Linq;

namespace Frontend.Vanilla.Features.WebIntegration.Core.Labels;

internal interface IDefaultProductResolver
{
    string Resolve();
}

internal sealed class DefaultProductResolver(ILabelResolver labelResolver, IDynaconAppBootRestClientService dynaconRestClientService) : IDefaultProductResolver
{
    public string Resolve()
    {
        var labelsDefaults = dynaconRestClientService.GetLabelsDefaults();
        var defaultProducts = labelsDefaults.Product.Values.SelectMany(x => x.Value);
        var label = labelResolver.Get();
        var product = defaultProducts.FirstOrDefault(x => x.Value.Contains(label));
        if (product.Key == null)
        {
            throw new Exception($"Default product for label {label} not found in Labels.Defaults.Product config.");
        }

        return product.Key;
    }
}
