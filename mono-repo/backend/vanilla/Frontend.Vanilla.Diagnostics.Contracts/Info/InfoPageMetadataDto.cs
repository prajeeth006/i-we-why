namespace Frontend.Vanilla.Diagnostics.Contracts.Info;

public sealed class InfoPageMetadataDto(string urlPath, string name, string shortDescription)
{
    public string UrlPath { get; } = urlPath;
    public string Name { get; } = name;
    public string ShortDescription { get; } = shortDescription;
}
