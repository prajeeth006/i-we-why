using System.Linq;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.Globalization.LanguageResolvers;

/// <summary>
/// Finds a language by name within given ones.
/// </summary>
internal interface ILanguageByNameResolver
{
    LanguageInfo? Resolve(string? name);
}

internal sealed class LanguageByNameResolver(IAllowedLanguagesResolver allowedLanguagesResolver) : ILanguageByNameResolver
{
    public LanguageInfo? Resolve(string? name)
    {
        if (name.IsNullOrWhiteSpace())
            return null;

        var languages = allowedLanguagesResolver.Languages;

        return FindByFullName()
               ?? FindByLanguageCode();

        LanguageInfo? FindByFullName()
            => languages.FirstOrDefault(l => l.Culture.Name.EqualsIgnoreCase(name));

        LanguageInfo? FindByLanguageCode()
        {
            var culture = CultureInfoHelper.Find(name);

            return culture != null
                ? languages.FirstOrDefault(c => c.Culture.TwoLetterISOLanguageName == culture.TwoLetterISOLanguageName)
                : null;
        }
    }
}
