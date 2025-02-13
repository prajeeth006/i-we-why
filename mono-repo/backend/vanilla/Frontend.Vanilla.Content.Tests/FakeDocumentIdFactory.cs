using System.Globalization;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Tests;

public sealed class FakeDocumentIdFactory : IDocumentIdFactory
{
    public string Prefix { get; set; }
    public DocumentPathRelativity PathRelativity { get; set; }

    public DocumentId Create(RequiredString pathFromCms, CultureInfo culture, string idFromCms = null)
    {
        Guard.NotWhiteSpace(pathFromCms, nameof(pathFromCms));
        Guard.NotNull(culture, nameof(culture));

        return new DocumentId(Prefix + pathFromCms, PathRelativity, culture);
    }
}
