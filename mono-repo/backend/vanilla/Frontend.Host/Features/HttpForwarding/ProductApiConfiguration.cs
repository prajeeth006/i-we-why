namespace Frontend.Host.Features.HttpForwarding;

internal interface IProductApiConfiguration
{
    string Host { get; }
}

internal sealed class ProductApiConfiguration : IProductApiConfiguration
{
    public const string FeatureName = "Host.Features.ProductApi";

    public required string Host { get; set; }
}
