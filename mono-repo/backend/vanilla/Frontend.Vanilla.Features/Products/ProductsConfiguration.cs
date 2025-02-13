using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.Products;

internal interface IProductsConfiguration
{
    IReadOnlyDictionary<string, ProductInfo> Products { get; }
}

internal sealed class ProductsConfiguration : IProductsConfiguration
{
    public const string FeatureName = "HostApp.Products";

    [Required, RequiredKeys, RequiredValues]
    [UniqueKeys(StringComparison.OrdinalIgnoreCase)]
    public IReadOnlyDictionary<string, ProductInfo> Products { get; set; } = new Dictionary<string, ProductInfo>();
}

internal sealed class ProductInfo(bool enabled, bool enabledProductApi, string? apiBaseUrl)
{
    public bool Enabled { get; } = enabled;
    public bool EnabledProductApi { get; } = enabledProductApi;
    public string? ApiBaseUrl { get; } = apiBaseUrl;
}
