namespace Frontend.Host.Features.HttpForwarding;

internal static class ProductApiHeaders
{
    public static readonly Dictionary<ProductApi, string> All =
        ProductApi.List.ToDictionary(k => k, v => $"x-bwin-{v.Value}");

    public static string ExtractProductIdFromHeader(string headerName)
        => headerName.Substring(7, headerName.Length - 7 - 4); // extracts productId from x-bwin-{productId}-api
}
