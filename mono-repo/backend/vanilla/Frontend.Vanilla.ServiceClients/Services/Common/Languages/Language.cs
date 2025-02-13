#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Common.Languages;

public sealed class Language(string cultureName = null, string translatedName = null, string platformId = null)
{
    public string CultureName { get; } = cultureName;
    public string TranslatedName { get; } = translatedName;
    public string PlatformId { get; } = platformId;
}

internal sealed class LanguagesResponse
{
    public Language[] Languages { get; set; }
}
