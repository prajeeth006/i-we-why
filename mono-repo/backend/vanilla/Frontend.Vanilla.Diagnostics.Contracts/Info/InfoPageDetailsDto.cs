using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Diagnostics.Contracts.Info;

public sealed class InfoPageDetailsDto(string name, string shortDescription, string? descriptionHtml, JToken detailsJson)
{
    public string Name { get; } = name;
    public string ShortDescription { get; } = shortDescription;
    public string? DescriptionHtml { get; } = descriptionHtml;
    public JToken DetailsJson { get; } = detailsJson;
}
