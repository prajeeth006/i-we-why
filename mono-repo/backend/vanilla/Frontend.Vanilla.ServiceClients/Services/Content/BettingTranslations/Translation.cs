#nullable enable

using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Content.BettingTranslations;
#pragma warning disable CS1591 // Just dummy data -> no docs needed
public sealed class Translation(int id = 0, string? name = null) : IPosApiResponse<Translation>
{
    public int Id { get; } = id;
    public string? Name { get; } = name;

    Translation IPosApiResponse<Translation>.GetData() => this;
}
