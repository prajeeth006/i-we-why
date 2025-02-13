using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Net;

namespace Frontend.Vanilla.Features.WebIntegration.Core.DynaconAppBoot;

internal sealed class DynaconAppBootConfigurationResponse(Configuration configuration)
{
    public Configuration Configuration { get; set; } = configuration;
}

internal class Configuration(LabelsDefaults labelsDefaults, CompanyInternalNetwork companyInternalNetwork)
{
    [JsonProperty("Labels.Defaults")]
    public LabelsDefaults LabelsDefaults { get; set; } = labelsDefaults;

    [JsonProperty("Networking.CompanyInternalNetwork")]
    public CompanyInternalNetwork CompanyInternalNetwork { get; set; } = companyInternalNetwork;
}

internal class LabelsDefaults(ProductContainer product, ProductHostPathContainer productHostpath)
{
    public ProductContainer Product { get; set; } = product;
    public ProductHostPathContainer ProductHostPath { get; set; } = productHostpath;
}

internal class ProductContainer(List<ProductValue> values)
{
    public List<ProductValue> Values { get; set; } = values;
}

internal class ProductValue(Dictionary<string, string[]> value)
{
    public Dictionary<string, string[]> Value { get; set; } = value;
}

internal class ProductHostPathContainer(List<ProductHostPathValue> values)
{
    public List<ProductHostPathValue> Values { get; set; } = values;
}

internal class ProductHostPathValue(Dictionary<string, Dictionary<string, string>> value)
{
    public Dictionary<string, Dictionary<string, string>> Value { get; set; } = value;
}

internal class CompanyInternalNetwork(Subnets subnets)
{
    public Subnets Subnets { get; set; } = subnets;
}

internal class Subnets(List<SubnetValue> values)
{
    public List<SubnetValue> Values { get; set; } = values;
}

internal class SubnetValue(List<string> value)
{
    public List<string> Value { get; set; } = value;
}

internal static class SubnetValueExtension
{
    public static IReadOnlyList<IpSubnet> Convert(this SubnetValue? subnets)
    {
        var ipSubnets = new List<IpSubnet>();
        if (subnets == null || subnets.Value.IsNullOrEmpty()) return ipSubnets;

        ipSubnets.AddRange(subnets.Value.Select(s => new IpSubnet(s)));

        return ipSubnets;
    }
}
