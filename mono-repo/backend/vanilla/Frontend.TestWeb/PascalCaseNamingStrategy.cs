using Newtonsoft.Json.Serialization;

namespace Frontend.TestWeb;

internal class PascalCaseNamingStrategy : NamingStrategy
{
    /// <summary>
    /// Resolves the specified property name.
    /// </summary>
    /// <param name="name">The property name to resolve.</param>
    /// <returns>The resolved property name.</returns>
    protected override string ResolvePropertyName(string name)
    {
        return ToPascalCase(name);
    }

    private static string ToPascalCase(string s)
    {
        if (string.IsNullOrEmpty(s) || !char.IsUpper(s[0]))
        {
            return s;
        }

        var chars = s.ToCharArray();

        for (var i = 0; i < chars.Length; i++)
        {
            if (i == 0 && !char.IsUpper(chars[i]))
            {
                chars[i] = ToUpper(chars[i]);

                break;
            }

            if (i == 0)
            {
                break;
            }

            if (i == 1 && !char.IsUpper(chars[i]))
            {
                break;
            }

            var hasNext = i + 1 < chars.Length;

            if (i > 0 && hasNext && !char.IsUpper(chars[i + 1]))
            {
                if (char.IsSeparator(chars[i + 1]))
                {
                    chars[i] = ToLower(chars[i]);
                }

                break;
            }

            chars[i] = ToLower(chars[i]);
        }

        return new string(chars);
    }

    private static char ToLower(char c)
    {
#if HAVE_CHAR_TO_LOWER_WITH_CULTURE
            c = char.ToLower(c, CultureInfo.InvariantCulture);
#else
        c = char.ToLowerInvariant(c);
#endif
        return c;
    }

    private static char ToUpper(char c)
    {
#if HAVE_CHAR_TO_UPPER_WITH_CULTURE
            c = char.ToUpper(c, CultureInfo.InvariantCulture);
#else
        c = char.ToUpperInvariant(c);
#endif
        return c;
    }
}
