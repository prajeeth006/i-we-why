using System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.System.Text;

/// <summary>
/// Extension methods for <see cref="StringBuilder" />.
/// </summary>
internal static class StringBuilderExtensions
{
    public static int IndexOf(this StringBuilder builder, string substr, int startIndex = 0)
    {
        Guard.GreaterOrEqual(startIndex, 0, nameof(startIndex));
        Guard.LessOrEqual(startIndex, builder.Length, nameof(startIndex));

        for (var i = startIndex; i <= builder.Length - substr.Length; i++)
        for (var j = 0; j <= substr.Length; j++)
        {
            if (j == substr.Length) // If matched
                return i;

            if (substr[j] != builder[i + j])
                break;
        }

        return -1;
    }
}
